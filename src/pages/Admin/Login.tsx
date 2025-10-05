import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLoginThunk } from "../../features/auth/authSlice";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import type { AppDispatch, RootState } from "../../app/store";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    
    // try {
    //   console.log("✅ Nhận phản hồi từ Google:", credentialResponse);

    //   const idToken = credentialResponse.credential; // ✅ Google trả về 'credential' chứ không phải 'idToken'
    //   if (!idToken) throw new Error("Không nhận được token Google.");

    //   console.log("🎫 Nhận được idToken:", idToken);

    //   const resultAction = await dispatch(googleLoginThunk({ idToken }));
    //   console.log("📦 Kết quả dispatch:", resultAction);

    //   if (googleLoginThunk.fulfilled.match(resultAction)) {
    //     const { accessToken, refreshToken } = resultAction.payload;
    //     login(accessToken, refreshToken);
    //     navigate("/admin/dashboard");
    //   } else {
    //     console.error("❌ Google login failed:", resultAction.payload);
    //   }
    // } catch (err) {
    //   console.error("⚠️ Google login error:", err);
    // }
  };

  const handleGoogleFailure = () => {
    console.error("❌ Đăng nhập Google thất bại");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />

        {loading && (
          <p className="text-gray-500 text-sm mt-4">Đang xử lý đăng nhập...</p>
        )}
      </div>
    </div>
  );
}
