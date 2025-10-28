import axiosClient from "../../api/axiosClient";
import { DASHBOARD_URLS } from "./dashboardUrls";

export const dashboardApi = {
  getRevenueReport: (year?: number) =>
    axiosClient.get(DASHBOARD_URLS.GET_REVENUE, { params: { year } }),

  getTransactionReport: (year?: number) =>
    axiosClient.get(DASHBOARD_URLS.GET_TRANSACTIONS, { params: { year } }),

  getUserDemographics: () =>
    axiosClient.get(DASHBOARD_URLS.GET_USER_DEMOGRAPHICS),

  getAppReviewStats: () => axiosClient.get(DASHBOARD_URLS.GET_APP_REVIEW_STATS),
};
