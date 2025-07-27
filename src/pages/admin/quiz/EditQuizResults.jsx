import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Download,
} from "lucide-react";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;

  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("adminQuizzes");
    const savedResults = localStorage.getItem("adminResults");

    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const foundQuiz = quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
      } else {
        router.push("/admin/quizzes");
      }
    }

    if (savedResults) {
      const allResults = JSON.parse(savedResults);
      const quizResults = allResults.filter((r) => r.quizId === quizId);
      setResults(quizResults);
    }
  }, [quizId, router]);

  if (!quiz) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const totalParticipants = results.length;
  const averageScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length
      : 0;
  const averagePercentage = Math.round(
    (averageScore / quiz.questions.length) * 100
  );

  const scoreDistribution = {
    excellent: results.filter(
      (r) => (r.score / quiz.questions.length) * 100 >= 80
    ).length,
    good: results.filter((r) => {
      const percentage = (r.score / quiz.questions.length) * 100;
      return percentage >= 60 && percentage < 80;
    }).length,
    average: results.filter((r) => {
      const percentage = (r.score / quiz.questions.length) * 100;
      return percentage >= 40 && percentage < 60;
    }).length,
    poor: results.filter((r) => (r.score / quiz.questions.length) * 100 < 40)
      .length,
  };

  const questionAnalysis = quiz.questions.map((question, index) => {
    const correctAnswers = results.filter(
      (r) => r.answers[index] === question.correct
    ).length;
    const incorrectAnswers = totalParticipants - correctAnswers;
    const successRate =
      totalParticipants > 0
        ? Math.round((correctAnswers / totalParticipants) * 100)
        : 0;

    return {
      questionNumber: index + 1,
      question: question.question,
      correctAnswers,
      incorrectAnswers,
      successRate,
    };
  });

  const exportDetailedResults = () => {
    if (results.length === 0) return;

    const csvContent = [
      [
        "نام",
        "شماره موبایل",
        "نمره کل",
        "درصد",
        "تاریخ شرکت",
        ...quiz.questions.map((_, i) => `سوال ${i + 1}`),
      ],
      ...results.map((result) => [
        result.userName,
        result.userMobile,
        `${result.score}/${quiz.questions.length}`,
        `${Math.round((result.score / quiz.questions.length) * 100)}%`,
        new Date(result.completedAt).toLocaleDateString("fa-IR"),
        ...result.answers.map((answer, i) =>
          answer === quiz.questions[i]?.correct ? "صحیح" : "اشتباه"
        ),
      ]),
    ]
      .map((row) => row.join(","))
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
          onClick={() => router.push("/admin/quizzes")}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          بازگشت به لیست آزمون‌ها
        </Button>
        <Button
          onClick={exportDetailedResults}
          variant="outline"
          disabled={results.length === 0}
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
                    {totalParticipants}
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
                    {averagePercentage}%
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
                    {results.length > 0
                      ? Math.max(
                          ...results.map((r) =>
                            Math.round((r.score / quiz.questions.length) * 100)
                          )
                        )
                      : 0}
                    %
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
                    {quiz.questions.length}
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
            {totalParticipants === 0 ? (
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
                    {Math.round(
                      (scoreDistribution.excellent / totalParticipants) * 100
                    )}
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
                    {Math.round(
                      (scoreDistribution.good / totalParticipants) * 100
                    )}
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
                    {Math.round(
                      (scoreDistribution.average / totalParticipants) * 100
                    )}
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
                    {Math.round(
                      (scoreDistribution.poor / totalParticipants) * 100
                    )}
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
            {totalParticipants === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  پس از شرکت کاربران، تحلیل سوالات در اینجا نمایش داده می‌شود
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questionAnalysis.map((analysis) => (
                  <div
                    key={analysis.questionNumber}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                        سوال {analysis.questionNumber}:{" "}
                        {analysis.question.substring(0, 60)}
                        {analysis.question.length > 60 && "..."}
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
                          {totalParticipants}
                        </div>
                        <div className="text-gray-800">کل شرکت‌کنندگان</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
