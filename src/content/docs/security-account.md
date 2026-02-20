# Security & Account Management 🔐

Welcome to your **Security Center**. At SuperApp, we treat your data sovereignty and account security as our absolute highest priority. This guide will walk you through setting up rock-solid defenses for your workspace, managing your active sessions, and understanding our fail-safe data deletion policies.

> **Security First:** From OTP-based password resets to Multi-Factor Authentication (MFA) and Cloud Function-verified data wipes, every security feature in SuperApp is built using industry-standard cryptographic practices.

---

## 👤 1. Profile & Session Control

Before locking the doors, you need to know who is inside. You can manage your identity and active devices directly from the **[Account Settings](/settings/account)** tab.

### Profile Management
Keep your workspace identity up to date. You can instantly update your Full Name, bio, and display picture. Your primary email address is strictly tied to your authentication state and is displayed here for verification.

### Login History (Active Sessions)
Never guess if you left your account logged in on a public computer.
* The **Login History** panel displays a real-time list of every device (e.g., Windows/Chrome, iOS/Safari) currently holding an active session to your account.
* It logs the IP Location, Date, and exact Device Type.
* **Proactive Security:** If you spot an unrecognized device, you can instantly revoke its access with a single click, immediately kicking that session out of SuperApp.

---

## 🔑 2. Password & Access Recovery

Whether you are performing a routine security update or you've been locked out, we've made credential management both seamless and impenetrable. Manage these settings in the **[Security Tab](/settings/security)**.

### Standard Password Update
If you know your current password and want to change it:
1. Navigate to the **Security Tab**.
2. Enter your **Old Password** to verify your identity.
3. Enter your **New Password** and confirm it in the corresponding field.
4. Hit Save. Your active session will remain uninterrupted, but all other devices will require the new password upon their next login.

### Forgot Password (OTP Recovery)
Locked out? Our secure reset flow ensures only the true owner can regain access.
1. Click the **Forgot Password?** link at the top of the login/security screen.
2. You will be redirected to the secure `/reset-password` portal.
3. **Step 1:** Enter your registered email address. SuperApp will instantly dispatch a secure, time-sensitive One-Time Password (OTP) to your inbox.
4. **Step 2:** Enter the OTP along with your brand-new password.
5. **Fresh State Enforcement:** Upon a successful reset, you will be intentionally redirected to the root home page (`/`). For maximum security, you must manually log in again using your new credentials to establish a fresh, cryptographically secure session.

---

## 🛡️ 3. Multi-Factor Authentication (MFA)

A strong password is good, but adding a second layer of verification makes your account virtually unhackable. 

### What is MFA & Why Use It?
Multi-Factor Authentication requires two things to log in: something you *know* (your password) and something you *have* (your phone). Even if a hacker guesses your password, they cannot access your SuperApp Cloud Drive without the rotating 6-digit code from your phone.

### Setting Up MFA
1. Head over to the **[Security Tab](/settings/security)**.
2. Click the **Enable MFA** toggle. 
3. A secure modal will appear displaying a **QR Code** and a **Setup Key**.
4. Open your preferred Authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator) and scan the QR code.
5. Enter the generated 6-digit code back into SuperApp to verify the connection.
6. **Safety Tip:** Your next login will require this code. *Never delete the authenticator app from your phone without disabling MFA in SuperApp first!*

### Disabling MFA
If you need to switch devices or prefer to turn off 2FA:
1. Click the MFA toggle again to switch it off.
2. A **Confirmation Modal** will appear to prevent accidental clicks. Confirm your choice to safely remove the MFA requirement.

---

## ⚠️ 4. Danger Zone: Account Deletion

We believe in your "Right to be Forgotten." If you decide to leave SuperApp, we don't just deactivate your account—we obliterate your data from our servers.

### The Fail-Safe Wipe Process
Because deleting your account wipes your entire Cloud Drive, Sticky Notes, and Arcade Scores permanently, we have implemented a strict, multi-step verification process:

1. Scroll to the **Danger Zone** at the bottom of the Security Tab.
2. Click **Delete Account**.
3. **GitHub-Style Verification:** You must manually type the exact phrase `delete my account` into the confirmation box.
4. **Password Challenge:** You will be prompted to enter your current password.
5. **Cloud Function Queue:** Once verified, the request is sent to an isolated, secure backend Cloud Function. This function places your account in a high-priority deletion queue, ensuring that every single byte of your data is systematically and safely wiped from the database without any risk of failure or orphaned files.
*Note: This action is absolute and cannot be undone by our support team.*

