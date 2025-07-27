import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, BookOpen } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Accept any username and password
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUser", username);
      router.push("/admin");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            ورود به پنل مدیریت
          </CardTitle>
          <p className="text-gray-600 text-sm">
            برای دسترسی به پنل مدیریت وارد شوید
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                نام کاربری
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                  placeholder="نام کاربری خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                  placeholder="رمز عبور خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                  در حال ورود...
                </>
              ) : (
                "ورود به پنل"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-500 text-xs">
              برای تست: هر نام کاربری و رمز عبوری قابل قبول است
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
