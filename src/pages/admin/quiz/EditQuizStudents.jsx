import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight, Users, Search, Download, Eye } from "lucide-react";

export default function QuizStudentsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("adminQuizzes");
    const savedResults = localStorage.getItem("adminResults");

    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const foundQuiz = quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        navigate("/admin/quizzes");
      }
    }

    if (savedResults) {
      const allResults = JSON.parse(savedResults);
      const quizResults = allResults.filter((r) => r.quizId === quizId);
      const sortedResults = quizResults.sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      setResults(sortedResults);
    }
  }, [quizId]);

  const filteredResults = results.filter(
    (result) =>
      result.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userMobile.includes(searchTerm)
  );

  const exportResults = () => {
    if (results.length === 0) return;

    const csvContent = [
      ["ردیف", "نام", "شماره موبایل", "نمره", "درصد", "تاریخ شرکت"],
      ...results.map((result, index) => [
        index + 1,
        result.userName,
        result.userMobile,
        `${result.score}/${quiz?.questions.length || 0}`,
        `${Math.round((result.score / (quiz?.questions.length || 1)) * 100)}%`,
        new Date(result.completedAt).toLocaleDateString("fa-IR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${quiz?.title || "quiz"}-students-results.csv`
    );
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

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + (r.score / quiz.questions.length) * 100,
            0
          ) / results.length
        )
      : 0;

  const highestScore =
    results.length > 0
      ? Math.max(
          ...results.map((r) =>
            Math.round((r.score / quiz.questions.length) * 100)
          )
        )
      : 0;

  const lowestScore =
    results.length > 0
      ? Math.min(
          ...results.map((r) =>
            Math.round((r.score / quiz.questions.length) * 100)
          )
        )
      : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    شرکت‌کنندگان
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {results.length}
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
                    میانگین نمرات
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {averageScore}%
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    بالاترین نمره
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">
                    {highestScore}%
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">↑</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    پایین‌ترین نمره
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">
                    {lowestScore}%
                  </p>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">↓</span>
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
                لیست شرکت‌کنندگان ({results.length} نفر)
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
                  disabled={results.length === 0}
                  className="text-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 ml-2" />
                  خروجی CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {results.length === 0
                    ? "هنوز کسی در این آزمون شرکت نکرده"
                    : "نتیجه‌ای یافت نشد"}
                </h3>
                <p className="text-gray-600">
                  {results.length === 0
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
                        نمره نهایی
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 w-32">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredResults.map((result, index) => {
                      const percentage = Math.round(
                        (result.score / quiz.questions.length) * 100
                      );

                      return (
                        <tr
                          key={result.id}
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
                              {result.userName}
                            </div>
                          </td>

                          {/* Mobile */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="font-mono text-gray-700 text-sm sm:text-base">
                              {result.userMobile}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-gray-600 text-sm sm:text-base">
                              {new Date(result.completedAt).toLocaleDateString(
                                "fa-IR"
                              )}
                            </div>
                          </td>

                          {/* Final Score */}
                          <td className="px-3 sm:px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div
                                className={`text-lg sm:text-xl font-bold px-2 sm:px-3 py-1 rounded-lg ${getScoreColor(
                                  percentage
                                )}`}
                              >
                                {percentage}%
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {result.score}/{quiz.questions.length}
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
                                  `نتایج تفصیلی برای ${
                                    result.userName
                                  }:\n\nنمره: ${result.score}/${
                                    quiz.questions.length
                                  } (${percentage}%)\nتاریخ: ${new Date(
                                    result.completedAt
                                  ).toLocaleDateString(
                                    "fa-IR"
                                  )}\n\nجزئیات پاسخ‌ها:\n${quiz.questions
                                    .map(
                                      (q, i) =>
                                        `سوال ${i + 1}: ${
                                          result.answers[i] === q.correct
                                            ? "صحیح"
                                            : "اشتباه"
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
