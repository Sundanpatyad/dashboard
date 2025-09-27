import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getData, postData, putData, deleteData } from '../api/api';

// Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanType {
  _id: string;
  planType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  subtitle?: string;
  price: number;
  image?: string;
  features: string[];
  planType?: PlanType;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesState {
  services: Service[];
  categories: Category[];
  loading: boolean;
  categoriesLoading: boolean;
  actionLoading: { [key: string]: boolean };
  error: string | null;
  searchTerm: string;
  categoryFilter: string;
  viewMode: 'grid' | 'list';
}

// Initial state
const initialState: ServicesState = {
  services: [],
  categories: [],
  loading: false,
  categoriesLoading: false,
  actionLoading: {},
  error: null,
  searchTerm: '',
  categoryFilter: 'all',
  viewMode: 'grid',
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params: { searchTerm?: string; categoryFilter?: string }, { rejectWithValue }) => {
    try {
      const urlParams = new URLSearchParams();
      if (params.searchTerm) urlParams.append('search', params.searchTerm);
      if (params.categoryFilter && params.categoryFilter !== 'all') {
        urlParams.append('category', params.categoryFilter);
      }
      
      const queryString = urlParams.toString();
      const endpoint = `/api/services/allServicesDashboard${queryString ? `?${queryString}` : ''}`;
      
      const response = await getData(endpoint);
      
      if (response.success) {
        return response.data || [];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch services');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'services/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/api/services/category');
      
      if (response.success) {
        return response.data || [];
      } else {
        return rejectWithValue(response.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData: FormData, { rejectWithValue }) => {
    try {
      const response = await postData('/api/services/createServicePlan', serviceData, { isMultipart: true });
      
      if (response) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create service');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, serviceData }: { id: string; serviceData: FormData }, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/services/editServicePlan/${id}`, serviceData, { isMultipart: true });
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to update service');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId: string, { rejectWithValue }) => {
    try {
      const response = await deleteData(`/api/services/deleteService/${serviceId}`);
      
      if (response) {
        return serviceId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete service');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
    }
  }
);

export const createCategory = createAsyncThunk(
  'services/createCategory',
  async (categoryData: FormData, { rejectWithValue }) => {
    try {
      const response = await postData('/api/services/category', categoryData, { isMultipart: true });
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to create category');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'services/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await deleteData(`/api/services/deleteCategory/${categoryId}`);
      
      if (response.success) {
        return categoryId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete category');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

// Services slice
const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setActionLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.actionLoading[action.payload.key] = action.payload.loading;
    },
  },
  extraReducers: (builder) => {
    // Fetch services
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error = action.payload as string;
      });

    // Create service
    builder
      .addCase(createService.pending, (state) => {
        state.actionLoading['save'] = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.actionLoading['save'] = false;
        if (action.payload) {
          state.services.push(action.payload);
        }
      })
      .addCase(createService.rejected, (state, action) => {
        state.actionLoading['save'] = false;
        state.error = action.payload as string;
      });

    // Update service
    builder
      .addCase(updateService.pending, (state) => {
        state.actionLoading['save'] = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.actionLoading['save'] = false;
        if (action.payload) {
          const index = state.services.findIndex(s => s._id === action.payload._id);
          if (index !== -1) {
            state.services[index] = action.payload;
          }
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.actionLoading['save'] = false;
        state.error = action.payload as string;
      });

    // Delete service
    builder
      .addCase(deleteService.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.actionLoading[action.payload] = false;
        state.services = state.services.filter(s => s._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.actionLoading['category'] = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.actionLoading['category'] = false;
        if (action.payload) {
          state.categories.push(action.payload);
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.actionLoading['category'] = false;
        state.error = action.payload as string;
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.actionLoading['category'] = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.actionLoading['category'] = false;
        state.categories = state.categories.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.actionLoading['category'] = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setCategoryFilter, setViewMode, clearError, setActionLoading } = servicesSlice.actions;
export default servicesSlice.reducer;
