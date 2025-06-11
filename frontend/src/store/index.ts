import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/store/slice';

export const store = configureStore({
  reducer: {
    // Les reducers seront ajoutés ici
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
