import {
  Client,
  Databases,
  Users,
  Messaging,
  Storage,
  Account,
  ID,
  Query,
} from 'node-appwrite';

/* ============================================================
   CONFIG & ENV VALIDATION
============================================================ */
const env = (k) => process.env[k];

const CONFIG = {
  ENDPOINT: env('APP_ENDPOINT') || 'https://cloud.appwrite.io/v1',
  PROJECT_ID: env('APPWRITE_PROJECT_ID'),
  API_KEY: env('APPWRITE_API_KEY'),
  DB_ID: env('APPWRITE_DB_ID'),
  APP_NAME: 'SuperApp',
  APP_URL: (env('APP_DOMAIN') || 'http://localhost:5173').replace(/\/$/, ''),
  ADMIN_EMAIL: env('APP_ADMIN_EMAIL'),
};

const COL = {
  USERS: env('COL_USERS_ID'),
  FILES: env('COL_FILES_ID'),
  QUEUE: env('COL_QUEUE_ID'),
  OTP: env('COL_OTP_ID'),
  SEARCH_HISTORY: env('COL_SEARCH_HISTORY_ID'),
  SCORE: env('COL_SCORE_ID'),
};

const BUCKET_ID = env('BUCKET_ID');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ============================================================
   EMAIL TEMPLATES
============================================================ */
const emailTemplate = (type, data = {}) => {
  const theme = {
    primary: '#2563eb',
    bg: '#f1f5f9',
    card: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
  };
  const wrapper = (content) => `
        <div style="font-family:'Inter',sans-serif; background:${theme.bg}; padding:40px 12px; color:${theme.text};">
            <div style="max-width:500px; margin:0 auto; background:${theme.card}; border-radius:16px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <div style="background:${theme.primary}; padding:32px; text-align:center;">
                    <h1 style="color:#fff; margin:0; font-size:24px; font-weight:700;">${CONFIG.APP_NAME}</h1>
                </div>
                <div style="padding:32px 24px;">${content}</div>
                <div style="background:#f8fafc; padding:16px; text-align:center; font-size:12px; color:${theme.muted}; border-top:1px solid ${theme.border};">
                    <p style="margin:0;">Secure Notification • ${new Date().getFullYear()} ${CONFIG.APP_NAME}</p>
                </div>
            </div>
        </div>
    `;

  if (type === 'welcome')
    return wrapper(
      `<h2 style="margin-top:0;">Welcome, ${data.name}! 👋</h2><p>You've just unlocked a powerful suite of tools.</p><div style="text-align:center; margin:32px 0;"><a href="${CONFIG.APP_URL}" style="background:${theme.primary}; color:#fff; padding:14px 28px; border-radius:12px; text-decoration:none; font-weight:600; display:inline-block;">Launch Dashboard</a></div>`
    );
  if (type === 'security')
    return wrapper(
      `<h2 style="margin-top:0;">New Login Detected 🛡️</h2><p>We noticed a new login.</p><div style="background:#fff7ed; border:1px solid #ffedd5; padding:16px; border-radius:12px; margin:24px 0;"><p><strong>Device:</strong> ${data.device}</p><p><strong>IP:</strong> ${data.ip}</p><p><strong>Time:</strong> ${data.time}</p></div>`
    );
  if (type === 'goodbye')
    return wrapper(
      `<h2 style="margin-top:0;">Account Deleted 🗑️</h2><p>Your account data has been permanently deleted.</p>`
    );

  // NEW OTP TEMPLATE
  if (type === 'otp') {
    return wrapper(`
            <h2 style="margin-top:0; text-align:center;">Verify Your Request</h2>
            <p style="text-align:center;">Use the code below to reset your password. Valid for 10 minutes.</p>
            <div style="background:#f1f5f9; padding:20px; text-align:center; margin:24px 0; border-radius:12px;">
                <span style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#2563eb; font-family:monospace;">${data.otp}</span>
            </div>
            <p style="text-align:center; font-size:12px; color:#64748b;">If you didn't request this, please ignore this email.</p>
        `);
  }

  return '';
};

