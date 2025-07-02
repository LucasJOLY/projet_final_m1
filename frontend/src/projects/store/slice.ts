import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjects, getProject, createProject, updateProject, deleteProject } from '../service';
import type { Project, ProjectFormData, ProjectSearchParams } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  pagination: null,
};

// Actions async
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params: ProjectSearchParams = {}) => {
    const response = await getProjects(params);
    console.log('response', response);
    return response;
  }
);

export const fetchProject = createAsyncThunk('projects/fetchProject', async (id: number) => {
  const response = await getProject(id);
  return response;
});

export const createProjectAction = createAsyncThunk(
  'projects/createProject',
  async ({ projectData, accountId }: { projectData: ProjectFormData; accountId: number }) => {
    const response = await createProject(projectData, accountId);
    return response;
  }
);

export const updateProjectAction = createAsyncThunk(
  'projects/updateProject',
  async ({
    id,
    projectData,
    accountId,
  }: {
    id: number;
    projectData: ProjectFormData;
    accountId: number;
  }) => {
    const response = await updateProject(id, projectData, accountId);
    return response;
  }
);

export const deleteProjectAction = createAsyncThunk(
  'projects/deleteProject',
  async (id: number) => {
    await deleteProject(id);
    return id;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        console.log('action.payload', action.payload);
        state.projects = action.payload.data.data;

        state.pagination = {
          current_page: action.payload.data.current_page,
          last_page: action.payload.data.last_page,
          per_page: action.payload.data.per_page,
          total: action.payload.data.total,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement des projets';
      });

    // fetchProject
    builder
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors du chargement du projet';
      });

    // createProject
    builder
      .addCase(createProjectAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectAction.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createProjectAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la création du projet';
      });

    // updateProject
    builder
      .addCase(updateProjectAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectAction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex((project) => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProjectAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la mise à jour du projet';
      });

    // deleteProject
    builder
      .addCase(deleteProjectAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectAction.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((project) => project.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProjectAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erreur lors de la suppression du projet';
      });
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
