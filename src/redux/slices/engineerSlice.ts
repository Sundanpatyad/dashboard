import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../api/api';

// Engineer interface based on your schema
export interface Engineer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  isAvailable: boolean;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  isSuspended: boolean;
  assignedOrders: string[];
  createdAt: string;
  updatedAt: string;
}

// Engineer form data interface
export interface EngineerFormData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
}

// Engineer filters interface
export interface EngineerFilters {
  searchTerm: string;
  availability: 'all' | 'available' | 'unavailable';
  status: 'all' | 'active' | 'inactive' | 'blocked' | 'suspended';
  verification: 'all' | 'verified' | 'unverified';
}

// Initial state interface
interface EngineerState {
  engineers: Engineer[];
  availableEngineers: Engineer[];
  loading: boolean;
  error: string | null;
  actionLoading: { [key: string]: boolean };
  filters: EngineerFilters;
}

// Initial state
const initialState: EngineerState = {
  engineers: [],
  availableEngineers: [],
  loading: false,
  error: null,
  actionLoading: {},
  filters: {
    searchTerm: '',
    availability: 'all',
    status: 'all',
    verification: 'all'
  }
};

// Async thunks
export const getAllEngineers = createAsyncThunk(
  'engineers/getAllEngineers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/api/engineer/getEngineers');
      console.log("API Response:", response);
      // Handle both direct array response and wrapped response
      const engineers = Array.isArray(response) ? response : (response.data || response);
      console.log("Processed engineers:", engineers);
      return engineers;
    } catch (error: any) {
      console.error("Error fetching engineers:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch engineers');
    }
  }
);

export const getAvailableEngineers = createAsyncThunk(
  'engineers/getAvailableEngineers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/api/engineer/getAvialbleEngineers');
      console.log("Available Engineers API Response:", response);
      // Handle both direct array response and wrapped response
      const engineers = Array.isArray(response) ? response : (response.data || response);
      console.log("Processed available engineers:", engineers);
      return engineers;
    } catch (error: any) {
      console.error("Error fetching available engineers:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available engineers');
    }
  }
);

export const addEngineer = createAsyncThunk(
  'engineers/addEngineer',
  async (engineerData: EngineerFormData, { rejectWithValue }) => {
    try {
      const response = await postData('/api/engineer/addEngineer', engineerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add engineer');
    }
  }
);

export const updateEngineer = createAsyncThunk(
  'engineers/updateEngineer',
  async ({ id, engineerData }: { id: string; engineerData: Partial<EngineerFormData> }, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/engineer/updateEngineer/${id}`, engineerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update engineer');
    }
  }
);

export const deleteEngineer = createAsyncThunk(
  'engineers/deleteEngineer',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteData(`/api/engineer/deleteEngineer/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete engineer');
    }
  }
);

export const toggleEngineerStatus = createAsyncThunk(
  'engineers/toggleEngineerStatus',
  async ({ id, status, value }: { id: string; status: 'isAvailable' | 'isActive' | 'isBlocked' | 'isSuspended'; value: boolean }, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/engineer/toggleEngineerStatus/${id}`, { [status]: value });
      return { id, status, value, engineer: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update engineer status');
    }
  }
);

export const verifyEngineer = createAsyncThunk(
  'engineers/verifyEngineer',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/engineer/verifyEngineer/${id}`, { isVerified: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify engineer');
    }
  }
);


// Engineer slice
const engineerSlice = createSlice({
  name: 'engineers',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },
    setAvailabilityFilter: (state, action: PayloadAction<'all' | 'available' | 'unavailable'>) => {
      state.filters.availability = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive' | 'blocked' | 'suspended'>) => {
      state.filters.status = action.payload;
    },
    setVerificationFilter: (state, action: PayloadAction<'all' | 'verified' | 'unverified'>) => {
      state.filters.verification = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
        availability: 'all',
        status: 'all',
        verification: 'all'
      };
    },
    setActionLoading: (state, action: PayloadAction<{ id: string; loading: boolean }>) => {
      state.actionLoading[action.payload.id] = action.payload.loading;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all engineers
      .addCase(getAllEngineers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEngineers.fulfilled, (state, action) => {
        state.loading = false;
        state.engineers = action.payload;
      })
      .addCase(getAllEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get available engineers
      .addCase(getAvailableEngineers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableEngineers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableEngineers = action.payload;
      })
      .addCase(getAvailableEngineers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add engineer
      .addCase(addEngineer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEngineer.fulfilled, (state, action) => {
        state.loading = false;
        state.engineers.push(action.payload);
      })
      .addCase(addEngineer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update engineer
      .addCase(updateEngineer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEngineer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.engineers.findIndex(engineer => engineer._id === action.payload._id);
        if (index !== -1) {
          state.engineers[index] = action.payload;
        }
      })
      .addCase(updateEngineer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete engineer
      .addCase(deleteEngineer.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteEngineer.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.engineers = state.engineers.filter(engineer => engineer._id !== action.payload);
        state.availableEngineers = state.availableEngineers.filter(engineer => engineer._id !== action.payload);
      })
      .addCase(deleteEngineer.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      
      // Toggle engineer status
      .addCase(toggleEngineerStatus.pending, (state, action) => {
        state.actionLoading[action.meta.arg.id] = true;
        state.error = null;
      })
      .addCase(toggleEngineerStatus.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg.id] = false;
        const { id, status, value } = action.payload;
        const engineerIndex = state.engineers.findIndex(engineer => engineer._id === id);
        if (engineerIndex !== -1) {
          state.engineers[engineerIndex] = { ...state.engineers[engineerIndex], [status]: value };
        }
        
        // Update available engineers list if availability changed
        if (status === 'isAvailable') {
          if (value) {
            // Add to available engineers if not already present
            const isAlreadyInAvailable = state.availableEngineers.some(eng => eng._id === id);
            if (!isAlreadyInAvailable) {
              state.availableEngineers.push(state.engineers[engineerIndex]);
            }
          } else {
            // Remove from available engineers
            state.availableEngineers = state.availableEngineers.filter(eng => eng._id !== id);
          }
        }
      })
      .addCase(toggleEngineerStatus.rejected, (state, action) => {
        state.actionLoading[action.meta.arg.id] = false;
        state.error = action.payload as string;
      })
      
      // Verify engineer
      .addCase(verifyEngineer.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(verifyEngineer.fulfilled, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        const index = state.engineers.findIndex(engineer => engineer._id === action.payload._id);
        if (index !== -1) {
          state.engineers[index] = action.payload;
        }
      })
      .addCase(verifyEngineer.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setSearchTerm,
  setAvailabilityFilter,
  setStatusFilter,
  setVerificationFilter,
  clearFilters,
  setActionLoading,
  clearError
} = engineerSlice.actions;

export default engineerSlice.reducer;