/* ============================================================
   MAIN FUNCTION ENTRY
============================================================ */
export default async ({ req, res, log, error }) => {
  // 1. SETUP CLIENT
  if (!CONFIG.API_KEY || !CONFIG.DB_ID) {
    error(`[CRITICAL] Missing Variables: API_KEY or DB_ID`);
    return res.json({ success: false, error: 'Server Misconfiguration' }, 500);
  }

  const client = new Client()
    .setEndpoint(CONFIG.ENDPOINT)
    .setProject(CONFIG.PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] || CONFIG.API_KEY);

  const db = new Databases(client);
  const users = new Users(client);
  const messaging = new Messaging(client);
  const storage = new Storage(client);
  const account = new Account(client);

  // 2. PARSE EVENT & PAYLOAD
  const event = req.headers['x-appwrite-event'];
  const payload =
    typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : req.body || {};

  log(
    `[TRIGGER] Event: ${event || 'HTTP Action'} | Action: ${payload.action || 'None'}`
  );

  try {
    // ============================================================
    // CASE 1: WELCOME EMAIL (Matches: users.[ID].create)
    // ============================================================
    if (
      event &&
      event.startsWith('users.') &&
      event.endsWith('.create') &&
      !event.includes('sessions.')
    ) {
      log(`[STEP 1] Processing New User: ${payload.$id}`);

      if (payload.email) {
        try {
          await messaging.createEmail(
            ID.unique(),
            `Welcome to ${CONFIG.APP_NAME}`,
            emailTemplate('welcome', { name: payload.name || 'Creator' }),
            [],
            [payload.$id]
          );
          log(`[SUCCESS] Welcome email sent to ${payload.email}`);
        } catch (e) {
          error(`[ERROR] Email Send Failed: ${e.message}`);
        }
      }
      return res.json({ success: true, type: 'welcome_sent' });
    }

    // ============================================================
    // CASE 2: LOGIN ALERT (Matches: users.[ID].sessions.[ID].create)
    // ============================================================
    if (event && event.includes('sessions.') && event.endsWith('.create')) {
      log(`[STEP 2] Processing Login Session: ${payload.$id}`);

      try {
        const user = await users.get(payload.userId);
        if (user.email) {
          await messaging.createEmail(
            ID.unique(),
            `New Login Alert`,
            emailTemplate('security', {
              device: `${payload.osName} ${payload.osVersion} - ${payload.clientName}`,
              ip: payload.ip,
              time: new Date().toLocaleString(),
            }),
            [],
            [payload.userId]
          );
          log(`[SUCCESS] Security alert sent to ${user.email}`);
        }
      } catch (e) {
        error(`[ERROR] Security Alert Failed: ${e.message}`);
      }
      return res.json({ success: true, type: 'security_alert_sent' });
    }

    /* ============================================================
           1. SMART QUEUE WORKER 
           Trigger: databases.[queue_id].documents.create
        ============================================================ */
    if (event && event.startsWith('databases.') && event.endsWith('.create')) {
      if (payload.$collectionId === COL.QUEUE) {
        const targetUserId = payload.userId;
        log(`[WORKER] ⚙️ STARTING WIPE FOR: ${targetUserId}`);

        // 1. DEFINE COLLECTIONS TO WIPE
        const COLLECTIONS_TO_WIPE = [
          COL.OTP,
          COL.SEARCH_HISTORY,
          COL.SCORE,
          COL.USERS,
        ].filter((id) => !!id);

        const MAX_BATCHES = 20;

        try {
          // =================================================
          // PHASE A: DELETE FILES (Storage + DB Atomic)
          // =================================================
          if (COL.FILES && BUCKET_ID) {
            let loop = 0;
            while (loop < MAX_BATCHES) {
              const fileList = await db.listDocuments(CONFIG.DB_ID, COL.FILES, [
                Query.equal('userId', targetUserId),
                Query.limit(50),
              ]);

              if (fileList.documents.length === 0) break;

              log(
                `[FILES] Found ${fileList.documents.length} files to delete...`
              );

              // Parallel Deletion with Individual Error Handling
              await Promise.all(
                fileList.documents.map(async (file) => {
                  // 1. Try Delete Storage (Ignored if fails, maybe already deleted)
                  if (file.bucketFileId) {
                    await storage
                      .deleteFile(BUCKET_ID, file.bucketFileId)
                      .catch((e) =>
                        log(`[WARN] Bucket delete skip: ${e.message}`)
                      );
                  }
                  // 2. Delete DB Entry (Must happen)
                  await db
                    .deleteDocument(CONFIG.DB_ID, COL.FILES, file.$id)
                    .catch((e) =>
                      error(`[ERR] File DB delete fail: ${e.message}`)
                    );
                })
              );

              loop++;
            }
          }

          // =================================================
          // PHASE B: DYNAMIC COLLECTION WIPE
          // =================================================
          for (const collectionId of COLLECTIONS_TO_WIPE) {
            let loop = 0;
            while (loop < MAX_BATCHES) {
              try {
                // Fetch Batch
                const list = await db.listDocuments(
                  CONFIG.DB_ID,
                  collectionId,
                  [Query.equal('userId', targetUserId), Query.limit(50)]
                );

                if (list.documents.length === 0) break;

                log(
                  `[WIPE] Deleting ${list.documents.length} items from ${collectionId}`
                );

                // Execute Batch Delete
                await Promise.all(
                  list.documents.map((doc) =>
                    db
                      .deleteDocument(CONFIG.DB_ID, collectionId, doc.$id)
                      .catch((e) =>
                        log(`[WARN] Doc delete fail ${doc.$id}: ${e.message}`)
                      )
                  )
                );

                loop++;
              } catch (err) {
                error(
                  `[SCHEMA ERROR] Collection ${collectionId} failed. Missing 'userId' attribute? Error: ${err.message}`
                );
                break;
              }
            }
          }

          // =================================================
          // PHASE C: DELETE AUTH ACCOUNT
          // =================================================
          try {
            await users.delete(targetUserId);
            log(`[AUTH] User Account Deleted.`);
          } catch (e) {
            // 404 means already deleted, which is fine
            if (e.code !== 404) log(`[WARN] Auth delete issue: ${e.message}`);
          }

          // =================================================
          // PHASE D: CLEANUP QUEUE ITEM
          // =================================================
          await db
            .deleteDocument(CONFIG.DB_ID, COL.QUEUE, payload.$id)
            .catch(() => {});

          log(`[SUCCESS] 🏁 Full Account Wipe Complete for ${targetUserId}`);
          return res.json({ success: true });
        } catch (e) {
          error(`[CRITICAL] Worker Crashed: ${e.message}`);
          // Even if crashed, return success:false so Appwrite logs it, but don't retry indefinitely
          return res.json({ success: false, error: e.message });
        }
      }
    }

    // ============================================================
    // CASE 4: HTTP ACTIONS (Secure Operations)
    // ============================================================

    // A. VERIFY PASSWORD (Simulated Login)
    if (payload.action === 'verifyPassword') {
      log(`[ACTION] Verifying Password for: ${payload.email}`);
      const { email, password } = payload;

      if (!email || !password)
        return res.json({ success: false, error: 'Missing credentials' });

      // 1. Initialize Client
      const authClient = new Client()
        .setEndpoint(CONFIG.ENDPOINT)
        .setProject(CONFIG.PROJECT_ID);

      const authAccount = new Account(authClient);

      try {
        // 2. ATTEMPT LOGIN
        const session = await authAccount.createEmailPasswordSession(
          email,
          password
        );
        log(`[SUCCESS] Password Verified. Session ID: ${session.$id}`);

        // 3. OPTIONAL CLEANUP (Fire and Forget)
        try {
          authClient.setSession(session.secret);
          await authAccount.deleteSession(session.$id);
          log(`[INFO] Cleanup Done.`);
        } catch (cleanupError) {
          log(`[WARN] Cleanup Skipped: ${cleanupError.message}`);
        }

        // 4. RETURN SUCCESS
        return res.json({ success: true, valid: true });
      } catch (e) {
        log(`[AUTH FAIL] Login Failed: ${e.message}`);
        // 401 = Unauthorized (Wrong Password)
        if (e.code === 401) {
          return res.json({ success: true, valid: false });
        }
        // Other Errors (Rate Limit, etc.)
        return res.json({ success: false, error: e.message, valid: false });
      }
    }

    // B. DELETE ACCOUNT REQUEST
    if (payload.action === 'deleteAccount') {
      const userId = req.headers['x-appwrite-user-id']; // Secure Header

      log(`[ACTION] Delete Request for: ${userId}`);

      if (!userId) {
        return res.json(
          { success: false, error: 'Unauthorized: Login required' },
          401
        );
      }

      // Create Queue Item -> This triggers Case 1 (Queue Worker)
      await db.createDocument(CONFIG.DB_ID, COL.QUEUE, ID.unique(), {
        userId: userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, message: 'Deletion Scheduled' });
    }

    // C. SEND OTP (FORGOT PASSWORD)
    if (payload.action === 'sendOtp') {
      const { email } = payload;
      if (!email)
        return res.json({ success: false, message: 'Email required' });

      // 1. Check if User Exists
      const userList = await users.list([Query.equal('email', email)]);
      if (userList.total === 0) {
        return res.json({ success: true, message: 'OTP Sent' });
      }

      const targetUserId = userList.users[0].$id;

      // 2. Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Cleanup Old OTPs
      try {
        const oldOtps = await db.listDocuments(CONFIG.DB_ID, COL.OTP, [
          Query.equal('email', email),
        ]);
        await Promise.all(
          oldOtps.documents.map((d) =>
            db.deleteDocument(CONFIG.DB_ID, COL.OTP, d.$id)
          )
        );
      } catch (e) {}

      // 4. Save New OTP
      await db.createDocument(CONFIG.DB_ID, COL.OTP, ID.unique(), {
        userId: targetUserId,
        email: email,
        otp: otpCode,
        createdAt: new Date().toISOString(),
      });

      // 5. Send Email
      await messaging.createEmail(
        ID.unique(),
        'Reset Password Code',
        emailTemplate('otp', { otp: otpCode }),
        [],
        [targetUserId]
      );

      return res.json({ success: true, message: 'OTP Sent' });
    }

    // D. RESET PASSWORD WITH OTP
    if (payload.action === 'resetPasswordWithOtp') {
      const { email, otp, newPassword } = payload;
      if (!email || !otp || !newPassword)
        return res.json({ success: false, message: 'Missing fields' });

      log(`[OTP] Verifying OTP for: ${email}`);

      // 1. Verify OTP
      const otpList = await db.listDocuments(CONFIG.DB_ID, COL.OTP, [
        Query.equal('email', email),
        Query.equal('otp', otp),
      ]);

      if (otpList.total === 0)
        return res.json({ success: false, error: 'Invalid OTP' });

      // 2. Find User
      const userList = await users.list([Query.equal('email', email)]);
      if (userList.total === 0)
        return res.json({ success: false, error: 'User not found' });

      // 3. Update Password
      await users.updatePassword(userList.users[0].$id, newPassword);

      // 4. Cleanup
      await db.deleteDocument(CONFIG.DB_ID, COL.OTP, otpList.documents[0].$id);

      // 5. Notify
      await messaging.createEmail(
        ID.unique(),
        'Password Changed',
        emailTemplate('security', {
          device: 'OTP Reset',
          ip: 'Unknown',
          time: new Date().toLocaleString(),
        }),
        [],
        [userList.users[0].$id]
      );

      return res.json({ success: true });
    }

    log(`[INFO] No matching event pattern found for: ${event}`);
    return res.json({ success: true, message: 'No action taken' });
  } catch (e) {
    error(`[FATAL] Function Crashed: ${e.message}`);
    return res.json({ success: false, error: e.message }, 500);
  }
};
