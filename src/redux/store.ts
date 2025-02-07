import { configureStore } from '@reduxjs/toolkit';
import appUserReducer from './appUserSlice';
import flavorRequestReducer from "./flavorRequestSlice";
import productsReducer from "./productsSlice";
import reviewsReducer from "./reviewsSlice";

export const store = configureStore({
  reducer: {
    appUser: appUserReducer,
    flavorRequests: flavorRequestReducer,
    products: productsReducer,
    reviews: reviewsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['appUsers'], 
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;