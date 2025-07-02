import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUser,
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from '../api/authAPI';
import type { AuthState, AuthResponse } from '../types';
import { setTokens, clearTokens } from '../service';

const signIn = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
    stayConnected: boolean;
  }
>('auth/login', async ({ email, password, stayConnected }) => {
  const response = await login(email, password);
  setTokens(response.token, stayConnected);
  return response;
});

const signUp = createAsyncThunk<
  void,
  {
    name: string;
    first_name: string;
    birth_date: string;
    address: string;
    city: string;
    phone: string;
    max_annual_revenue: number;
    expense_rate: number;
    email: string;
    password: string;
    confirm_password: string;
  }
>(
  'auth/register',
  async ({
    name,
    first_name,
    birth_date,
    address,
    city,
    phone,
    max_annual_revenue,
    expense_rate,
    email,
    password,
    confirm_password,
  }) => {
    register(
      email,
      password,
      name,
      first_name,
      birth_date,
      address,
      city,
      phone,
      max_annual_revenue,
      expense_rate,
      confirm_password
    );
  }
);

const getMe = createAsyncThunk('auth/getMe', async (userId: number) => {
  const response = await getUser(userId);
  return response;
});

const forgotPasswordAction = createAsyncThunk('auth/forgotPassword', async (email: string) => {
  const response = await forgotPassword(email);
  return response;
});

const resetPasswordAction = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }) => {
    const response = await resetPassword(token, password);
    return response;
  }
);

const verifyResetTokenAction = createAsyncThunk('auth/verifyResetToken', async (token: string) => {
  const response = await verifyResetToken(token);
  return response;
});

const logout = createAsyncThunk('auth/logout', async () => {
  clearTokens();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('access_token') || sessionStorage.getItem('access_token'),
    authUser: null,
    resetTokenValid: null,
    loadingSendEmail: false,
  } as AuthState,
  reducers: {
    clearResetTokenState: (state) => {
      state.resetTokenValid = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.authUser = action.payload.account;
      state.token = action.payload.token.access_token;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.authUser = null;
      state.token = null;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.authUser = null;
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });
    builder.addCase(getMe.rejected, (state) => {
      state.authUser = null;
    });

    builder.addCase(logout.fulfilled, (state) => {
      state.authUser = null;
      state.token = null;
    });

    builder.addCase(forgotPasswordAction.fulfilled, (state) => {
      state.loadingSendEmail = false;
    });
    builder.addCase(forgotPasswordAction.pending, (state) => {
      state.loadingSendEmail = true;
    });
    builder.addCase(forgotPasswordAction.rejected, (state) => {
      state.loadingSendEmail = false;
      // Gérer l'état si nécessaire
    });

    builder.addCase(resetPasswordAction.fulfilled, (state) => {
      // Gérer l'état si nécessaire
    });
    builder.addCase(resetPasswordAction.rejected, (state) => {
      // Gérer l'état si nécessaire
    });

    builder.addCase(verifyResetTokenAction.fulfilled, (state, action) => {
      state.resetTokenValid = action.payload.valid;
    });
    builder.addCase(verifyResetTokenAction.rejected, (state) => {
      state.resetTokenValid = false;
    });
  },
});

export {
  signIn,
  signUp,
  getMe,
  forgotPasswordAction,
  resetPasswordAction,
  verifyResetTokenAction,
  logout,
};
export const { clearResetTokenState } = authSlice.actions;
export default authSlice.reducer;
