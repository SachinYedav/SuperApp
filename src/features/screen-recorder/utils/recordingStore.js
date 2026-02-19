const DB_NAME = "pro-editor-recorder";
const STORE_NAME = "recordingChunks";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveChunk(sessionId, blob) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add({
    sessionId,
    blob,
    createdAt: Date.now()
  });
  return tx.complete;
}

export async function getChunks(sessionId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => {
      const chunks = request.result
        .filter(item => item.sessionId === sessionId)
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(item => item.blob);

      resolve(chunks);
    };
  });
}

export async function clearSession(sessionId) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    request.result.forEach(item => {
      if (item.sessionId === sessionId) {
        store.delete(item.id);
      }
    });
  };
}
