import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  role: string | null;
  email: string | null;
}

const initialState: AuthState = {
  role: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.role = action.payload.role;
      state.email = action.payload.email;
    },
    resetAuth: () => initialState,
  },
});

export const { setCredentials, resetAuth } = authSlice.actions;
export default authSlice.reducer;
