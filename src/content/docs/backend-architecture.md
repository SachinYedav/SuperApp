# Backend Architecture ☁️

Welcome to the Engine Room. SuperApp does not rely on traditional, constantly-running legacy servers. Instead, we utilize a highly scalable, event-driven **Serverless Cloud Function** architecture powered by Appwrite and Node.js. 

This single, monolithic Cloud Function acts as our primary backend brain. It intelligently routes requests based on HTTP payloads or internal database events, ensuring blazing-fast execution, zero idle costs, and bank-grade security.



## 🧭 Core Responsibilities

The SuperApp Cloud Function is divided into three primary operational domains:
1. **Automated Communications (Email Engine)**
2. **Identity & Security (OTP & Auth)**
3. **The Smart Queue Worker (Data Sovereignty)**

---

## ✉️ 1. The Email Engine

We don't use plain, ugly text emails. Our backend features a dynamic HTML email templating system. When specific events occur in the database, Appwrite triggers our function automatically to dispatch beautifully branded, responsive emails.

### Event-Driven Triggers
* **Welcome Email:** Triggered strictly on `users.*.create`. The moment a user signs up, the system generates a personalized welcome email with a direct call-to-action to launch the dashboard.
* **Security Alert:** Triggered on `users.*.sessions.*.create`. Every time a new login occurs, the backend captures the user's OS, Browser, IP address, and Timestamp, and instantly alerts the account owner.



### The HTML Wrapper Logic
All emails share a unified, secure aesthetic. We dynamically inject data (like OTPs or IPs) into a predefined, styled container:
```javascript
// Dynamic Email Templating Engine
const emailTemplate = (type, data = {}) => {
  const theme = { primary: '#2563eb', bg: '#f1f5f9', card: '#ffffff' };
  
  const wrapper = (content) => `
    <div style="background:${theme.bg}; padding:40px 12px;">
       <div style="max-width:500px; margin:0 auto; background:${theme.card}; border-radius:16px;">
           <div style="background:${theme.primary}; padding:32px; text-align:center;">
               <h1 style="color:#fff;">SuperApp</h1>
           </div>
           <div style="padding:32px 24px;">${content}</div>
       </div>
    </div>
  `;
  // ... Content injection based on type

```

---

## 🔐 2. Identity & Security Operations

For sensitive actions, the client application cannot be trusted. It must communicate with our Cloud Function via secure HTTP POST requests with a defined `action` payload.

### Forgot Password (OTP Generation)

When a user requests a password reset, the backend:

1. Verifies the user's existence securely.
2. Generates a cryptographically randomized 6-digit OTP.
3. Clears any old OTPs for that email to prevent replay attacks.
4. Saves the new OTP to a highly restricted database collection and dispatches it via the Email Engine.

### Secure Password Verification

Before a user can delete their account, they must prove their identity. The function simulates a login (`createEmailPasswordSession`) entirely on the server side using the provided credentials. If the Appwrite SDK returns a `401 Unauthorized`, the backend blocks the deletion request.

---

## 🗑️ 3. The Smart Queue Worker (Right to be Forgotten)

This is the crown jewel of our backend architecture. Deleting a user account isn't as simple as deleting an email address. A user might have hundreds of files, sticky notes, and high scores.

If we tried to delete all of this in a single standard API call, the request would timeout, leaving orphaned data floating in the cloud. SuperApp solves this using a **Queue-Based Asynchronous Worker**.

### How the Wipe Process Works:

1. **The Trigger:** The user authenticates and hits "Delete Account". The client simply creates a document in the `QUEUE` collection.
2. **The Worker Wakes Up:** The Cloud Function listens for `databases.[queue_id].documents.create`. It reads the queue document and identifies the target user.
3. **Phase A (Storage Wipe):** It fetches files in batches of 50. It first deletes the physical file from the Cloud Storage Bucket, then deletes the database record. It loops this process until no files remain.
4. **Phase B (Data Wipe):** It iterates through every dynamic collection (Search History, Arcade Scores, OTPs, Sticky Notes) and deletes documents in safe, paginated batches.
5. **Phase C (Auth Wipe):** Finally, it deletes the core Appwrite Authentication user object.
6. **Phase D (Cleanup):** It marks the queue item as complete and deletes it.

**The Smart Deletion Loop (Backend Snippet):**

```javascript
// Phase B: Dynamic Collection Wipe (Batch Processing)
for (const collectionId of COLLECTIONS_TO_WIPE) {
  let loop = 0;
  while (loop < MAX_BATCHES) {
    // Fetch 50 items at a time to prevent server timeout
    const list = await db.listDocuments(CONFIG.DB_ID, collectionId, [
        Query.equal('userId', targetUserId), 
        Query.limit(50)
    ]);

    if (list.documents.length === 0) break; // Collection is completely empty

    // Execute parallel deletion for maximum speed
    await Promise.all(
        list.documents.map((doc) => 
            db.deleteDocument(CONFIG.DB_ID, collectionId, doc.$id)
        )
    );
    loop++;
  }
}

```

*This robust error-handling and batching logic guarantees that even if a user has 10,000 files, the system will systematically wipe every single byte without crashing.*

> 🔗 **Open Source Trust:** Explore the complete Node.js backend architecture, including environment configurations and full operational logic.
> **[View the Cloud Function source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/superapp-backend)**
