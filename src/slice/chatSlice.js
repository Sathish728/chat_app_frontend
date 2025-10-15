import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {api} from "../lib/api";



export const getStreamToken = createAsyncThunk(
  "chat/getStreamToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/token`);
      return response.data.token; // backend returns {token}
    } catch (error) {
      console.error("Error fetching Stream token:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Stream token"
      );
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    token: null,
    client: null,
    call: null,
    loading: false,
    error: null,
  },
  reducers: {
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setCall: (state, action) => {
      state.call = action.payload;
    },
    resetChat: (state) => {
      state.token = null;
      state.client = null;
      state.call = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStreamToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStreamToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(getStreamToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setClient, setCall, resetChat } = chatSlice.actions;
export default chatSlice.reducer;