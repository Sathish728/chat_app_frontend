// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import themeReducer from '../slice/themeSlice';
import friendReducer from '../slice/friendSlice';
import chatReducer from '../slice/chatSlice';


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    friends: friendReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
