import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { accountAdminService } from '../service';
import type { AccountSearchParams, AccountUpdateData, PaginationInfo } from '../types';
import type { User } from '../../auth/types';

// Actions asynchrones
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (params?: AccountSearchParams) => {
    return await accountAdminService.getAccounts(params);
  }
);

export const fetchAccount = createAsyncThunk('accounts/fetchAccount', async (id: number) => {
  return await accountAdminService.getAccount(id);
});

export const updateAccountAction = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, data }: { id: number; data: AccountUpdateData }) => {
    return await accountAdminService.updateAccount(id, data);
  }
);

export const deleteAccountAction = createAsyncThunk(
  'accounts/deleteAccount',
  async (id: number) => {
    await accountAdminService.deleteAccount(id);
    return id;
  }
);

export const makeAdminAction = createAsyncThunk('accounts/makeAdmin', async (id: number) => {
  return await accountAdminService.makeAdmin(id);
});

// État initial
interface AccountsState {
  accounts: User[];
  currentAccount: User | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
}

const initialState: AccountsState = {
  accounts: [],
  currentAccount: null,
  loading: false,
  error: null,
  pagination: null,
};

// Slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.accounts = action.payload.data.data || [];
        state.pagination = {
          current_page: action.payload.data.current_page || 1,
          per_page: action.payload.data.per_page || 10,
          total: action.payload.data.total || 0,
          last_page: action.payload.data.last_page || 1,
        };
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Fetch account
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccount = action.payload;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Update account
      .addCase(updateAccountAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountAction.fulfilled, (state, action) => {
        state.loading = false;
        // Mettre à jour dans la liste
        const index = state.accounts.findIndex((account) => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        // Mettre à jour le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount.id === action.payload.id) {
          state.currentAccount = action.payload;
        }
      })
      .addCase(updateAccountAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Delete account
      .addCase(deleteAccountAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountAction.fulfilled, (state, action) => {
        state.loading = false;
        // Supprimer de la liste
        state.accounts = state.accounts.filter((account) => account.id !== action.payload);
        // Supprimer le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount.id === action.payload) {
          state.currentAccount = null;
        }
      })
      .addCase(deleteAccountAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })
      // Make admin
      .addCase(makeAdminAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeAdminAction.fulfilled, (state, action) => {
        state.loading = false;
        // Mettre à jour dans la liste
        const index = state.accounts.findIndex((account) => account.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        // Mettre à jour le compte courant si c'est le même
        if (state.currentAccount && state.currentAccount.id === action.payload.id) {
          state.currentAccount = action.payload;
        }
      })
      .addCase(makeAdminAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { clearCurrentAccount, clearError } = accountsSlice.actions;
export default accountsSlice.reducer;
