import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InvoicesState, InvoiceFormData, InvoiceFilters } from '../types';
import {
  getInvoices as getInvoicesService,
  getInvoice as getInvoiceService,
  createInvoice as createInvoiceService,
  updateInvoice as updateInvoiceService,
  deleteInvoice as deleteInvoiceService,
  getProjectInvoices as getProjectInvoicesService,
  getClientInvoices as getClientInvoicesService,
} from '../service';

const initialState: InvoicesState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  },
};

// Actions asynchrones
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async ({ filters = {} }: { filters?: InvoiceFilters }) => {
    const response = await getInvoicesService(filters);
    return response;
  }
);

export const fetchInvoice = createAsyncThunk('invoices/fetchInvoice', async (id: number) => {
  const response = await getInvoiceService(id);
  return response;
});

export const createInvoiceAction = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData: InvoiceFormData) => {
    const response = await createInvoiceService(invoiceData);
    return response;
  }
);

export const updateInvoiceAction = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }: { id: number; invoiceData: InvoiceFormData }) => {
    const response = await updateInvoiceService(id, invoiceData);
    return response;
  }
);

export const deleteInvoiceAction = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id: number) => {
    await deleteInvoiceService(id);
    return id;
  }
);

export const fetchProjectInvoices = createAsyncThunk(
  'invoices/fetchProjectInvoices',
  async ({ projectId, filters = {} }: { projectId: number; filters?: InvoiceFilters }) => {
    const response = await getProjectInvoicesService(projectId, filters);
    return response;
  }
);

export const fetchClientInvoices = createAsyncThunk(
  'invoices/fetchClientInvoices',
  async ({ clientId, filters = {} }: { clientId: number; filters?: InvoiceFilters }) => {
    const response = await getClientInvoicesService(clientId, filters);
    return response;
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch single invoice
      .addCase(fetchInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Create invoice
      .addCase(createInvoiceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoiceAction.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoiceAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Update invoice
      .addCase(updateInvoiceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoiceAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.invoices.findIndex((invoice) => invoice.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice && state.currentInvoice.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      })
      .addCase(updateInvoiceAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Delete invoice
      .addCase(deleteInvoiceAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoiceAction.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter((invoice) => invoice.id !== action.payload);
        if (state.currentInvoice && state.currentInvoice.id === action.payload) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoiceAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch project invoices
      .addCase(fetchProjectInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchProjectInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch client invoices
      .addCase(fetchClientInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchClientInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { clearCurrentInvoice, clearError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
