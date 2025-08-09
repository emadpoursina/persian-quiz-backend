import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
} from "lucide-react";
import useQuiz from "@/hooks/useQuiz";

export default function QuizResultsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const quizId = params.id;

  // Use the useQuiz hook to fetch quiz data from server
  const {
    data: quiz,
    isLoading: quizLoading,
    error: quizError,
  } = useQuiz.getQuiz(quizId);

  // Show loading state
  if (quizLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (quizError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-500">خطا در بارگذاری داده‌ها</p>
          <Button onClick={() => navigate("/admin/quizzes")} className="mt-4">
            بازگشت به لیست آزمون‌ها
          </Button>
        </div>
      </div>
    );
  }

  // If quiz doesn't exist, redirect
  if (!quiz) {
    navigate("/admin/quizzes");
    return null;
  }

  // Generate statistics from quiz data
  const { students, questions } = quiz;
  const totalStudents = students?.length || 0;
  const totalQuestions = questions?.length || 0;

  // Calculate average score if there are students
  const averageAnswers =
    students?.length > 0
      ? Math.round(
          students.reduce((sum, student) => {
            const total = student.answers.length;
            const correct = student.answers.filter(Boolean).length;
            const score = total > 0 ? (correct / total) * 100 : 0;
            return sum + score;
          }, 0) / students.length
        )
      : 0;
  const highestScore =
    students?.length > 0
      ? Math.max(
          ...students.map((student) => {
            return student.answers?.filter(Boolean).length || 0;
          })
        )
      : 0;

  // Calculate score distribution based on answers array
  const scoreDistribution = {
    excellent:
      students?.filter((student) => {
        const correctAnswers = student.answers?.filter(Boolean).length || 0;
        const percentage =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        return percentage >= 80;
      }).length || 0,
    good:
      students?.filter((student) => {
        const correctAnswers = student.answers?.filter(Boolean).length || 0;
        const percentage =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        return percentage >= 60 && percentage < 80;
      }).length || 0,
    average:
      students?.filter((student) => {
        const correctAnswers = student.answers?.filter(Boolean).length || 0;
        const percentage =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        return percentage >= 40 && percentage < 60;
      }).length || 0,
    poor:
      students?.filter((student) => {
        const correctAnswers = student.answers?.filter(Boolean).length || 0;
        const percentage =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
        return percentage < 40;
      }).length || 0,
  };

  // Generate question analysis
  const questionAnalysis =
    questions?.map((question, index) => {
      const correctAnswers =
        students?.filter(
          (student) => student.answers && student.answers[index] === true
        ).length || 0;
      const incorrectAnswers = totalStudents - correctAnswers;
      const successRate =
        totalStudents > 0
          ? Math.round((correctAnswers / totalStudents) * 100)
          : 0;

      return {
        questionNumber: index + 1,
        question: question.questionText,
        correctAnswers,
        incorrectAnswers,
        successRate,
      };
    }) || [];

  const exportDetailedResults = () => {
    if (!students || students.length === 0) {
      toast("دانش آموزی برای گرفتن خروجی وجود ندارد.", { icon: "⚠️" });
      return;
    }

    // Add BOM and UTF-8 encoding to support Persian characters
    const BOM = "\uFEFF";
    const csvRows = [
      [
        "نام",
        "شماره موبایل",
        "نمره کل",
        "درصد",
        "تاریخ شرکت",
        ...(questions?.map((_, i) => `سوال ${i + 1}`) || []),
      ],
      ...students.map((student) => {
        const correctAnswers = student.answers?.filter(Boolean).length || 0;
        return [
          student.userName || student.name,
          student.userMobile || student.mobile,
          `${correctAnswers}/${totalQuestions}`,
          `${Math.round((correctAnswers / totalQuestions) * 100)}%`,
          new Date(student.completedAt || Date.now()).toLocaleDateString(
            "fa-IR"
          ),
          ...(student.answers?.map((answer) =>
            answer === true ? "صحیح" : "اشتباه"
          ) || []),
        ];
      }),
    ];

    // Escape double quotes and commas in fields
    const escapeCsvField = (field) => {
      if (typeof field === "string" && (field.includes(",") || field.includes('"') || field.includes("\n"))) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };

    const csvContent =
      BOM +
      csvRows
        .map((row) => row.map(escapeCsvField).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${quiz.title}-detailed-results.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/quizzes")}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          بازگشت به لیست آزمون‌ها
        </Button>
        <Button
          onClick={exportDetailedResults}
          variant="outline"
          disabled={students?.length === 0}
          className="text-green-600 hover:bg-green-50"
        >
          <Download className="w-4 h-4 ml-2" />
          خروجی تفصیلی
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    کل شرکت‌کنندگان
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {totalStudents}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    میانگین نمرات
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {averageAnswers}%
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    بالاترین نمره
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                    {highestScore}
                  </p>
                </div>
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    تعداد سوالات
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    {totalQuestions || 0}
                  </p>
                </div>
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Distribution */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="w-5 h-5" />
              توزیع نمرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalStudents === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  هنوز کسی در آزمون شرکت نکرده است
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {scoreDistribution.excellent}
                  </div>
                  <div className="text-xs sm:text-sm text-green-800">
                    عالی (80-100%)
                  </div>
                  <div className="text-xs text-green-600">
                    {totalStudents > 0
                      ? Math.round(
                          (scoreDistribution.excellent / totalStudents) * 100
                        )
                      : 0}
                    % از کل
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {scoreDistribution.good}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-800">
                    خوب (60-79%)
                  </div>
                  <div className="text-xs text-blue-600">
                    {totalStudents > 0
                      ? Math.round(
                          (scoreDistribution.good / totalStudents) * 100
                        )
                      : 0}
                    % از کل
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {scoreDistribution.average}
                  </div>
                  <div className="text-xs sm:text-sm text-orange-800">
                    متوسط (40-59%)
                  </div>
                  <div className="text-xs text-orange-600">
                    {totalStudents > 0
                      ? Math.round(
                          (scoreDistribution.average / totalStudents) * 100
                        )
                      : 0}
                    % از کل
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {scoreDistribution.poor}
                  </div>
                  <div className="text-xs sm:text-sm text-red-800">
                    ضعیف (زیر 40%)
                  </div>
                  <div className="text-xs text-red-600">
                    {totalStudents > 0
                      ? Math.round(
                          (scoreDistribution.poor / totalStudents) * 100
                        )
                      : 0}
                    % از کل
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Analysis */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2 text-base sm:text-lg">
              <Target className="w-5 h-5" />
              تحلیل سوالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalStudents === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  پس از شرکت کاربران، تحلیل سوالات در اینجا نمایش داده می‌شود
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questionAnalysis.length > 0 ? (
                  questionAnalysis.map((analysis) => (
                    <div
                      key={analysis.questionNumber}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base flex flex-wrap items-center gap-1">
                          <span>سوال {analysis.questionNumber}:</span>
                          <span
                            className="inline"
                            dangerouslySetInnerHTML={{
                              __html:
                                analysis.question.length > 60
                                  ? analysis.question.substring(0, 60) + "..."
                                  : analysis.question,
                            }}
                          />
                        </h4>
                        <div
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            analysis.successRate >= 80
                              ? "bg-green-100 text-green-800"
                              : analysis.successRate >= 60
                              ? "bg-blue-100 text-blue-800"
                              : analysis.successRate >= 40
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {analysis.successRate}% موفقیت
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                          <div className="text-lg font-bold text-green-600">
                            {analysis.correctAnswers}
                          </div>
                          <div className="text-green-800">پاسخ صحیح</div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
                          <div className="text-lg font-bold text-red-600">
                            {analysis.incorrectAnswers}
                          </div>
                          <div className="text-red-800">پاسخ اشتباه</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
                          <div className="text-lg font-bold text-gray-600">
                            {totalStudents}
                          </div>
                          <div className="text-gray-800">کل شرکت‌کنندگان</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      هیچ سوالی برای این آزمون یافت نشد
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
