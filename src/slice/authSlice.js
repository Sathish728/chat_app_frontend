
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api';



// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
      }
      
      return rejectWithValue(response.data.message || 'Login failed');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Network error';
      return rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
      }
      
      return rejectWithValue(response.data.message || 'Signup failed');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Network error';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('accessToken');
      return true;
    } catch (error) {
      localStorage.removeItem('accessToken');
      return true;
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get user';
      return rejectWithValue(message);
    }
  }
);

export const onBoard = createAsyncThunk(
  "auth/onboard",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/onboarding", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/refresh');
      
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accessToken);
        return response.data;
      }
      
      return rejectWithValue('Token refresh failed');
    } catch (error) {
      localStorage.removeItem('accessToken');
      return rejectWithValue('Token refresh failed');
    }
  }
);


const user = JSON.parse(localStorage.getItem("user"))
// Initial state
const initialState = {
  user:user ? user : null,
  token: localStorage.getItem('accessToken'),
  isLoading: false,
  globalLoading: true,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  error: null,
  message: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.message = action.payload.message || 'Login successful';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.message = action.payload.message || 'Account created successfully';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.globalLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.message = 'Logged out successfully';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.message = 'Logged out successfully';
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.globalLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('accessToken');
      })

      // onBoard cases
      .addCase(onBoard.pending, (state) => {
        state.isLoading = true;
        state.globalLoading = false;
        state.error = null;
      })
      .addCase(onBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.message = action.payload.message || 'Onboard details created successfully';
      })
      .addCase(onBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.globalLoading = false;
        state.error = action.payload;
      })

      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, clearMessage, setCredentials, resetAuth } = authSlice.actions;
export default authSlice.reducer;