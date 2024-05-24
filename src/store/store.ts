import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import splitSmartReducer from './reducers/splitSmartReducer';

const store = configureStore({
  reducer: {
    splitSmart: splitSmartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
