const DB_NAME = "qr-scanner-db";
const STORE_NAME = "history";

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveScan = async (text) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.add({ text, time: Date.now(), type: 'qr' });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("DB Error:", e);
  }
};

export const getScans = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result ? request.result.reverse() : []);
    });
  } catch (e) {
    return [];
  }
};

export const deleteScan = async (id) => {
  try {
    const db = await openDB();
    const tx = db.transaction("history", "readwrite");
    tx.objectStore("history").delete(id);
    return tx.complete;
  } catch (e) { console.error(e); }
};

export const clearHistory = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction("history", "readwrite");
    tx.objectStore("history").clear();
    return tx.complete;
  } catch (e) { console.error(e); }
};