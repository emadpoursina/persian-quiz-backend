import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileQuestion, Award, Activity } from "lucide-react"
import { getQuizzes, getResults} from "@/lib/storage"

export default function AdminPage() {
  const [quizzes, setQuizzes] = useState([])
  const [results, setResults] = useState([])
  const [adminUser, setAdminUser] = useState("")

  useEffect(() => {
    setQuizzes(getQuizzes())
    setResults(getResults())

    const user = localStorage.getItem("adminUser")
    if (user) {
      setAdminUser(user)
    }
  }, [])

  const activeQuizzes = quizzes.filter((q) => q.isActive).length
  const totalQuestions = quizzes.reduce((sum, q) => sum + q.questions.length, 0)
  const totalParticipants = results.length
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => {
            const quiz = quizzes.find((q) => q.id === r.quizId)
            return sum + (quiz ? (r.score / quiz.questions.length) * 100 : 0)
          }, 0) / results.length,
        )
      : 0

  const recentQuizzes = quizzes
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const recentResults = results
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="admin-content">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">داشبورد مدیریت</h1>
          <p className="text-gray-600 text-sm">خوش آمدید {adminUser}</p>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        <div className="space-y-6 sm:space-y-8">
          {/* Statistics Section */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">آمار کلی</h2>
            <div className="admin-stats-grid">
              <Card className="admin-card bg-white shadow-sm border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">کل آزمون‌ها</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-600">{quizzes.length}</p>
                    </div>
                    <FileQuestion className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white shadow-sm border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">آزمون‌های فعال</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">{activeQuizzes}</p>
                    </div>
                    <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white shadow-sm border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">کل شرکت‌کنندگان</p>
                      <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalParticipants}</p>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white shadow-sm border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">میانگین نمرات</p>
                      <p className="text-2xl sm:text-3xl font-bold text-orange-600">{averageScore}%</p>
                    </div>
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Recent Quizzes Section */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">آزمون‌های اخیر</h2>
            <Card className="admin-card bg-white shadow-sm border border-gray-200">
              <CardContent className="p-0">
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          عنوان
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاریخ ایجاد
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تعداد سوالات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentQuizzes.map((quiz) => (
                        <tr key={quiz.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 truncate">{quiz.title}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {new Date(quiz.createdAt).toLocaleDateString("fa-IR")}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                quiz.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {quiz.isActive ? "فعال" : "غیرفعال"}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm text-gray-900">{quiz.questions.length}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity Section */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">فعالیت‌های اخیر</h2>
            <Card className="admin-card bg-white shadow-sm border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-3">
                  {recentResults.map((result) => {
                    const quiz = quizzes.find((q) => q.id === result.quizId)
                    const percentage = quiz ? Math.round((result.score / quiz.questions.length) * 100) : 0

                    return (
                      <li key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.userName} در آزمون "{quiz?.title || "نامشخص"}" شرکت کرد
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(result.completedAt).toLocaleDateString("fa-IR")} - نمره: {percentage}%
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            percentage >= 80
                              ? "bg-green-100 text-green-800"
                              : percentage >= 60
                                ? "bg-blue-100 text-blue-800"
                                : percentage >= 40
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {percentage}%
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
