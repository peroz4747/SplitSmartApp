import { openDB, deleteDB } from 'idb';
import { User, Cost, MonthYearUserCosts } from '../store/reducers/types';

const DB_NAME = 'userDatabase';
const USER_STORE_NAME = 'users';
const COST_STORE_NAME = 'costs';
const USER_COSTS_STORE_NAME = 'userCosts';

const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(USER_STORE_NAME)) {
                db.createObjectStore(USER_STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(COST_STORE_NAME)) {
                db.createObjectStore(COST_STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(USER_COSTS_STORE_NAME)) {
                db.createObjectStore(USER_COSTS_STORE_NAME, { keyPath: 'monthYear' });
            }
        },
    });
    return db;
};

export const addUserToDB = async (user: User) => {
    const db = await initDB();
    await db.put(USER_STORE_NAME, user);
};

export const getUsersFromDB = async (): Promise<User[]> => {
    const db = await initDB();
    return await db.getAll(USER_STORE_NAME);
};

export const deleteUserFromDB = async (id: number) => {
    const db = await initDB();
    await db.delete(USER_STORE_NAME, id);
};

export const saveCostToDB = async (cost: Cost) => {
    const db = await initDB();
    await db.put(COST_STORE_NAME, cost)
};

export const saveAllCostsToDB = async (costs: Cost[]) => {
    const db = await initDB();
    const tx = db.transaction(COST_STORE_NAME, 'readwrite');
    const store = tx.objectStore(COST_STORE_NAME);
    await store.clear();
    for (const cost of costs) {
        await store.put(cost);
    }
    await tx.done;
};

export const saveAllUsersToDB = async (users: User[]) => {
    const db = await initDB();
    const tx = db.transaction(USER_STORE_NAME, 'readwrite');
    const store = tx.objectStore(USER_STORE_NAME);
    await store.clear();
    for (const user of users) {
        await store.put(user);
    }
    await tx.done;
};

export const getCostsFromDB = async (): Promise<Cost[]> => {
    const db = await initDB();
    return await db.getAll(COST_STORE_NAME);
};

export const addUserCostsToDB = async (userCosts: MonthYearUserCosts) => {
  const db = await initDB();
  await db.put(USER_COSTS_STORE_NAME, userCosts);
};

export const getUserCostsFromDB = async (monthYear: string): Promise<MonthYearUserCosts> => {
  const db = await initDB();
  return await db.get(USER_COSTS_STORE_NAME, monthYear);
};

export const getAllUserCostsFromDB = async (): Promise<MonthYearUserCosts[]> => {
    const db = await initDB();
    return await db.getAll(USER_COSTS_STORE_NAME);
  };

export const clearDB = async () => {
    await deleteDB(DB_NAME);
    console.log('IndexedDB cleared');
};
