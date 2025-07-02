import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/store/slice';
import profileReducer from '../profile/store/slice';
import clientReducer from '../clients/store/slice';
import projectReducer from '../projects/store/slice';
import quotesReducer from '../quotes/store/slice';
import invoicesReducer from '../invoices/store/slice';
import accountsReducer from '../accountAdmin/store/slice';
import dashboardReducer from '../dashboard/store/slice';

export const store = configureStore({
  reducer: {
    // Les reducers seront ajoutés ici
    auth: authReducer,
    profile: profileReducer,
    clients: clientReducer,
    projects: projectReducer,
    quotes: quotesReducer,
    invoices: invoicesReducer,
    accounts: accountsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
