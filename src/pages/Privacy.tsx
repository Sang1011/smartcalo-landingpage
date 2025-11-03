import { Layout, Typography, Button} from 'antd';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Hằng số màu Tailwind (giữ lại để dễ tùy chỉnh)
const COLORS = {
    dark_green: 'text-[#006400]', // Màu tiêu đề
    black_70: 'text-gray-600',
    white: 'bg-white',
    black: 'text-black',
    gray_light: 'border-gray-200',
};

export default function Privacy() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/'); 
    };
    return (
        // Sử dụng Layout Antd làm container chính
        <Layout className={`min-h-screen ${COLORS.white}`}>
            {/* Header tùy chỉnh để tích hợp Tailwind và Button */}
            <header className={`flex items-center justify-between px-5 py-4 border-b ${COLORS.gray_light} sticky top-0 bg-white z-10`}>
            <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined style={{ color: '#006400', fontSize: 22 }} />} 
                    onClick={handleGoBack}
                    className="p-1"
                />
                <Title level={3} className={`!m-0 text-lg font-semibold ${COLORS.dark_green}`}>
                    Chính sách quyền riêng tư
                </Title>
                <div className="w-[30px]" /> {/* Khoảng trống giữ cân bằng */}
            </header>

            {/* Content Antd thay thế ScrollView */}
            <Content className="p-5 pb-10 max-w-4xl mx-auto w-full">
                <Typography>
                    {/* Đoạn 1 */}
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed`}>
                        Ứng dụng <span className={`font-semibold ${COLORS.black}`}>SmartCalo</span> tôn trọng và cam kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo mật thông tin cá nhân của bạn.
                    </Paragraph>

                    {/* 1. Thông tin được thu thập */}
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>1. Thông tin được thu thập</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed whitespace-pre-line`}>
                        Chúng tôi có thể thu thập các loại thông tin sau:{"\n"}
                        - Họ tên, địa chỉ email, và thông tin đăng nhập.{"\n"}
                        - Dữ liệu dinh dưỡng, cân nặng, chiều cao, và mục tiêu sức khỏe.{"\n"}
                        - Thông tin thiết bị và hoạt động sử dụng ứng dụng.
                    </Paragraph>

                    {/* 2. Mục đích sử dụng thông tin */}
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>2. Mục đích sử dụng thông tin</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed whitespace-pre-line`}>
                        Thông tin thu thập được dùng để:{"\n"}
                        - Cung cấp, duy trì và cải thiện trải nghiệm người dùng.{"\n"}
                        - Cá nhân hóa gợi ý thực đơn và kế hoạch dinh dưỡng.{"\n"}
                        - Gửi thông báo liên quan đến tài khoản hoặc cập nhật dịch vụ.
                    </Paragraph>
                    
                    {/* Các mục còn lại... (3, 4, 5, 6) */}
                    
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>3. Bảo mật dữ liệu</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed`}>
                        SmartCalo áp dụng các biện pháp kỹ thuật để bảo vệ dữ liệu khỏi truy cập, sửa đổi hoặc tiết lộ trái phép. Tuy nhiên, không có phương thức truyền dữ liệu nào qua Internet hoàn toàn an toàn, và chúng tôi không thể đảm bảo tuyệt đối.
                    </Paragraph>
                    
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>4. Quyền của người dùng</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed`}>
                        Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân của mình bất kỳ lúc nào. Vui lòng gửi yêu cầu qua email hỗ trợ của chúng tôi để được xử lý.
                    </Paragraph>
                    
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>5. Thay đổi chính sách</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed`}>
                        Chính sách này có thể được cập nhật định kỳ. Mọi thay đổi sẽ được thông báo trong ứng dụng hoặc qua email trước khi áp dụng.
                    </Paragraph>

                    {/* 6. Liên hệ */}
                    <Title level={4} className={`!text-xl font-semibold ${COLORS.black} mt-6 mb-2`}>6. Liên hệ</Title>
                    <Paragraph className={`text-base ${COLORS.black_70} leading-relaxed mb-2`}>
                        Nếu bạn có câu hỏi liên quan đến quyền riêng tư, vui lòng liên hệ:
                    </Paragraph>

                    {/* Thông tin liên hệ */}
                    <div className="flex items-center gap-2">
                        <MailOutlined style={{ fontSize: '24px', color: '#000' }} />
                        <Paragraph className="!mb-0">Email: pentasmartcalo@gmail.com</Paragraph>
                    </div>
                    
                    {/* Cập nhật lần cuối */}
                    <Paragraph className="text-gray-400 w-full mt-4 text-sm">
                        Cập nhật lần cuối: 27/10/2025
                    </Paragraph>
                </Typography>
            </Content>
        </Layout>
    );
}