import { useState, useEffect, type ReactNode, type MouseEvent } from "react";

// Header Component
const Header = () => {
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["#home", "#dich-vu", "#tinh-nang", "#cai-dat"];
      const scrollPosition = window.scrollY;
      let currentActiveLink = "";

      // Xử lý logic active link khi cuộn
      for (const sectionId of sections) {
        const element =
          sectionId === "#home"
            ? document.body
            : document.querySelector(sectionId);
        if (element) {
          // Điều chỉnh offsetTop cho phù hợp với cách bạn xác định elementTop cho body
          const elementTop = (element as HTMLElement).offsetTop;
          const elementHeight = (element as HTMLElement).offsetHeight;
          if (
            scrollPosition >= elementTop - 150 &&
            scrollPosition < elementTop + elementHeight - 150
          ) {
            currentActiveLink = sectionId;
          }
        }
      }

      // Logic cho phần tử cuối cùng khi cuộn đến cuối trang
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
        currentActiveLink = "#cai-dat";
      }

      if (currentActiveLink) {
        setActiveLink(currentActiveLink);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (targetId === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const activeClass =
    "font-semibold text-black border-b-2 border-black pb-1 !text-black";
  const inactiveClass =
    "font-semibold text-gray-700 hover:text-black transition-colors"; // Đã điều chỉnh một chút để hover đẹp hơn

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFC] py-3 px-4 sm:px-8 md:px-16 lg:px-24 border-b border-gray-200 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <a href="#" onClick={(e) => handleLinkClick(e, "#")}>
            <img src="/images/logo.png" alt="SmartCalo Logo" className="h-12" />
          </a>
        </div>
        
        {/* Thanh điều hướng và Nút Tải xuống */}
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex justify-center items-center space-x-8">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, "#home")}
              className={activeLink === "#home" ? activeClass : inactiveClass}
            >
              Trang chủ
            </a>
            <a
              href="#dich-vu"
              onClick={(e) => handleLinkClick(e, "#dich-vu")}
              className={activeLink === "#dich-vu" ? activeClass : inactiveClass}
            >
              Dịch vụ
            </a>
            <a
              href="#tinh-nang"
              onClick={(e) => handleLinkClick(e, "#tinh-nang")}
              className={
                activeLink === "#tinh-nang" ? activeClass : inactiveClass
              }
            >
              Tính năng
            </a>
            <a
              href="#cai-dat"
              onClick={(e) => handleLinkClick(e, "#cai-dat")}
              className={activeLink === "#cai-dat" ? activeClass : inactiveClass}
            >
              Cài đặt
            </a>
          </nav>
          
          {/* Nút Tải ứng dụng (Download Button) */}
          <a
            href="https://github.com/Sang1011/smartcalo-landingpage/releases/download/app-latest/SmartCalo.apk" // Đường dẫn tới file APK trong thư mục public
            download // Thuộc tính 'download' để trình duyệt tải file về
            className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#426342] hover:bg-[#5a865a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#426342]"
          >
            {/* Thêm icon Android hoặc Download nếu có */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
              <path d="M10 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1z" />
            </svg>
            Tải ứng dụng Android (.apk)
          </a>
        </div>
      </div>
    </header>
  );
};

// Footer Component (Giữ nguyên)
const Footer = () => {
  return (
    <footer className="bg-[#F0F5ED] text-[#426342] py-4 px-4 md:px-16 lg:px-24 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center">
        <div className="mb-2 md:mb-0 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 items-center">
          {/* Liên kết Email hiện tại */}
          <a
            href="mailto:smartcalo@gmail.com"
            className="font-semibold text-black !text-black hover:underline"
          >
            smartcalo@gmail.com
          </a>

          <a
            href="/privacy"
            className="font-semibold text-black !text-black hover:underline"
          >
            Chính sách Quyền riêng tư
          </a>
        </div>
        
        <div className="flex space-x-5 items-center">
          {/* Icon Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61580442638353"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="h-6 w-6" />
          </a>
          
          <a
            href="https://www.instagram.com/smartcalo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/icons/instagram.svg"
              alt="Instagram"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

// Layout Component (Giữ nguyên)
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFC]">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}