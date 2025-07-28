import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomSidebar from "@/components/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("adminLoggedIn");

      if (!loggedIn && pathname !== "/admin/login") {
        navigate("/admin/login");
        return;
      }

      if (loggedIn && pathname === "/admin/login") {
        navigate("/admin");
        return;
      }

      setIsLoggedIn(!!loggedIn);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, pathname]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // If on login page, render without sidebar
  if (pathname === "/admin/login") {
    return <div dir="rtl">{children}</div>;
  }

  // If not logged in and not on login page, don't render anything (redirect will happen)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div
        dir="rtl"
        className="admin-layout bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      >
        {/* Main Content Area */}
        <main className="admin-main-content">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between w-full">
            <h1 className="text-lg font-semibold text-gray-800">
              داشبورد مدیریت
            </h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Page Content */}
          <div className="admin-page flex-1">{children}</div>
        </main>

        {/* Custom Sidebar */}
        <CustomSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
