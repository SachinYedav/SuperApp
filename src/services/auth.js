import config from "@/conf/config";
import { Client, Account, ID, Functions, AuthenticatorType } from "appwrite";
import databaseService from "./database";

export class AuthService {
  client = new Client();
  account;
  functions;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
    this.functions = new Functions(this.client);
  }

  /* ============================================================
       1. CORE AUTHENTICATION (Session & Account Management)
    ============================================================ */

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        await this.login({ email, password });
        await databaseService.createUserProfile({
          userId: userAccount.$id,
          name: name,
          email: email,
        });
        return this.getCurrentUser();
      }
    } catch (error) {
      console.error("AuthService :: createAccount :: error", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async googleLogin() {
    try {
      return this.account.createOAuth2Session(
        "google",
        `${window.location.origin}/`,
        `${window.location.origin}/fail`,
      );
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
    } catch (error) {
      console.error("AuthService :: logout :: error", error);
    }
  }

  async getCurrentUser() {
    try {
      const authUser = await this.account.get();
      let userProfile = await databaseService.getUserProfile(authUser.$id);

      if (!userProfile) {
        userProfile = await databaseService.createUserProfile({
          userId: authUser.$id,
          name: authUser.name,
          email: authUser.email,
        });
      }

      return {
        ...authUser,
        ...userProfile,
        $id: authUser.$id,
        docId: userProfile?.$id,
      };
    } catch (error) {
      return null;
    }
  }
  
  async getCurrentSession() {
    try {
      return await this.account.getSession("current");
    } catch (error) {
      return null;
    }
  }

  /* ============================================================
       2. USER SETTINGS & PREFERENCES
    ============================================================ */

  async updateProfile(docId, data) {
    try {
      return await databaseService.updateUserProfile(docId, data);
    } catch (e) {
      throw e;
    }
  }
  async updateName(name) {
    try {
      return await this.account.updateName(name);
    } catch (e) {}
  }
  async updatePassword(newPass, oldPass) {
    try {
      return await this.account.updatePassword(newPass, oldPass);
    } catch (e) {
      throw e;
    }
  }
  async updatePreferences(prefs) {
    try {
      const u = await this.account.get();
      return await this.account.updatePrefs({ ...u.prefs, ...prefs });
    } catch (e) {
      throw e;
    }
  }
  async getPreferences() {
    try {
      const u = await this.account.get();
      return u.prefs || {};
    } catch {
      return {};
    }
  }
  async getSessions() {
    try {
      return await this.account.listSessions();
    } catch {
      return { sessions: [] };
    }
  }
  async deleteSession(sessionId) {
    try {
      await this.account.deleteSession(sessionId);
      return true;
    } catch (e) {
      throw e;
    }
  }

  /* ============================================================
       3. CLOUD FUNCTIONS
    ============================================================ */

  /**
   * Verifies password by calling the cloud function.
   * Automatically fetches the current user's email to send with the request.
   */
  async verifySessionPassword(password) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error("No active session");

      const execution = await this.functions.createExecution(
        config.appwriteFunctionId,
        JSON.stringify({
          action: "verifyPassword",
          email: user.email,
          password: password,
        }),
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" },
      );

      const response = JSON.parse(execution.responseBody);

      // Debug Log 
      console.log("Verify Response:", response);

      if (response.success && response.valid) {
        return { valid: true };
      } else if (response.error) {
        throw new Error(response.error);
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error("AuthService :: verifySessionPassword :: error", error);
      return { valid: false, error: error.message };
    }
  }

  /**
   * Schedules account deletion.
   */
  async requestAccountDeletion() {
    try {
      const execution = await this.functions.createExecution(
        config.appwriteFunctionId,
        JSON.stringify({ action: "deleteAccount" }), // Payload
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" },
      );

      const response = JSON.parse(execution.responseBody);

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response.error || "Deletion failed on server");
      }
    } catch (error) {
      console.error("AuthService :: requestAccountDeletion :: error", error);
      return { success: false, error: error.message };
    }
  }

  /* ============================================================
       4. PASSWORD RECOVERY
    ============================================================ */

  async sendPasswordRecovery(email) {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      return await this.account.createRecovery(email, redirectUrl);
    } catch (error) {
      throw error;
    }
  }

  async completePasswordRecovery(userId, secret, password, passwordAgain) {
    try {
      return await this.account.updateRecovery(
        userId,
        secret,
        password,
        passwordAgain,
      );
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(email) {
    try {
      const execution = await this.functions.createExecution(
        config.appwriteFunctionId,
        JSON.stringify({ action: "sendOtp", email }),
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" },
      );
      return JSON.parse(execution.responseBody);
    } catch (error) {
      throw error;
    }
  }

  async resetPasswordWithOtp(email, otp, newPassword) {
    try {
      const execution = await this.functions.createExecution(
        config.appwriteFunctionId,
        JSON.stringify({
          action: "resetPasswordWithOtp",
          email,
          otp,
          newPassword,
        }),
        false,
        "/",
        "POST",
        { "Content-Type": "application/json" },
      );
      const response = JSON.parse(execution.responseBody);
      if (response.success === false)
        throw new Error(response.error || "Failed to reset password");
      return response;
    } catch (error) {
      throw error;
    }
  }

  /* ============================================================
       5. MFA SETUP & MANAGEMENT 
    ============================================================ */

  async enableMfa() {
    try {
      console.log("🔵 Starting MFA Setup...");
      
      // 1. Cleanup Logic
      if (typeof this.account.listAuthenticators === "function") {
        const list = await this.account.listAuthenticators();
        const existingTotp = list.authenticators.find(
          (a) => a.type === "totp",
        );
        
        if (existingTotp) {
            try {
                await this.account.deleteMfaAuthenticator(existingTotp.$id);
            } catch (cleanupError) {
                if (cleanupError.code === 401) {
                    throw new Error("Security Alert: Please log out and log back in to generate a new 2FA code.");
                }
            }
        }
      } else {
        try {
            await this.account.deleteMFAAuthenticator({ type: "totp" });
        } catch (cleanupError) {
             if (cleanupError.code === 401) {
                throw new Error("Security Alert: Please log out and log back in to generate a new 2FA code.");
            }
        }
      }

      // 2. Create Logic
      if (typeof this.account.createMfaAuthenticator === "function") {
        return await this.account.createMfaAuthenticator("totp");
      } else {
        return await this.account.createMFAAuthenticator({ type: "totp" });
      }
    } catch (error) {
      console.error("AuthService :: enableMfa :: error", error);
      if (error.code === 409) {
          throw new Error("2FA is already linked. Please log out and log back in to reset it.");
      }
      throw error; 
    }
  }

  async verifyMfaSetup(factorId, code) {
    try {
      console.log(`🔵 Verifying MFA Code: ${code}`);

      // Verify Code
      if (
        factorId &&
        typeof this.account.updateMfaAuthenticator === "function"
      ) {
        await this.account.updateMfaAuthenticator(factorId, code);
      } else {
        await this.account.updateMFAAuthenticator({
          type: "totp",
          otp: code,
        });
      }

      // Enable Global Switch
      if (typeof this.account.updateMfa === "function") {
        await this.account.updateMfa(true);
      } else {
        await this.account.updateMFA({ mfa: true });
      }
      return true;
    } catch (error) {
      console.error("AuthService :: verifyMfaSetup :: error", error);
      throw error;
    }
  }

  async disableMfa() {
    console.log("🔴 Disabling MFA...");
    if (typeof this.account.updateMfa === "function") {
      await this.account.updateMfa(false);
    } else {
      await this.account.updateMFA({ mfa: false });
    }

    try {
      if (typeof this.account.listAuthenticators === "function") {
        const list = await this.account.listAuthenticators();
        const totp = list.authenticators.find((a) => a.type === "totp");
        if (totp) await this.account.deleteMfaAuthenticator(totp.$id);
      } else {
        await this.account.deleteMFAAuthenticator({ type: "totp" });
      }
    } catch (cleanupError) {
      console.warn("Authenticator delete skipped:", cleanupError.message);
    }
    
    return true;
  }

  async getMfaStatus() {
    try {
      const user = await this.getCurrentUser();
      return user.mfa;
    } catch (error) {
      return false;
    }
  }

  /* ============================================================
       6. MFA LOGIN CHALLENGE 
    ============================================================ */

  /**
   * Creates a challenge when a user with MFA enabled tries to login.
   */
  async createMfaChallenge() {
    try {
      console.log("🔐 Creating MFA Challenge...");

      // Try Standard Method (v14)
      if (typeof this.account.createMfaChallenge === "function") {
        return await this.account.createMfaChallenge("totp");
      }
      // Fallback (v13)
      else if (typeof this.account.createMFAChallenge === "function") {
        return await this.account.createMFAChallenge({ factor: "totp" });
      }

      throw new Error("MFA Challenge method not found in SDK.");
    } catch (error) {
      console.error("❌ AuthService :: createMfaChallenge :: Error", error);
      // 409 means challenge already active? We should still handle it.
      if (error.code === 409) {
        console.warn("⚠️ Challenge conflict (409). Session might be weird.");
      }
      throw error;
    }
  }

  /**
   * Verifies the challenge code during login.
   */
  async verifyMfaChallenge(challengeId, code) {
    try {
      console.log(`🔐 Verifying Challenge: ${challengeId} Code: ${code}`);

      // Hybrid Support
      if (typeof this.account.updateMfaChallenge === "function") {
        // v14
        return await this.account.updateMfaChallenge(challengeId, code);
      } else {
        // v13
        return await this.account.updateMFAChallenge({
          challengeId: challengeId,
          otp: code,
        });
      }
    } catch (error) {
      console.error("AuthService :: verifyMfaChallenge :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;