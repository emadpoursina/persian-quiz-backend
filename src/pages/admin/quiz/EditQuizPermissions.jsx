import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ArrowRight,
  Shield,
  Plus,
  Trash2,
  Upload,
  Download,
  Users,
  Phone,
} from "lucide-react";

export default function PermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [newNumber, setNewNumber] = useState("");
  const [bulkNumbers, setBulkNumbers] = useState("");
  const [requirePermission, setRequirePermission] = useState(false);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("adminQuizzes");
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const foundQuiz = quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setRequirePermission(foundQuiz.requirePermission || false);
      } else {
        router.push("/admin/quizzes");
      }
    }
  }, [quizId, router]);

  const saveQuiz = (updatedQuiz) => {
    const savedQuizzes = localStorage.getItem("adminQuizzes");
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const updatedQuizzes = quizzes.map((q) =>
        q.id === quizId ? updatedQuiz : q
      );
      localStorage.setItem("adminQuizzes", JSON.stringify(updatedQuizzes));
      setQuiz(updatedQuiz);
    }
  };

  const togglePermissionRequirement = () => {
    if (!quiz) return;

    const updatedQuiz = {
      ...quiz,
      requirePermission: !requirePermission,
      allowedNumbers: !requirePermission ? quiz.allowedNumbers || [] : [],
    };

    setRequirePermission(!requirePermission);
    saveQuiz(updatedQuiz);
  };

  const addNumber = () => {
    if (!quiz || !newNumber.trim()) return;

    // Validate Iranian mobile number
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(newNumber.trim())) {
      alert("لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }

    const allowedNumbers = quiz.allowedNumbers || [];
    if (allowedNumbers.includes(newNumber.trim())) {
      alert("این شماره قبلاً اضافه شده است");
      return;
    }

    const updatedQuiz = {
      ...quiz,
      allowedNumbers: [...allowedNumbers, newNumber.trim()],
    };

    saveQuiz(updatedQuiz);
    setNewNumber("");
  };

  const removeNumber = (numberToRemove) => {
    if (!quiz) return;

    const updatedQuiz = {
      ...quiz,
      allowedNumbers: (quiz.allowedNumbers || []).filter(
        (num) => num !== numberToRemove
      ),
    };

    saveQuiz(updatedQuiz);
  };

  const addBulkNumbers = () => {
    if (!quiz || !bulkNumbers.trim()) return;

    const numbers = bulkNumbers
      .split("\n")
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    const mobileRegex = /^09[0-9]{9}$/;
    const validNumbers = numbers.filter((num) => mobileRegex.test(num));
    const invalidNumbers = numbers.filter((num) => !mobileRegex.test(num));

    if (invalidNumbers.length > 0) {
      alert(
        `شماره‌های نامعتبر: ${invalidNumbers.join(
          ", "
        )}\nلطفاً فرمت صحیح را رعایت کنید (09xxxxxxxxx)`
      );
      return;
    }

    const allowedNumbers = quiz.allowedNumbers || [];
    const newNumbers = validNumbers.filter(
      (num) => !allowedNumbers.includes(num)
    );

    if (newNumbers.length === 0) {
      alert("تمام شماره‌ها قبلاً اضافه شده‌اند");
      return;
    }

    const updatedQuiz = {
      ...quiz,
      allowedNumbers: [...allowedNumbers, ...newNumbers],
    };

    saveQuiz(updatedQuiz);
    setBulkNumbers("");
    alert(`${newNumbers.length} شماره جدید اضافه شد`);
  };

  const exportNumbers = () => {
    if (!quiz || !quiz.allowedNumbers || quiz.allowedNumbers.length === 0)
      return;

    const csvContent = quiz.allowedNumbers.join("\n");
    const blob = new Blob([csvContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${quiz.title}-allowed-numbers.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!quiz) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/quizzes")}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          بازگشت به لیست آزمون‌ها
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid gap-4 sm:gap-6">
        {/* Permission Toggle */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
              <Shield className="w-5 h-5" />
              تنظیمات دسترسی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
              <div>
                <h4 className="font-medium text-gray-800">محدودیت دسترسی</h4>
                <p className="text-sm text-gray-600">
                  {requirePermission
                    ? "فقط شماره‌های مجاز می‌توانند در آزمون شرکت کنند"
                    : "همه کاربران می‌توانند در آزمون شرکت کنند"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={requirePermission ? "default" : "secondary"}>
                  {requirePermission ? "محدود" : "آزاد"}
                </Badge>
                <Button
                  onClick={togglePermissionRequirement}
                  variant={requirePermission ? "destructive" : "default"}
                  size="sm"
                >
                  {requirePermission ? "غیرفعال کردن" : "فعال کردن"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {requirePermission && (
          <>
            {/* Add Single Number */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                  <Phone className="w-5 h-5" />
                  افزودن شماره مجاز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="09123456789"
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                    maxLength={11}
                  />
                  <Button
                    onClick={addNumber}
                    disabled={!newNumber.trim()}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    افزودن
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  شماره موبایل باید با 09 شروع شده و 11 رقم باشد
                </p>
              </CardContent>
            </Card>

            {/* Bulk Add */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                  <Upload className="w-5 h-5" />
                  افزودن گروهی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={bulkNumbers}
                  onChange={(e) => setBulkNumbers(e.target.value)}
                  placeholder="هر شماره در یک خط جداگانه:&#10;09123456789&#10;09987654321&#10;09111111111"
                  rows={6}
                  className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={addBulkNumbers}
                    disabled={!bulkNumbers.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    افزودن همه
                  </Button>
                  <Button onClick={() => setBulkNumbers("")} variant="outline">
                    پاک کردن
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Allowed Numbers List */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                    <Users className="w-5 h-5" />
                    شماره‌های مجاز ({quiz.allowedNumbers?.length || 0})
                  </CardTitle>
                  <Button
                    onClick={exportNumbers}
                    variant="outline"
                    disabled={
                      !quiz.allowedNumbers || quiz.allowedNumbers.length === 0
                    }
                    className="text-green-600 hover:bg-green-50"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    خروجی
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!quiz.allowedNumbers || quiz.allowedNumbers.length === 0 ? (
                  <div className="text-center py-8">
                    <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      هنوز شماره‌ای اضافه نشده
                    </h3>
                    <p className="text-gray-600">
                      شماره‌های مجاز برای شرکت در آزمون را اضافه کنید
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {quiz.allowedNumbers.map((number, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="font-mono text-gray-800 text-sm sm:text-base">
                            {number}
                          </span>
                        </div>
                        <Button
                          onClick={() => removeNumber(number)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
