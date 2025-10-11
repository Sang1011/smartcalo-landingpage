import { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const featuresData = [
  {
    title: "Chụp ảnh món ăn",
    image: "/images/features/feature1.png",
    content: (
      <>
        <h4 className="font-bold text-xl mb-3">
          Chụp ảnh món ăn – Phân tích dinh dưỡng chỉ trong tích tắc!
        </h4>
        <p className="mb-2">
          Bạn chỉ cần giơ điện thoại lên và chụp một tấm hình món ăn, ứng dụng
          sẽ tự động nhận diện các thành phần nguyên liệu và tính toán lượng
          calo chính xác.
        </p>
        <p className="mb-4">
          Không cần nhập tay, không cần tra cứu – tất cả đều được xử lý bằng
          công nghệ AI tiên tiến.
        </p>
        <ul className="space-y-2 list-inside">
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Phân tích thông minh: Nhận diện nguyên liệu như thịt, rau, tinh bột,
            nước sốt...
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Tính toán calo tức thì: Biết ngay món ăn của bạn chứa bao nhiêu năng
            lượng.
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Gợi ý dinh dưỡng: Cân bằng khẩu phần ăn theo mục tiêu sức khỏe của
            bạn.
          </li>
        </ul>
        <p className="mt-4 font-semibold italic">
          Biến mỗi bữa ăn thành một lựa chọn thông minh – chỉ với một cú chụp!
        </p>
      </>
    ),
  },
  {
    title: "Tập luyện cá nhân hóa",
    image: "/images/features/feature2.png",
    content: (
      <>
        <h4 className="font-bold text-xl mb-3">
          Tập luyện cá nhân hóa – Đúng mục tiêu, đúng cách
        </h4>
        <p className="mb-4">
          Ứng dụng sẽ đề xuất lộ trình tập luyện phù hợp với thể trạng, thời
          gian và mục tiêu của bạn:
        </p>
        <ul className="space-y-2 list-inside">
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Giảm cân, tăng cơ, giữ dáng – đều có giải pháp riêng
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Bài tập từ cơ bản đến nâng cao, có video hướng dẫn chi tiết
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Lịch tập linh hoạt, dễ điều chỉnh theo lịch trình cá nhân
          </li>
        </ul>
        <p className="mt-4 font-semibold italic">
          Không cần PT riêng – bạn đã có huấn luyện viên AI đồng hành mỗi ngày!
        </p>
      </>
    ),
  },
  {
    title: "Thực đơn thông minh",
    image: "/images/features/feature3.png",
    content: (
      <>
        <h4 className="font-bold text-xl mb-3">
          Thực đơn thông minh – Ăn ngon, sống khỏe
        </h4>
        <p className="mb-4">
          Dựa trên mục tiêu cá nhân và sở thích ăn uống, app sẽ gợi ý thực đơn
          tối ưu cho từng ngày:
        </p>
        <ul className="space-y-2 list-inside">
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Cân bằng dinh dưỡng, kiểm soát calo
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Đa dạng món ăn, dễ chế biến
          </li>
          <li>
            <CheckCircleOutlined className="text-green-500 mr-3" />
            Danh sách nguyên liệu đi chợ siêu tiện lợi
          </li>
        </ul>
        <p className="mt-4 font-semibold italic">
          Ăn uống không còn là nỗi lo – mà là niềm vui mỗi ngày!
        </p>
      </>
    ),
  },
];

// Dữ liệu gói dịch vụ
const pricingPlans = [
  {
    name: "Miễn Phí",
    price: "0đ",
    billing: "/tháng",
    features: [
      "Nhận diện món ăn (tối đa 10 lần/tháng)",
      "Tính BMR / TDEE / BMI",
      "Theo dõi tiến trình cơ bản",
      "Tra cứu từ điển món ăn Việt",
    ],
  },
  {
    name: "Gói tháng",
    price: "35.000đ",
    billing: "/tháng",
    features: [
      "Bao gồm toàn bộ tính năng miễn phí",
      "Nhận diện món ăn không giới hạn",
      "Gợi ý thực đơn & bài tập",
      "Ghi nhật ký món ăn không giới hạn",
    ],
  },
  {
    name: "Gói năm",
    price: "300.000đ",
    billing: "/12 tháng",
    features: [
      "Tất cả tính năng của gói 1 tháng",
      "Giá tiết kiệm hơn – dùng cả năm không lo",
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        id="home"
        className="relative container mx-auto px-4 py-16 md:py-20 text-center lg:text-left"
      >
        <div className="absolute top-0 -left-64 w-[1173px] h-[1214px] bg-[rgba(129,191,68,0.1)] rounded-full filter blur-3xl opacity-50"></div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          <div className="lg:order-2">
            <h1 className="font-black text-5xl md:text-6xl text-[#719B38]">
              Track your Weight, <br /> Master your Life.
            </h1>
            <p className="mt-6 text-[#426342] text-xl font-semibold max-w-xl mx-auto lg:mx-0">
              Chào mừng đến với SmartCalo – Ứng dụng theo dõi calo thông minh,
              đơn giản và hiệu quả nhất! 🍏
            </p>
            <ul className="mt-4 space-y-2 text-left max-w-xl mx-auto lg:mx-0">
              <li className="flex items-center text-[#426342] font-semibold">
                <CheckCircleOutlined className="text-green-500 mr-3" />
                Theo dõi lượng calo từ mọi bữa ăn.
              </li>
              <li className="flex items-center text-[#426342] font-semibold">
                <CheckCircleOutlined className="text-green-500 mr-3" />
                Phân tích dinh dưỡng chi tiết cho thực đơn cá nhân.
              </li>
              <li className="flex items-center text-[#426342] font-semibold">
                <CheckCircleOutlined className="text-green-500 mr-3" />
                Duy trì một lối sống lành mạnh một cách dễ dàng.
              </li>
            </ul>
            <p className="mt-4 text-[#426342] text-lg font-medium max-w-xl mx-auto lg:mx-0">
              Dù mục tiêu của bạn là giảm cân, tăng cân hay chỉ đơn giản là ăn
              uống khoa học hơn, SmartCalo sẽ là người bạn đồng hành đáng tin
              cậy của bạn.
            </p>
          </div>
          <div className="lg:order-1 flex justify-center">
            <img
              src="/images/hero-phone.png"
              alt="SmartCalo App on Phone"
              className="max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="dich-vu" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-[rgba(129,191,68,0.1)] px-4 py-2 rounded-lg mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#426342]">
              GÓI DỊCH VỤ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="border-2 border-[rgba(0,0,0,0.1)] rounded-2xl p-6 shadow-lg bg-white/20 backdrop-blur-md flex flex-col"
              >
                <h3 className="text-4xl font-semibold">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-white bg-[#719B38] px-4 py-2 rounded-xl">
                    {plan.price}
                  </span>
                  <p className="text-lg mt-2">{plan.billing}</p>
                </div>
                <ul className="text-left space-y-2 text-base flex-grow pl-4 list-disc">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="tinh-nang" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-[rgba(129,191,68,0.1)] px-4 py-2 rounded-lg mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-[#81BF44]">
              TÍNH NĂNG CHÍNH
            </h2>
          </div>
          <div className="border-b mb-12 flex justify-center">
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-8">
              {featuresData.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`py-4 px-2 text-xl font-semibold transition-colors duration-300 ${
                    activeTab === index
                      ? "text-[#719B38] border-b-4 border-[#719B38]"
                      : "text-gray-400 hover:text-[#719B38]"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-60 h-[480px] bg-[#EDEFE3] border-[8px] border-black rounded-3xl p-2 shadow-2xl">
                <img
                  src={featuresData[activeTab].image}
                  alt={featuresData[activeTab].title}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
            <div className="text-left text-lg text-gray-700">
              {featuresData[activeTab].content}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cai-dat" className="py-16 md:py-24 text-center">
        <div className="container mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-[#6D9B38]">
            Cài đặt ứng dụng
          </h2>
          <div className="mt-8">
            <a
              href="#"
              className="inline-block bg-[#426342] text-white font-bold text-2xl py-3 px-12 rounded-xl hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
              Tải xuống tại đây
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
