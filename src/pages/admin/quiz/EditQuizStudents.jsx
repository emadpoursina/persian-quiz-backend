import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight, Users, Search, Download, Eye } from "lucide-react";
import useQuiz from "@/hooks/useQuiz";

export default function QuizStudentsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const quizId = params.id;

  const [searchTerm, setSearchTerm] = useState("");

  // Use the useQuiz hook to get students data
  const { data: students, isLoading, error } = useQuiz.getQuizStudents(quizId);

  // Filter students based on search term
  const filteredStudents =
    students?.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phoneNumber.includes(searchTerm)
    ) || [];

  const exportResults = () => {
    if (!students || students.length === 0) return;

    const csvContent = [
      ["ردیف", "نام", "شماره موبایل", "تاریخ شرکت", "تعداد پاسخ‌ها"],
      ...students.map((student, index) => [
        index + 1,
        student.fullName,
        student.phoneNumber,
        new Date(student.participateDate).toLocaleDateString("fa-IR"),
        student.answers.length,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `quiz-${quizId}-students.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-500">خطا در بارگذاری اطلاعات دانش‌آموزان</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  const totalStudents = students?.length || 0;
  const averageAnswers =
    students?.length > 0
      ? Math.round(
          students.reduce((sum, student) => sum + student.answers.length, 0) /
            students.length
        )
      : 0;

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

      <div className="grid gap-4 sm:gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    شرکت‌کنندگان
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {totalStudents}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    میانگین پاسخ‌ها
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {averageAnswers}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">?</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    آزمون ID
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {quizId}
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">#</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-5 h-5" />
                لیست شرکت‌کنندگان ({totalStudents} نفر)
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در نام یا شماره موبایل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-full sm:w-64 text-base"
                  />
                </div>
                <Button
                  onClick={exportResults}
                  variant="outline"
                  disabled={!students || students.length === 0}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 ml-2" />
                  خروجی CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {totalStudents === 0
                    ? "هنوز کسی در این آزمون شرکت نکرده"
                    : "نتیجه‌ای یافت نشد"}
                </h3>
                <p className="text-gray-600">
                  {totalStudents === 0
                    ? "پس از شرکت کاربران در آزمون، اطلاعات آن‌ها در اینجا نمایش داده می‌شود"
                    : "لطفاً عبارت جستجوی دیگری امتحان کنید"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">
                        ردیف
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">
                        نام
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">
                        شماره موبایل
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">
                        تاریخ شرکت
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-700">
                        تعداد پاسخ‌ها
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 w-32">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student, index) => {
                      const correctAnswers = student.answers.filter(
                        (answer) => answer === true
                      ).length;
                      const totalAnswers = student.answers.length;
                      const percentage =
                        totalAnswers > 0
                          ? Math.round((correctAnswers / totalAnswers) * 100)
                          : 0;

                      return (
                        <tr
                          key={student._id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Row Number */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Name */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="font-medium text-gray-900 text-sm sm:text-base">
                              {student.fullName}
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="font-mono text-gray-700 text-sm sm:text-base">
                              {student.phoneNumber}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-gray-600 text-sm sm:text-base">
                              {new Date(
                                student.participateDate
                              ).toLocaleDateString("fa-IR")}
                            </div>
                          </td>

                          {/* Answers Count */}
                          <td className="px-3 sm:px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-lg sm:text-xl font-bold text-blue-600">
                                {totalAnswers}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {correctAnswers} صحیح
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-3 sm:px-6 py-4 text-center">
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm"
                              onClick={() => {
                                // Show detailed results in a modal or navigate to a detailed view
                                alert(
                                  `نتایج تفصیلی برای ${student.fullName}:\n\n` +
                                    `تعداد پاسخ‌ها: ${totalAnswers}\n` +
                                    `پاسخ‌های صحیح: ${correctAnswers}\n` +
                                    `درصد موفقیت: ${percentage}%\n` +
                                    `تاریخ شرکت: ${new Date(
                                      student.participateDate
                                    ).toLocaleDateString("fa-IR")}\n\n` +
                                    `جزئیات پاسخ‌ها:\n${student.answers
                                      .map(
                                        (answer, i) =>
                                          `سوال ${i + 1}: ${
                                            answer ? "صحیح" : "اشتباه"
                                          }`
                                      )
                                      .join("\n")}`
                                );
                              }}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                              جزئیات
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
