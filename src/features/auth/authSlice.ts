import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { AUTH_URLS } from "./authUrls";
import type {
  loginGoogleRequest,
  loginFacebookRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../../types/auth";
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "../../utils/tokenHelper";

interface AuthState {
  loading: boolean;
  error: string | null;
  user: any | null;
  isNewUser?: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  user: null,
};

const handleAuthError = (error: any): string => {
  return error.response?.data?.message || "Authentication failed";
};

// ✅ Google Login
export const googleLoginThunk = createAsyncThunk(
  AUTH_URLS.GOOGLE_LOGIN,
  async ({ idToken }: loginGoogleRequest, { rejectWithValue }) => {
    try {
      
      console.log("idToken", idToken);
      const res = await authApi.googleLogin({ idToken });
      console.log("data",res.data);
      return res.data as LoginResponse;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Facebook Login
export const facebookLoginThunk = createAsyncThunk(
  AUTH_URLS.FACEBOOK_LOGIN,
  async ({ accessToken }: loginFacebookRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.facebookLogin({ accessToken });
      return res.data as LoginResponse;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Refresh Token
export const refreshTokenThunk = createAsyncThunk(
  AUTH_URLS.REFRESH_TOKEN,
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) throw new Error("No tokens available");

      const res = await authApi.refresh({ accessToken, refreshToken });
      return res.data as RefreshTokenResponse;
    } catch (err: any) {
      return rejectWithValue(handleAuthError(err));
    }
  }
);

// ✅ Logout
export const logoutThunk = createAsyncThunk(
  AUTH_URLS.LOGOUT,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) await authApi.logout({ refreshToken });
      dispatch(logout());
      return { success: true };
    } catch (err: any) {
      dispatch(logout());
      return rejectWithValue(handleAuthError(err));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      clearTokens();
    },
    clearError(state) {
      state.error = null;
    },
    setCredentials(state, action: PayloadAction<{ user: any }>) {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };

    const handleLoginFulfilled = (state: AuthState, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.isNewUser = action.payload.isNewUser;
      state.user = action.payload.userDto;
      saveTokens(action.payload.accessToken, action.payload.refreshToken);
    };

    const handleRejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // Google login
      .addCase(googleLoginThunk.pending, handlePending)
      .addCase(googleLoginThunk.fulfilled, handleLoginFulfilled)
      .addCase(googleLoginThunk.rejected, handleRejected)

      // Facebook login
      .addCase(facebookLoginThunk.pending, handlePending)
      .addCase(facebookLoginThunk.fulfilled, handleLoginFulfilled)
      .addCase(facebookLoginThunk.rejected, handleRejected)

      // Refresh token
      .addCase(refreshTokenThunk.pending, handlePending)
      .addCase(refreshTokenThunk.fulfilled, (state, action: PayloadAction<RefreshTokenResponse>) => {
        state.loading = false;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        clearTokens();
      })

      // Logout
      .addCase(logoutThunk.pending, handlePending)
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        clearTokens();
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
