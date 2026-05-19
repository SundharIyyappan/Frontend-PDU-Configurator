import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMetadata = createAsyncThunk(
  'metadata/fetchMetadata',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/metadata');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    options: {},
    rules: [],
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMetadataSuccess: (state, action) => {
      state.options = action.payload.options;
      state.rules = action.payload.rules;
      state.loading = false;
      state.error = null;
    },
    setMetadataError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetadata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetadata.fulfilled, (state, action) => {
        state.options = action.payload.options;
        state.rules = action.payload.rules;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchMetadata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { setLoading, setMetadataSuccess, setMetadataError } = metadataSlice.actions;
export default metadataSlice.reducer;
