import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClients, getClient, createClient, updateClient, deleteClient } from '../service';
import type { Client, ClientFormData, ClientSearchParams } from '../types';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
  pagination: null,
};

// Actions async
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params: ClientSearchParams = {}) => {
    const response = await getClients(params);
    return response;
  }
);

export const fetchClient = createAsyncThunk('clients/fetchClient', async (id: number) => {
  const response = await getClient(id);
  return response;
});

export const createClientAction = createAsyncThunk(
  'clients/createClient',
  async ({ clientData, accountId }: { clientData: ClientFormData; accountId: number }) => {
    const response = await createClient(clientData, accountId);
    return response;
  }
);

export const updateClientAction = createAsyncThunk(
  'clients/updateClient',
  async ({
    id,
    clientData,
    accountId,
  }: {
    id: number;
    clientData: ClientFormData;
    accountId: number;
  }) => {
    const response = await updateClient(id, clientData, accountId);
    return response;
  }
);

export const deleteClientAction = createAsyncThunk('clients/deleteClient', async (id: number) => {
  await deleteClient(id);
  return id;
});

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    // fetchClients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          per_page: action.payload.data.per_page,
          total: action.payload.data.total,
        };
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des clients';
      });

    // fetchClient
    builder
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClient = action.payload;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement du client';
      });

    // createClient
    builder
      .addCase(createClientAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClientAction.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.unshift(action.payload);
      })
      .addCase(createClientAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la création du client';
      });

    // updateClient
    builder
      .addCase(updateClientAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClientAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clients.findIndex((client) => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.currentClient?.id === action.payload.id) {
          state.currentClient = action.payload;
        }
      })
      .addCase(updateClientAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la mise à jour du client';
      });

    // deleteClient
    builder
      .addCase(deleteClientAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClientAction.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = state.clients.filter((client) => client.id !== action.payload);
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClientAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la suppression du client';
      });
  },
});

export const { clearError, clearCurrentClient } = clientSlice.actions;
export default clientSlice.reducer;
