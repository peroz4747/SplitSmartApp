import { createAsyncThunk } from '@reduxjs/toolkit';
import { addUserToDB, getUsersFromDB, deleteUserFromDB, getCostsFromDB, addUserCostsToDB, getUserCostsFromDB, getAllUserCostsFromDB, saveAllCostsToDB, saveCostToDB, saveAllUsersToDB } from '../utils/indexedDB';
import { User, Cost, MonthYearUserCosts } from './reducers/types';

export const loadUsers = createAsyncThunk('users/loadUsers', async () => {
  const users = await getUsersFromDB();
  return users;
});

export const saveUser = createAsyncThunk('users/saveUser', async (user: User) => {
  await addUserToDB(user);
  return user;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
  await deleteUserFromDB(id);
  return id;
});

export const loadCosts = createAsyncThunk('costs/loadCosts', async () => {
  const costs = await getCostsFromDB();
  return costs;
});

export const saveAllCosts = createAsyncThunk('costs/saveAllCosts', async (costs: Cost[]) => {
  await saveAllCostsToDB(costs);
  return costs;
});

export const saveCost = createAsyncThunk('costs/saveCost', async (cost: Cost) => {
  await saveCostToDB(cost);
  return cost;
});

export const saveAllUsers = createAsyncThunk('users/saveAllUsers', async (users: User[]) => {
  await saveAllUsersToDB(users);
  return users;
});

export const saveUserCosts = createAsyncThunk('userCosts/saveUserCosts', async (userCostsData: MonthYearUserCosts) => {
  await addUserCostsToDB(userCostsData);
  return userCostsData;
});

export const loadUserCosts = createAsyncThunk('userCosts/loadUserCosts', async () => {
  const monthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const userCostsData = await getUserCostsFromDB(monthYear);
  return userCostsData;
});

export const loadAllUserCosts = createAsyncThunk('userCosts/loadAllUserCosts', async () => {
  const userCostsData = await getAllUserCostsFromDB();
  return userCostsData;
});
