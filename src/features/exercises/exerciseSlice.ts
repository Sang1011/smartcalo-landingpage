import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { exerciseApi } from "./exerciseApi";
import { EXERCISE_URLS } from "./exerciseUrls";

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  gifUrl: string | null;
  difficulty: string | number;
}

export interface PaginatedExercises {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Exercise[];
}

interface ExerciseState {
  loading: boolean;
  error: string | null;
  data: PaginatedExercises | null;
}
// ---

const initialState: ExerciseState = {
  loading: false,
  error: null,
  data: null,
};

interface GetExercisesParams {
  PageIndex?: number;
  PageSize?: number;
  name?: string;
  difficulty?: number;
  isAscending?: boolean;
}
export const getExercisesThunk = createAsyncThunk(
  EXERCISE_URLS.GET_EXERCISES,
  async (params: GetExercisesParams, { rejectWithValue }) => {
    try {
      const apiParams = {
        isAscending: true,
        PageIndex: 1,
        PageSize: 10,
        ...params,
      };
      delete (apiParams as any).pageIndex;
      delete (apiParams as any).pageSize;

      const res = await exerciseApi.getExercises(apiParams);
      return res.data.exercises as PaginatedExercises;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Lỗi tải danh sách bài tập"
      );
    }
  }
);

export const deleteExerciseThunk = createAsyncThunk(
  "exercises/delete",
  async (exerciseId: string, { rejectWithValue }) => {
    try {
      const res = await exerciseApi.deleteExercise(exerciseId);
      if (res.data.isSuccess) {
        return exerciseId;
      } else {
        return rejectWithValue("Xóa bài tập thất bại từ API");
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi xóa bài tập");
    }
  }
);

export const createExerciseThunk = createAsyncThunk(
  "exercises/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await exerciseApi.createExercise(formData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi tạo bài tập");
    }
  }
);

export const updateExerciseThunk = createAsyncThunk(
  "exercises/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      await exerciseApi.updateExercise(id, formData);
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Lỗi cập nhật bài tập"
      );
    }
  }
);

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    clearExerciseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExercisesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getExercisesThunk.fulfilled,
        (state, action: PayloadAction<PaginatedExercises>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getExercisesThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Exercise
      .addCase(deleteExerciseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteExerciseThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          if (state.data) {
            state.data.data = state.data.data.filter(
              (ex) => ex.id !== action.payload
            );
            state.data.count -= 1;
          }
        }
      )
      .addCase(deleteExerciseThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createExerciseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExerciseThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createExerciseThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateExerciseThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExerciseThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExerciseThunk.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { clearExerciseError } = exerciseSlice.actions;
export default exerciseSlice.reducer;
