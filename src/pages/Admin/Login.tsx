import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RootState } from "../../app/store";
import { googleLoginThunk, loginThunk } from "../../features/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🟢 Xử lý đăng nhập Google
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("Không nhận được token Google.");

      const resultAction = await dispatch(googleLoginThunk({ idToken }) as any);
      console.log("📦 Kết quả dispatch:", resultAction);

      if (googleLoginThunk.fulfilled.match(resultAction)) {
        const { accessToken, refreshtoken, userDto } = resultAction.payload;

        // ✅ Kiểm tra quyền
        if (userDto.roles[0] !== "Admin") {
          setErrorMessage("Tài khoản của bạn không có quyền truy cập trang quản trị.");
          return;
        }

        // ✅ Nếu là Admin → lưu token và chuyển hướng
        login(accessToken, refreshtoken);
        navigate("/admin");
      } else {
        setErrorMessage("Đăng nhập Google thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("⚠️ Google login error:", err);
      setErrorMessage("Có lỗi xảy ra khi đăng nhập Google.");
    }
  };

  const handleGoogleFailure = () => {
    setErrorMessage("Đăng nhập Google thất bại.");
  };

  // 🟢 Xử lý đăng nhập thường (email + password)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (!email.trim() || !password.trim()) {
        setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
      }

      const resultAction = await dispatch(loginThunk({ email, password }) as any);
      console.log("📦 Kết quả login:", resultAction);

      if (loginThunk.fulfilled.match(resultAction)) {
        const { accessToken, refreshToken, userDto } = resultAction.payload;

        if (userDto.roles[0] !== "Admin") {
          setErrorMessage("Tài khoản của bạn không có quyền truy cập trang quản trị.");
          return;
        }

        login(accessToken, refreshToken);
        navigate("/admin");
      } else {
        setErrorMessage("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
      }
    } catch (err) {
      console.error("⚠️ Email login error:", err);
      setErrorMessage("Có lỗi xảy ra khi đăng nhập.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>

        {(error || errorMessage) && (
          <p className="text-red-500 text-sm mb-4">
            ⚠️ {errorMessage || error}
          </p>
        )}

        {/* 🔹 Form login thường */}
        <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* 🔹 Divider */}
        <div className="flex items-center justify-center mb-4">
          <div className="h-px w-16 bg-gray-300"></div>
          <span className="text-gray-400 text-sm mx-2">Hoặc</span>
          <div className="h-px w-16 bg-gray-300"></div>
        </div>

        {/* 🔹 Nút Google login */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </div>

        {loading && (
          <p className="text-gray-500 text-sm mt-4 animate-pulse">
            Đang xử lý đăng nhập...
          </p>
        )}
      </div>
    </div>
  );
}
