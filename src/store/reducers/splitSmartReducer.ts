import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Cost, SplitSmartState } from './types';
import { loadUsers, saveUser, deleteUser, loadCosts, saveUserCosts, loadUserCosts, loadAllUserCosts, saveAllCosts, saveCost, saveAllUsers } from '../thunks';

const initialState: SplitSmartState = {
  users: [],
  costs: [],
  userCostsData: null,
  allUserCostData: null
};

const splitSmartSlice = createSlice({
  name: 'splitSmart',
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    addCost: (state, action: PayloadAction<Cost>) => {
      state.costs.push(action.payload);
    },
    removeCost: (state, action: PayloadAction<number>) => {
      state.costs = state.costs.filter(cost => cost.id !== action.payload);
    },
    updateCostName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const cost = state.costs.find(cost => cost.id === action.payload.id);
      if (cost) {
        cost.name = action.payload.name;
      }
    },
    setInitialCosts: (state, action: PayloadAction<Cost[]>) => {
      state.costs = action.payload;
    },
    updateUserName: (state, action: PayloadAction<{ id: number; name: string }>) => {
      const user = state.users.find(user => user.id === action.payload.id);
      if (user) {
        user.name = action.payload.name;
      }
    },
    updateUserFavColor: (state, action: PayloadAction<{ id: number; favColor: string }>) => {
      const user = state.users.find(user => user.id === action.payload.id);
      if (user) {
        user.favColor = action.payload.favColor;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      const totalIncome = action.payload.reduce((total, user) => total + user.income, 0);
      state.users = action.payload.map(user => ({
        ...user,
        percentage: totalIncome > 0 ? (user.income / totalIncome) * 100 : 0,
      }));
    });
    builder.addCase(saveUser.fulfilled, (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      } else {
        state.users.push(action.payload);
      }
      const totalIncome = state.users.reduce((total, user) => total + user.income, 0);
      state.users = state.users.map(user => ({
        ...user,
        percentage: totalIncome > 0 ? (user.income / totalIncome) * 100 : 0,
      }));
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    });
    builder.addCase(loadCosts.fulfilled, (state, action) => {
      state.costs = action.payload;
    });
    builder.addCase(saveAllCosts.fulfilled, (state, action) => {
      state.costs = action.payload;
    });
    builder.addCase(saveCost.fulfilled, (state, action) => {
      const index = state.costs.findIndex(cost => cost.id === action.payload.id);
      if (index >= 0) {
        state.costs[index] = action.payload;
      }
    });
    builder.addCase(saveAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(saveUserCosts.fulfilled, (state, action) => {
      state.userCostsData = action.payload;
    });
    builder.addCase(loadUserCosts.fulfilled, (state, action) => {
      state.userCostsData = action.payload;
    });
    builder.addCase(loadAllUserCosts.fulfilled, (state, action) => {
      state.allUserCostData = action.payload;
    });
  },
});

export const { addNewUser, removeUser, addCost, removeCost, updateCostName, setInitialCosts, updateUserName, updateUserFavColor } = splitSmartSlice.actions;
export default splitSmartSlice.reducer;
