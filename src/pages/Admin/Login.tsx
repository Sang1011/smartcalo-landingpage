import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../app/store";
import { googleLoginThunk } from "../../features/auth";
import { useAuth } from "../../contexts/AuthContext"; // ⚠️ Đảm bảo đường dẫn đúng

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // ✅ Khi Google trả về credential
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log("✅ Nhận phản hồi từ Google:", credentialResponse);
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("Không nhận được token Google.");

      // Gửi lên server qua Redux Thunk
      const resultAction = await dispatch(googleLoginThunk({ idToken }) as any);
      console.log("📦 Kết quả dispatch:", resultAction);

      if (googleLoginThunk.fulfilled.match(resultAction)) {
        const { accessToken, refreshToken } = resultAction.payload;
        login(accessToken, refreshToken); // ✅ lưu token vào context
        navigate("/admin"); // ✅ chuyển hướng
      } else {
        console.error("❌ Google login failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("⚠️ Google login error:", err);
    }
  };

  const handleGoogleFailure = () => {
    console.error("❌ Đăng nhập Google thất bại");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">
            ⚠️ {error}
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
