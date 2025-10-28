import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "./userApi";
import { USER_URLS } from "./userUrls";

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  age: number | null;
  gender: number | null;
  currentSubscriptionExpiresAt: string | null;
  role: string;
  customerType: string;
}

export interface PaginatedUsers {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: UserSummary[];
}

interface UserState {
  loading: boolean;
  error: string | null;
  data: PaginatedUsers | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  data: null,
};

interface GetUsersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}
export const getUsersThunk = createAsyncThunk(
  USER_URLS.GET_USERS,
  async (params: GetUsersParams, { rejectWithValue }) => {
    try {
      const res = await userApi.getUsers(params);
      return res.data.users as PaginatedUsers;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tải danh sách user"
      );
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "users/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi xóa user");
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUsersThunk.fulfilled,
        (state, action: PayloadAction<PaginatedUsers>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getUsersThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteUserThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          if (state.data) {
            state.data.data = state.data.data.filter(
              (user) => user.id !== action.payload
            );
            state.data.count -= 1;
          }
        }
      )
      .addCase(deleteUserThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
