import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUser,
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from '../api/authAPI';
import type { AuthState } from '../types';

const signIn = createAsyncThunk(
  'auth/login',
  async ({
    email,
    password,
    stayConnected,
  }: {
    email: string;
    password: string;
    stayConnected: boolean;
  }) => {
    const response = await login(email, password);
    console.log(response.accessToken);
    if (stayConnected) {
      localStorage.setItem('token', response.accessToken);
    } else {
      sessionStorage.setItem('token', response.accessToken);
    }
    return response;
  }
);

const signUp = createAsyncThunk(
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
  }: {
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
  }) => {
    const response = await register(
      email,
      password,
      name,
      first_name,
      birth_date,
      address,
      city,
      phone,
      max_annual_revenue,
      expense_rate
    );
    localStorage.setItem('token', response.accessToken);
    return response;
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

const initialState: AuthState = {
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  authUser: null,
  resetTokenValid: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: (state) => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      state.token = null;
      state.authUser = null;
    },
    clearResetTokenState: (state) => {
      state.resetTokenValid = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      console.log(action.payload);
      state.token = action.payload.accessToken;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.token = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.token = action.payload.accessToken;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.token = null;
    });

    builder.addCase(getMe.pending, (state) => {
      state.authUser = null;
    });

    builder.addCase(getMe.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });
    builder.addCase(getMe.rejected, (state) => {
      state.authUser = null;
    });

    builder.addCase(forgotPasswordAction.fulfilled, (state) => {
      // L'email a été envoyé avec succès
    });
    builder.addCase(forgotPasswordAction.rejected, (state) => {
      // Gérer l'erreur si nécessaire
    });

    builder.addCase(resetPasswordAction.fulfilled, (state) => {
      // Le mot de passe a été réinitialisé avec succès
    });
    builder.addCase(resetPasswordAction.rejected, (state) => {
      // Gérer l'erreur si nécessaire
    });

    builder.addCase(verifyResetTokenAction.fulfilled, (state, action) => {
      state.resetTokenValid = action.payload.valid;
    });
    builder.addCase(verifyResetTokenAction.rejected, (state) => {
      state.resetTokenValid = false;
    });
  },
});

export { signIn, signUp, getMe, forgotPasswordAction, resetPasswordAction, verifyResetTokenAction };
export const { logOut, clearResetTokenState } = authSlice.actions;
export default authSlice.reducer;
