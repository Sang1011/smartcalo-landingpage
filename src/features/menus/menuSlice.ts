import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { menuApi } from "./menuApi";
import { MENU_URLS } from "./menuUrls";

export interface MenuSummary {
  id: string;
  menuName: string;
  description: string | null;
  imageUrl: string | null;
  menuSource: string;
  mealsPerDay: number;
  dailyCaloriesMin: number;
  dailyCaloriesMax: number;
  createdByUserName: string | null;
  dayCount: number;
}

export interface PaginatedMenus {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: MenuSummary[];
}

interface MenuState {
  loading: boolean;
  error: string | null;
  data: PaginatedMenus | null;
}
// ---

const initialState: MenuState = {
  loading: false,
  error: null,
  data: null,
};

interface GetMenusParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}
export const getMenusThunk = createAsyncThunk(
  MENU_URLS.GET_MENUS,
  async (params: GetMenusParams, { rejectWithValue }) => {
    try {
      const apiParams = { pageNumber: 1, pageSize: 10, ...params };
      const res = await menuApi.getMenus(apiParams);
      return res.data as PaginatedMenus;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Lỗi tải danh sách thực đơn"
      );
    }
  }
);

export const createMenuThunk = createAsyncThunk(
  "menus/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await menuApi.createMenu(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo thực đơn");
    }
  }
);

interface AddMenuDayPayload {
  menuId: string;
  dayNumber: number;
}
export const addMenuDayThunk = createAsyncThunk(
  "menus/addDay",
  async ({ menuId, dayNumber }: AddMenuDayPayload, { rejectWithValue }) => {
    try {
      const res = await menuApi.addMenuDay(menuId, { dayNumber });
      return { menuId, dayNumber, menuDayId: res.data.menuDayId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || `Lỗi thêm ngày ${dayNumber}`
      );
    }
  }
);

interface AddMealPayload {
  menuId: string;
  dayNumber: number;
  mealType: string;
  isMainMeal: boolean;
  dishIds: string[];
}
export const addMealThunk = createAsyncThunk(
  "menus/addMeal",
  async (payload: AddMealPayload, { rejectWithValue }) => {
    try {
      const { menuId, dayNumber, ...mealData } = payload;
      const res = await menuApi.addMeal(menuId, dayNumber, mealData);
      return { ...payload, mealId: res.data.mealId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || `Lỗi thêm bữa ăn`);
    }
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMenusThunk.fulfilled,
        (state, action: PayloadAction<PaginatedMenus>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getMenusThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createMenuThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMenuThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMenuThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addMenuDayThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMenuDayThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMenuDayThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addMealThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMealThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMealThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
