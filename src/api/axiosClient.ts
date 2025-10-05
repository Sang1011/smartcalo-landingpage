import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, clearTokens } from "../utils/tokenHelper";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5013/api";

// 🧩 Log ra thông tin URL kết nối
console.log("🔗 Kết nối API:", API_URL);

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// --- Gắn token vào header trước khi gửi request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // 🔍 Log chi tiết request (method + URL)
    console.log(`➡️ [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Kiểm tra lỗi xác thực
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    console.error("❌ Lỗi API:", error.response?.status, error.response?.data);

    if (error.response?.status === 401) {
      console.warn("⚠️ Phiên đăng nhập đã hết hạn hoặc không hợp lệ.");
      clearTokens();
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
