import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { QuotesState, QuoteFormData, QuoteFilters } from '../types';
import {
  getQuotes as getQuotesService,
  getQuote as getQuoteService,
  createQuote as createQuoteService,
  updateQuote as updateQuoteService,
  deleteQuote as deleteQuoteService,
  getProjectQuotes as getProjectQuotesService,
  getClientQuotes as getClientQuotesService,
} from '../service';

const initialState: QuotesState = {
  quotes: [],
  currentQuote: null,
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
export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async (filters: QuoteFilters = {}) => {
    const response = await getQuotesService(filters);
    return response;
  }
);

export const fetchQuote = createAsyncThunk('quotes/fetchQuote', async (id: number) => {
  const response = await getQuoteService(id);
  return response;
});

export const createQuoteAction = createAsyncThunk(
  'quotes/createQuote',
  async (quoteData: QuoteFormData) => {
    const response = await createQuoteService(quoteData);
    return response;
  }
);

export const updateQuoteAction = createAsyncThunk(
  'quotes/updateQuote',
  async ({ id, quoteData }: { id: number; quoteData: Partial<QuoteFormData> }) => {
    const response = await updateQuoteService(id, quoteData);
    return response;
  }
);

export const deleteQuoteAction = createAsyncThunk('quotes/deleteQuote', async (id: number) => {
  await deleteQuoteService(id);
  return id;
});

export const fetchProjectQuotes = createAsyncThunk(
  'quotes/fetchProjectQuotes',
  async ({ projectId, filters = {} }: { projectId: number; filters?: QuoteFilters }) => {
    const response = await getProjectQuotesService(projectId, filters);
    return response;
  }
);

export const fetchClientQuotes = createAsyncThunk(
  'quotes/fetchClientQuotes',
  async ({ clientId, filters = {} }: { clientId: number; filters?: QuoteFilters }) => {
    const response = await getClientQuotesService(clientId, filters);
    return response;
  }
);

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    clearCurrentQuote: (state) => {
      state.currentQuote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch quotes
      .addCase(fetchQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch single quote
      .addCase(fetchQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Create quote
      .addCase(createQuoteAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuoteAction.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes.unshift(action.payload);
      })
      .addCase(createQuoteAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Update quote
      .addCase(updateQuoteAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuoteAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotes.findIndex((quote) => quote.id === action.payload.id);
        if (index !== -1) {
          state.quotes[index] = action.payload;
        }
        if (state.currentQuote && state.currentQuote.id === action.payload.id) {
          state.currentQuote = action.payload;
        }
      })
      .addCase(updateQuoteAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Delete quote
      .addCase(deleteQuoteAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuoteAction.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = state.quotes.filter((quote) => quote.id !== action.payload);
        if (state.currentQuote && state.currentQuote.id === action.payload) {
          state.currentQuote = null;
        }
      })
      .addCase(deleteQuoteAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch project quotes
      .addCase(fetchProjectQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchProjectQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      })

      // Fetch client quotes
      .addCase(fetchClientQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page,
        };
      })
      .addCase(fetchClientQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Une erreur est survenue';
      });
  },
});

export const { clearCurrentQuote, clearError } = quotesSlice.actions;
export default quotesSlice.reducer;
