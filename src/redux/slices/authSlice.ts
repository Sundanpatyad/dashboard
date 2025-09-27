import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Frontend-based credentials
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'password', role: 'admin' },
  { username: 'user', password: '123456', role: 'user' },
  { username: 'demo', password: 'demo123', role: 'demo' },
];

// Generate a simple token
const generateToken = (username: string) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2);
  return btoa(`${username}:${timestamp}:${randomStr}`);
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const user = DEMO_CREDENTIALS.find(
        cred => cred.username === credentials.username && cred.password === credentials.password
      );
      
      if (user) {
        const token = generateToken(user.username);
        return {
          user: {
            id: user.username,
            username: user.username,
            role: user.role,
          },
          token,
        };
      } else {
        return rejectWithValue('Invalid username or password');
      }
    } catch (error: any) {
      return rejectWithValue('Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Just return null for frontend-based logout
    return null;
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (token: string, { rejectWithValue }) => {
    try {
      // Decode the token to get user info
      const decoded = atob(token);
      const [username] = decoded.split(':');
      
      // Find user in demo credentials
      const user = DEMO_CREDENTIALS.find(cred => cred.username === username);
      
      if (user) {
        return {
          user: {
            id: user.username,
            username: user.username,
            role: user.role,
          },
          token: token,
        };
      } else {
        return rejectWithValue('Token verification failed');
      }
    } catch (error: any) {
      return rejectWithValue('Token verification failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear the local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Verify token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
