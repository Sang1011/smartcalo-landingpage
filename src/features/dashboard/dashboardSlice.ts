import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { dashboardApi } from "./dashboardApi";

interface ChartDataPointDto {
  name: string;
  value: number;
}

interface RevenueReportDto {
  totalRevenue: number;
  monthlyRevenue: ChartDataPointDto[];
}

interface TransactionReportDto {
  totalTransactions: number;
  monthlyTransactions: ChartDataPointDto[];
}

interface UserDemographicsDto {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
}

interface AppReviewStatsDto {
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

export interface DashboardData {
  revenueReport: RevenueReportDto;
  transactionReport: TransactionReportDto;
  userDemographics: UserDemographicsDto;
  appReviewStats: AppReviewStatsDto;
}

interface DashboardState {
  loading: boolean;
  error: string | null;
  data: DashboardData | null;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  data: null,
};

export const getDashboardDataThunk = createAsyncThunk(
  "dashboard/getData",
  async ({ year }: { year?: number }, { rejectWithValue }) => {
    try {
      const [revenueRes, transactionRes, demographicsRes, reviewRes] =
        await Promise.all([
          dashboardApi.getRevenueReport(year),
          dashboardApi.getTransactionReport(year),
          dashboardApi.getUserDemographics(),
          dashboardApi.getAppReviewStats(),
        ]);

      const dashboardData: DashboardData = {
        revenueReport: revenueRes.data,
        transactionReport: transactionRes.data,
        userDemographics: demographicsRes.data,
        appReviewStats: reviewRes.data,
      };

      return dashboardData;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải dữ liệu dashboard"
      );
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getDashboardDataThunk.fulfilled,
        (state, action: PayloadAction<DashboardData>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getDashboardDataThunk.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
