import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { dishApi } from "./dishApi";
import { DISH_URLS } from "./dishUrls";

export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
  cookingTime: number;
  servings: number;
  imageUrl: string | null;
  ingredients: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface PaginatedDishes {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Dish[];
}

interface DishState {
  loading: boolean;
  error: string | null;
  data: PaginatedDishes | null;
}
// ---

const initialState: DishState = {
  loading: false,
  error: null,
  data: null,
};

interface GetDishesParams {
  pageIndex?: number;
  pageSize?: number;
}
export const getDishesThunk = createAsyncThunk(
  DISH_URLS.GET_DISHES,
  async (params: GetDishesParams, { rejectWithValue }) => {
    try {
      const res = await dishApi.getDishes(params);
      return res.data.dishes as PaginatedDishes;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi tải danh sách món ăn"
      );
    }
  }
);

export const deleteDishThunk = createAsyncThunk(
  "dishes/delete",
  async (dishId: string, { rejectWithValue }) => {
    try {
      await dishApi.deleteDish(dishId);
      return dishId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi xóa món ăn");
    }
  }
);

export const createDishThunk = createAsyncThunk(
  "dishes/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await dishApi.createDish(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo món ăn");
    }
  }
);

export const updateDishThunk = createAsyncThunk(
  "dishes/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      await dishApi.updateDish(id, formData);
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi cập nhật món ăn"
      );
    }
  }
);

export const dishSlice = createSlice({
  name: "dish",
  initialState,
  reducers: {
    clearDishError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDishesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getDishesThunk.fulfilled,
        (state, action: PayloadAction<PaginatedDishes>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getDishesThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteDishThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteDishThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          if (state.data) {
            state.data.data = state.data.data.filter(
              (dish) => dish.id !== action.payload
            );
            state.data.count -= 1;
          }
        }
      )
      .addCase(deleteDishThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createDishThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDishThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDishThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateDishThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDishThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDishThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearDishError } = dishSlice.actions;
export default dishSlice.reducer;
