import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RootState } from "../../app/store";
import { googleLoginThunk } from "../../features/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage("Có lỗi xảy ra khi đăng nhập.");
    }
  };

  const handleGoogleFailure = () => {
    setErrorMessage("Đăng nhập Google thất bại.");
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
