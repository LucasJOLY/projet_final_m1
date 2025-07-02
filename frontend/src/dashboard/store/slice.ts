import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  DashboardState,
  DashboardData,
  DashboardQuarterData,
  DashboardChartsData,
} from '../types';
import { dashboardAPI } from '../api/dashboardAPI';

// État initial
const initialState: DashboardState = {
  data: null,
  quarterData: null,
  chartsData: null,
  loading: false,
  quarterLoading: false,
  chartsLoading: false,
  error: null,
};

// Actions asynchrones
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardAPI.getDashboardData();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'toast.dashboard.loadError');
    }
  }
);

export const fetchQuarterData = createAsyncThunk(
  'dashboard/fetchQuarterData',
  async (quarter: 'current' | 'previous' | 'next', { rejectWithValue }) => {
    try {
      const data = await dashboardAPI.getQuarterData(quarter);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'toast.dashboard.quarterError');
    }
  }
);

export const fetchChartsData = createAsyncThunk(
  'dashboard/fetchChartsData',
  async (params: { year?: number } | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardAPI.getChartsData(params?.year);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'toast.dashboard.chartsError');
    }
  }
);

// Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.data = null;
      state.quarterData = null;
      state.chartsData = null;
      state.loading = false;
      state.quarterLoading = false;
      state.chartsLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch quarter data
    builder
      .addCase(fetchQuarterData.pending, (state) => {
        state.quarterLoading = true;
        state.error = null;
      })
      .addCase(fetchQuarterData.fulfilled, (state, action) => {
        state.quarterLoading = false;
        state.quarterData = action.payload;
      })
      .addCase(fetchQuarterData.rejected, (state, action) => {
        state.quarterLoading = false;
        state.error = action.payload as string;
      });

    // Fetch charts data
    builder
      .addCase(fetchChartsData.pending, (state) => {
        state.chartsLoading = true;
        state.error = null;
      })
      .addCase(fetchChartsData.fulfilled, (state, action) => {
        state.chartsLoading = false;
        state.chartsData = action.payload;
      })
      .addCase(fetchChartsData.rejected, (state, action) => {
        state.chartsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
