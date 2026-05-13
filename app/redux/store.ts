// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import userReducer from './slices/userSlice';
import categoryReducer from './slices/categorySlice';
import sellerReducer from './slices/sellerSlice';
import productReducer from './slices/productSlice';
import analyticsReducer from './slices/analyticsSlice';
import wishlistReducer from './slices/wishlistSlice';
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,                         // 👈
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  category: categoryReducer,
  seller: sellerReducer,
  product: productReducer,
  analytics: analyticsReducer,
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;