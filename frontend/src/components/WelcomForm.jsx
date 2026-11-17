import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function WelcomeForm({
  onStart,
  quizTitle,
  quizDescription,
  quizAccessType,
  quizAllowedPhoneNumbers,
}) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && mobile.trim()) {
      // Check if quiz requires permission and if mobile number is allowed
      if (typeof window !== "undefined") {
        if (quizAccessType === "private") {
          const allowedNumbers = quizAllowedPhoneNumbers || [];
          if (!allowedNumbers.includes(mobile.trim())) {
            toast.error(
              "شما مجوز شرکت در این آزمون را ندارید. لطفاً با مدیر آزمون تماس بگیرید."
            );
            return;
          }
        }
      }

      setIsAnimating(true);
      setTimeout(() => {
        onStart(name.trim(), mobile.trim());
      }, 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] px-4">
      <Card
        className={`w-full max-w-md bg-white border-gray-200 shadow-xl transition-all duration-500 ${
          isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
        } my-4`}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <span className="text-2xl sm:text-3xl">🧠</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {quizTitle || "آزمون دانش"}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {quizDescription ||
              "برای شروع آزمون، لطفاً اطلاعات خود را وارد کنید"}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                نام و نام خانوادگی
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 hover:border-gray-400 transition-colors text-base"
                  placeholder="نام خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                شماره موبایل
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 hover:border-gray-400 transition-colors text-base"
                  placeholder="09123456789"
                  pattern="[0-9]{11}"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
              disabled={!name.trim() || !mobile.trim()}
            >
              <span className="ml-2">شروع آزمون</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
