// src/slice/friendSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../lib/api";

// ✅ Fetch Recommended Users
export const getRecommendedUsers = createAsyncThunk(
  "friends/getRecommendedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load users");
    }
  }
);

// ✅ Fetch My Friends
export const getMyFriends = createAsyncThunk(
  "friends/getMyFriends",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/friends");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load friends");
    }
  }
);

// ✅ Send Friend Request
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (recipientId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/friend-request/${recipientId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send request");
    }
  }
);

// ✅ Accept Friend Request
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/friend-request/${requestId}/accept`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to accept request");
    }
  }
);

// ✅ Get Friend Requests
export const getFriendRequests = createAsyncThunk(
  "friends/getFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/friend-request");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load requests");
    }
  }
);

// ✅ Get Friend Requests for notification 
export const getFriendRequestsForNotification = createAsyncThunk(
  "friends/getFriendRequestsForNotification",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/friend-request");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load requests");
    }
  }
);

// ✅ Fetch Outgoing Friend Requests
export const getOutgoingFriendRequests = createAsyncThunk(
  "friends/getOutgoingFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/outgoing-friend-request");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load outgoing requests");
    }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    recommended: [],
    friends: [],
    requests: [],
    outgoingRequests: [],
    incomingRequestsCount: 0,
    isLoading: false,
    buttonLoading:false,
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get Recommended Users
      .addCase(getRecommendedUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommended = action.payload;
      })
      .addCase(getRecommendedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Get My Friends
      .addCase(getMyFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(getMyFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = false;
        state.buttonLoading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.isLoading = false;
        state.buttonLoading = false;
        state.message = "Friend request sent!";
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.buttonLoading = false;
        state.error = action.payload;
      })

      // ✅ Accept Friend Request
      .addCase(acceptFriendRequest.fulfilled, (state) => {
        state.message = "Friend request accepted!";
      })

      // ✅Get Friend Requests
      .addCase(getFriendRequests.fulfilled, (state, action) => {
      state.requests = action.payload;
      state.incomingRequestsCount = action.payload?.incomingReqs?.length || 0; // ✅ Store count
      state.isLoading = false;
      })
      .addCase(getFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })


      // ✅Get Friend Requests For Notification
      .addCase(getFriendRequestsForNotification.fulfilled, (state, action) => {
      state.requests = action.payload;
      state.incomingRequestsCount = action.payload?.incomingReqs?.length || 0; // ✅ Store count
      state.isLoading = false;
      })
      .addCase(getFriendRequestsForNotification.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(getFriendRequestsForNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Outgoing Requests
      .addCase(getOutgoingFriendRequests.fulfilled, (state, action) => {
        state.outgoingRequests = action.payload;
      });
  },
});

export const { clearError, clearMessage } = friendSlice.actions;
export default friendSlice.reducer;
