import { configureStore } from '@reduxjs/toolkit';
import configReducer from './slices/configSlice';
import metadataReducer from './slices/metadataSlice';

export const store = configureStore({
  reducer: {
    config: configReducer,
    metadata: metadataReducer,
  },
});
