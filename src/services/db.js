import { openDB } from 'idb';

const DB_NAME = 'SuperAppDB';
const STORE_NAME = 'my_files';
const VERSION = 1;

// 1. Initialize Database
export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('date', 'date');
        store.createIndex('type', 'type');
      }
    },
  });
};

// 2. Save File
export const saveFile = async (file) => {
  const db = await initDB();
  const fileData = {
    name: file.name,
    type: file.type,
    size: file.size,
    date: new Date(),
    blob: file,
  };
  return db.add(STORE_NAME, fileData);
};

// 3. Get All Files
export const getAllFiles = async () => {
  const db = await initDB();
  return db.getAllFromIndex(STORE_NAME, 'date');
};

// 4. Delete File
export const deleteFile = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

// 5. Get Storage Usage (in Bytes)
export const getStorageUsage = async () => {
  const files = await getAllFiles();
  return files.reduce((acc, file) => acc + file.size, 0);
};