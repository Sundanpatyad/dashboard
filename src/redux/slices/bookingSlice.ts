import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getData, putData } from '../api/api';

// Types based on the API response structure
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ServicePlan {
  _id: string;
  name: string;
  subtitle?: string;
  price: number;
  image?: string;
  features: string[];
  category: Category;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface Notes {
  orderId: string;
  servicePlanId: string;
  servicePlanName: string;
  userId: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface BookingDetails {
  date: string;
  time: string;
  address: string;
  services: BookingService[];
}

export interface Booking {
  _id: string;
  orderId: string;
  userId: string;
  servicePlan: ServicePlan | string; // Can be either populated object or just ID
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  razorpayOrderId: string;
  orderStatus: 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
  customerDetails: CustomerDetails;
  notes: Notes;
  receipt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bookingDetails?: BookingDetails;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  assignedEngineer?: string;
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
  count: number;
}

export interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  count: number;
  actionLoading: { [key: string]: boolean };
  filters: {
    status: string;
    orderStatus: string;
    searchTerm: string;
  };
}

// Initial state
const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
  count: 0,
  actionLoading: {},
  filters: {
    status: 'all',
    orderStatus: 'all',
    searchTerm: '',
  },
};

// Async thunks
export const getAllBookings = createAsyncThunk(
  'bookings/getAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/api/services/allBookings');
      
      if (response.success) {
        return {
          bookings: response.data || [],
          count: response.count || 0,
        };
      } else {
        return rejectWithValue(response.message || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/services/updateOrderStatus/${bookingId}` , {status});
      
      if (response.success) {
        return { bookingId, status, booking: response.data };
      } else {
        return rejectWithValue(response.message || 'Failed to update booking status');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking status');
    }
  }
);

export const assignEngineerToBooking = createAsyncThunk(
  'bookings/assignEngineerToBooking',
  async ({ orderId, engineerId }: { orderId: string; engineerId: string }, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/engineer/assignEngineerToOrder/${orderId}`, { engineerId });
      
      return { orderId, engineerId, booking: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign engineer to booking');
    }
  }
);

export const unassignEngineerFromBooking = createAsyncThunk(
  'bookings/unassignEngineerFromBooking',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await putData(`/api/engineer/unAssignEngineerFromOrder/${orderId}`, {});
      
      return { orderId, booking: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unassign engineer from booking');
    }
  }
);

// Bookings slice
const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setOrderStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.orderStatus = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        orderStatus: 'all',
        searchTerm: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBookingInList: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking._id === action.payload._id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Get all bookings
    builder
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.count = action.payload.count;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update booking status
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { bookingId, booking } = action.payload;
        const index = state.bookings.findIndex(b => b._id === bookingId);
        if (index !== -1 && booking) {
          state.bookings[index] = booking;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign engineer to booking
    builder
      .addCase(assignEngineerToBooking.pending, (state, action) => {
        state.actionLoading[`assign-${action.meta.arg.orderId}`] = true;
        state.error = null;
      })
      .addCase(assignEngineerToBooking.fulfilled, (state, action) => {
        state.actionLoading[`assign-${action.meta.arg.orderId}`] = false;
        const { orderId, engineerId } = action.payload;
        const index = state.bookings.findIndex(b => b._id === orderId);
        if (index !== -1) {
          state.bookings[index] = { ...state.bookings[index], assignedEngineer: engineerId };
        }
      })
      .addCase(assignEngineerToBooking.rejected, (state, action) => {
        state.actionLoading[`assign-${action.meta.arg.orderId}`] = false;
        state.error = action.payload as string;
      });

    // Unassign engineer from booking
    builder
      .addCase(unassignEngineerFromBooking.pending, (state, action) => {
        state.actionLoading[`unassign-${action.meta.arg}`] = true;
        state.error = null;
      })
      .addCase(unassignEngineerFromBooking.fulfilled, (state, action) => {
        state.actionLoading[`unassign-${action.meta.arg}`] = false;
        const { orderId } = action.payload;
        const index = state.bookings.findIndex(b => b._id === orderId);
        if (index !== -1) {
          state.bookings[index] = { ...state.bookings[index], assignedEngineer: undefined };
        }
      })
      .addCase(unassignEngineerFromBooking.rejected, (state, action) => {
        state.actionLoading[`unassign-${action.meta.arg}`] = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStatusFilter,
  setOrderStatusFilter,
  setSearchTerm,
  clearFilters,
  clearError,
  updateBookingInList,
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
