import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <FrownOutlined className="text-6xl text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-gray-800">404 - Không tìm thấy trang</h1>
      <p className="text-gray-500 mb-6">Trang bạn đang truy cập không tồn tại hoặc đã bị xóa.</p>
      <Button type="primary" onClick={() => navigate("/")}>
        Quay lại trang chủ
      </Button>
    </div>
  );
}
