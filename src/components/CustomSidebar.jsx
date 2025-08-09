import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  LogOut,
  BookOpen,
  X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

const menuItems = [
  {
    title: "داشبورد",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "آزمون‌ها",
    url: "/admin/quizzes",
    icon: FileText,
  },
  {
    title: "ایجاد آزمون",
    url: "/admin/quizzes/add",
    icon: Plus,
  },
];

export default function CustomSidebar({ isOpen, onClose }) {
  const pathname = useLocation().pathname;
  const { logOut } = useAuth();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await logOut();
  };

  const adminUser = currentUser?.name || null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed top-0 right-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-30">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">پنل مدیریت</h2>
              <p className="text-sm text-gray-600">
                {adminUser ? `خوش آمدید ${adminUser}` : "آزمون‌های آنلاین"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              مدیریت اصلی
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">پنل مدیریت</h2>
              <p className="text-sm text-gray-600">{adminUser || "آزمون‌ها"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              مدیریت اصلی
            </h3>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </div>
    </>
  );
}
