import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Users,
  FileQuestion,
  BarChart3,
  Settings,
  ExternalLink,
  Shield,
} from "lucide-react";
import { getQuizzes, getResults, deleteQuiz, updateQuiz } from "@/lib/storage";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [userResults, setUserResults] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setQuizzes(getQuizzes());
    setUserResults(getResults());
  };

  const handleDeleteQuiz = (quizId) => {
    if (confirm("آیا از حذف این آزمون اطمینان دارید؟")) {
      deleteQuiz(quizId);
      loadData();
    }
  };

  const toggleQuizStatus = (quizId) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      const updatedQuiz = { ...quiz, isActive: !quiz.isActive };
      updateQuiz(updatedQuiz);
      loadData();
    }
  };

  const getQuizResults = (quizId) => {
    return userResults.filter((r) => r.quizId === quizId);
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="admin-content">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              مدیریت آزمون‌ها
            </h1>
            <Link to="/admin/quizzes/create">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 w-full sm:w-auto">
                <Plus className="w-4 h-4 ml-2" />
                آزمون جدید
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="admin-grid">
          {quizzes.length === 0 ? (
            <div className="admin-card">
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-8 text-center">
                  <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    هنوز آزمونی ایجاد نشده
                  </h3>
                  <p className="text-gray-600 mb-4">
                    برای شروع، اولین آزمون خود را ایجاد کنید
                  </p>
                  <Link href="/admin/quizzes/create">
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                      <Plus className="w-4 h-4 ml-2" />
                      ایجاد آزمون جدید
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            quizzes.map((quiz) => {
              const results = getQuizResults(quiz.id);
              const averageScore =
                results.length > 0
                  ? Math.round(
                      results.reduce(
                        (sum, r) =>
                          sum + (r.score / quiz.questions.length) * 100,
                        0
                      ) / results.length
                    )
                  : 0;

              return (
                <Card
                  key={quiz.id}
                  className="admin-card bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <CardTitle className="text-base sm:text-lg text-gray-800 truncate">
                            {quiz.title}
                          </CardTitle>
                          <Badge
                            variant={quiz.isActive ? "default" : "secondary"}
                            className="text-xs w-fit"
                          >
                            {quiz.isActive ? "فعال" : "غیرفعال"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {quiz.description}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {quiz.questions.length}
                            </div>
                            <div className="text-xs text-blue-800">سوال</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-green-600">
                              {results.length}
                            </div>
                            <div className="text-xs text-green-800">
                              شرکت‌کننده
                            </div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {averageScore}%
                            </div>
                            <div className="text-xs text-purple-800">
                              میانگین
                            </div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2 text-center">
                            <div className="text-xs font-mono text-orange-600 truncate">
                              /{quiz.slug}
                            </div>
                            <div className="text-xs text-orange-800">آدرس</div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col gap-1 ml-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleQuizStatus(quiz.id)}
                          className={`w-8 h-8 p-0 ${
                            quiz.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {quiz.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="w-8 h-8 p-0 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      <Link
                        href={`/admin/quizzes/${quiz.id}/questions`}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          <FileQuestion className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">سوالات</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/quizzes/${quiz.id}/students`}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-green-600 hover:bg-green-50 bg-transparent"
                        >
                          <Users className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">شرکت‌کنندگان</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/quizzes/${quiz.id}/results`}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-purple-600 hover:bg-purple-50 bg-transparent"
                        >
                          <BarChart3 className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">نتایج</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/quizzes/${quiz.id}/settings`}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                          <Settings className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">تنظیمات</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/quiz/${quiz.slug}`}
                        target="_blank"
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-indigo-600 hover:bg-indigo-50 bg-transparent"
                        >
                          <ExternalLink className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">مشاهده</span>
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/quizzes/${quiz.id}/permissions`}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs text-orange-600 hover:bg-orange-50 bg-transparent"
                        >
                          <Shield className="w-3 h-3 ml-1" />
                          <span className="hidden sm:inline">مجوزها</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
