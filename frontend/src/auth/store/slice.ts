import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, login, register } from '../api/authAPI';
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

const initialState: AuthState = {
  token: localStorage.getItem('token') || sessionStorage.getItem('token'),
  authUser: null,
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
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
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
  },
});

export { signIn, signUp, getMe };
export const { logOut } = authSlice.actions;
export default authSlice.reducer;
