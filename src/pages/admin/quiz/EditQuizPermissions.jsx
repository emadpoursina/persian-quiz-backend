import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import useQuiz from "@/hooks/useQuiz";
import toast from "react-hot-toast";

export default function PermissionsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const quizId = params.id;

  const [newNumber, setNewNumber] = useState("");
  const [bulkNumbers, setBulkNumbers] = useState("");

  // Use React Query hooks
  const { data: quiz, isLoading, error } = useQuiz.getQuiz(quizId);
  const updateQuizMutation = useQuiz.updateQuiz(quizId);

  // Derived state for access type
  const accessType = quiz?.accessType || "public";
  const allowedPhoneNumbers = quiz?.allowedPhoneNumbers || [];

  const isPrivate = accessType === "private";

  const handleUpdateQuiz = (updatedData) => {
    updateQuizMutation.mutate(updatedData, {
      onSuccess: () => {
        toast.success("تنظیمات دسترسی با موفقیت بروزرسانی شد");
      },
      onError: (error) => {
        toast.error("خطا در بروزرسانی تنظیمات دسترسی");
        console.error("Error updating quiz permissions:", error);
      },
    });
  };

  const toggleAccessType = () => {
    if (!quiz) return;

    const newAccessType = accessType === "public" ? "private" : "public";
    const updatedQuiz = {
      ...quiz,
      accessType: newAccessType,
    };

    handleUpdateQuiz(updatedQuiz);
  };

  const addNumber = () => {
    if (!quiz || !newNumber.trim()) return;

    // Validate Iranian mobile number
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(newNumber.trim())) {
      toast.error("لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }

    if (allowedPhoneNumbers.includes(newNumber.trim())) {
      toast.error("این شماره قبلاً اضافه شده است");
      return;
    }

    const updatedQuiz = {
      ...quiz,
      allowedPhoneNumbers: [...allowedPhoneNumbers, newNumber.trim()],
    };

    handleUpdateQuiz(updatedQuiz);
    setNewNumber("");
  };

  const removeNumber = (numberToRemove) => {
    if (!quiz) return;

    const updatedQuiz = {
      ...quiz,
      allowedPhoneNumbers: allowedPhoneNumbers.filter(
        (num) => num !== numberToRemove
      ),
    };

    handleUpdateQuiz(updatedQuiz);
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
      toast.error(
        `شماره‌های نامعتبر: ${invalidNumbers.join(
          ", "
        )}\nلطفاً فرمت صحیح را رعایت کنید (09xxxxxxxxx)`
      );
      return;
    }

    const newNumbers = validNumbers.filter(
      (num) => !allowedPhoneNumbers.includes(num)
    );

    if (newNumbers.length === 0) {
      toast.error("تمام شماره‌ها قبلاً اضافه شده‌اند");
      return;
    }

    const updatedQuiz = {
      ...quiz,
      allowedPhoneNumbers: [...allowedPhoneNumbers, ...newNumbers],
    };

    handleUpdateQuiz(updatedQuiz);
    setBulkNumbers("");
    toast.success(`${newNumbers.length} شماره جدید اضافه شد`);
  };

  const exportNumbers = () => {
    if (!allowedPhoneNumbers || allowedPhoneNumbers.length === 0) return;

    const csvContent = allowedPhoneNumbers.join("\n");
    const blob = new Blob([csvContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${quiz?.title || "quiz"}-allowed-numbers.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-500">خطا در بارگذاری آزمون</p>
          <Button onClick={() => navigate("/admin/quizzes")} className="mt-4">
            بازگشت به لیست آزمون‌ها
          </Button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">آزمون یافت نشد</p>
          <Button onClick={() => navigate("/admin/quizzes")} className="mt-4">
            بازگشت به لیست آزمون‌ها
          </Button>
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
          onClick={() => navigate("/admin/quizzes")}
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
                  {isPrivate
                    ? "فقط شماره‌های مجاز می‌توانند در آزمون شرکت کنند"
                    : "همه کاربران می‌توانند در آزمون شرکت کنند"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={isPrivate ? "default" : "secondary"}>
                  {isPrivate ? "محدود" : "آزاد"}
                </Badge>
                <Button
                  onClick={toggleAccessType}
                  variant={isPrivate ? "destructive" : "default"}
                  size="sm"
                  disabled={updateQuizMutation.isPending}
                >
                  {updateQuizMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPrivate ? (
                    "غیرفعال کردن"
                  ) : (
                    "فعال کردن"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isPrivate && (
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
                    disabled={updateQuizMutation.isPending}
                  />
                  <Button
                    onClick={addNumber}
                    disabled={!newNumber.trim() || updateQuizMutation.isPending}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {updateQuizMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 ml-2" />
                    )}
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
                  disabled={updateQuizMutation.isPending}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={addBulkNumbers}
                    disabled={
                      !bulkNumbers.trim() || updateQuizMutation.isPending
                    }
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {updateQuizMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 ml-2" />
                    )}
                    افزودن همه
                  </Button>
                  <Button
                    onClick={() => setBulkNumbers("")}
                    variant="outline"
                    disabled={updateQuizMutation.isPending}
                  >
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
                    شماره‌های مجاز ({allowedPhoneNumbers.length})
                  </CardTitle>
                  <Button
                    onClick={exportNumbers}
                    variant="outline"
                    disabled={
                      !allowedPhoneNumbers || allowedPhoneNumbers.length === 0
                    }
                    className="text-green-600 hover:bg-green-50"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    خروجی
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!allowedPhoneNumbers || allowedPhoneNumbers.length === 0 ? (
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
                    {allowedPhoneNumbers.map((number, index) => (
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
                          disabled={updateQuizMutation.isPending}
                        >
                          {updateQuizMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
