import { Action,configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer, { resetAuth } from './auth/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AuthState } from '@/types/models/auth';

interface AppState {
  auth: AuthState;
}


const rootReducer = combineReducers({
  auth: authReducer,
});

const appReducer = (state: AppState | undefined, action: Action) => {
  return rootReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export function removeLoggedInUser() {
  store.dispatch(resetAuth());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const dispatchAction = store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
