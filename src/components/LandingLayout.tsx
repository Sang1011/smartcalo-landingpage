import { useState, useEffect, type ReactNode, type MouseEvent } from "react";

// Header Component
const Header = () => {
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["#home", "#dich-vu", "#tinh-nang", "#cai-dat"];
      const scrollPosition = window.scrollY;
      let currentActiveLink = "";

      for (const sectionId of sections) {
        const element =
          sectionId === "#home"
            ? document.body
            : document.querySelector(sectionId);
        if (element) {
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

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
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
    "font-semibold text-[#719B38] border-b-2 border-[#719B38] pb-1";
  const inactiveClass = "font-semibold text-gray-600 hover:text-[#719B38]";

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFC] py-2 px-4 sm:px-8 md:px-16 lg:px-24 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <a href="#" onClick={(e) => handleLinkClick(e, "#")}>
            <img src="/images/logo.png" alt="SmartCalo Logo" className="h-12" />
          </a>
        </div>
        <nav className="hidden md:flex flex-grow justify-center items-center space-x-10">
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
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#F0F5ED] text-[#426342] py-4 px-4 md:px-16 lg:px-24 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center">
        <div className="mb-2 md:mb-0">
          <a
            href="mailto:smartcalo@gmail.com"
            className="font-semibold text-base hover:underline"
          >
            smartcalo@gmail.com
          </a>
        </div>
        <div className="flex space-x-5 items-center">
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

// Layout Component
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFC]">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
