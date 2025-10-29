import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../utils/tokenHelper";
import { authApi } from "../features/auth/authApi"; // ✅ đường dẫn đến authApi.ts (sửa lại nếu cần)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5013/api";
console.log("🔗 Kết nối API:", API_URL);

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ===============================
// 🧩 REQUEST INTERCEPTOR
// ===============================
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);

    console.log(`➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// 🔄 REFRESH TOKEN LOGIC
// ===============================
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ===============================
// ⚠️ RESPONSE INTERCEPTOR
// ===============================
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi không phải 401, thì trả lỗi như bình thường
    if (error.response?.status !== 401) {
      console.error("❌ Lỗi API:", error.response?.status, error.response?.data);
      return Promise.reject(error);
    }

    // Nếu request này đã thử refresh rồi mà vẫn fail → logout
    if (originalRequest._retry) {
      clearTokens();
      window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    // Đánh dấu request đang retry
    originalRequest._retry = true;

    // Nếu đang refresh token → chờ refresh xong
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return axiosClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!refreshToken || !accessToken) {
        clearTokens();
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      console.log("🔄 Đang refresh token...");
      const res = await authApi.refresh({ accessToken, refreshToken });

      const newAccess = res.data.accessToken;
      const newRefresh = res.data.refreshToken;

      saveTokens(newAccess, newRefresh);
      processQueue(null, newAccess);

      // Retry lại request cũ
      originalRequest.headers["Authorization"] = "Bearer " + newAccess;
      return axiosClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = "/admin/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;
