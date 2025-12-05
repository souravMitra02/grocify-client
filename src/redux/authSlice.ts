import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authHelper } from "@/lib/auth";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.email = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      authHelper.removeToken(); 
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;