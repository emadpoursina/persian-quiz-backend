import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ArrowRight,
  Settings,
  Save,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id;

  const [quiz, setQuiz] = (useState < Quiz) | (null > null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedQuizzes = localStorage.getItem("adminQuizzes");
    if (savedQuizzes) {
      const quizzes = JSON.parse(savedQuizzes);
      const foundQuiz = quizzes.find((q) => q.id === quizId);
      if (foundQuiz) {
        setQuiz(foundQuiz);
        setTitle(foundQuiz.title);
        setDescription(foundQuiz.description);
        setSlug(foundQuiz.slug);
        setIsActive(foundQuiz.isActive);
        setStartTime(foundQuiz.startTime || "");
        setEndTime(foundQuiz.endTime || "");
      } else {
        router.push("/admin/quizzes");
      }
    }
  }, [quizId, router]);

  const saveSettings = async () => {
    if (!quiz || !title.trim() || !description.trim() || !slug.trim()) return;

    setIsSaving(true);

    try {
      const savedQuizzes = localStorage.getItem("adminQuizzes");
      if (savedQuizzes) {
        const quizzes = JSON.parse(savedQuizzes);

        // Check if slug is unique (excluding current quiz)
        const slugExists = quizzes.some(
          (q) => q.slug === slug && q.id !== quizId
        );
        if (slugExists) {
          alert(
            "این نام مستعار قبلاً استفاده شده است. لطفاً نام دیگری انتخاب کنید."
          );
          setIsSaving(false);
          return;
        }

        const updatedQuizzes = quizzes.map((q) =>
          q.id === quizId
            ? {
                ...q,
                title: title.trim(),
                description: description.trim(),
                slug: slug.trim(),
                isActive,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
              }
            : q
        );

        localStorage.setItem("adminQuizzes", JSON.stringify(updatedQuizzes));

        const updatedQuiz = updatedQuizzes.find((q) => q.id === quizId);
        setQuiz(updatedQuiz);

        alert("تنظیمات با موفقیت ذخیره شد!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("خطا در ذخیره تنظیمات. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuiz = () => {
    if (!quiz) return;

    const confirmMessage = `آیا از حذف آزمون "${quiz.title}" اطمینان دارید؟\n\nاین عمل غیرقابل بازگشت است و تمام سوالات و نتایج آزمون حذف خواهد شد.`;

    if (confirm(confirmMessage)) {
      const savedQuizzes = localStorage.getItem("adminQuizzes");
      const savedResults = localStorage.getItem("adminResults");

      if (savedQuizzes) {
        const quizzes = JSON.parse(savedQuizzes);
        const updatedQuizzes = quizzes.filter((q) => q.id !== quizId);
        localStorage.setItem("adminQuizzes", JSON.stringify(updatedQuizzes));
      }

      if (savedResults) {
        const results = JSON.parse(savedResults);
        const updatedResults = results.filter((r) => r.quizId !== quizId);
        localStorage.setItem("adminResults", JSON.stringify(updatedResults));
      }

      router.push("/admin/quizzes");
    }
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
    <AdminLayout>
      <div className="p-6">
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

        <div className="max-w-4xl mx-auto px-4 grid gap-6">
          {/* Basic Settings */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                اطلاعات اصلی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    عنوان آزمون *
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان آزمون"
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    نام مستعار (Slug) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-r-lg border border-l-0 border-gray-300">
                      /quiz/
                    </span>
                    <Input
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "")
                        )
                      }
                      placeholder="quiz-name"
                      className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-r-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  توضیحات *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات آزمون"
                  rows={4}
                  className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status & Scheduling */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                وضعیت و زمان‌بندی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">وضعیت آزمون</h4>
                  <p className="text-sm text-gray-600">
                    {isActive
                      ? "آزمون فعال است و کاربران می‌توانند شرکت کنند"
                      : "آزمون غیرفعال است"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    زمان شروع (اختیاری)
                  </label>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <p className="text-xs text-gray-500">
                    اگر تنظیم نشود، آزمون بلافاصله در دسترس خواهد بود
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    زمان پایان (اختیاری)
                  </label>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  <p className="text-xs text-gray-500">
                    اگر تنظیم نشود، آزمون همیشه در دسترس خواهد بود
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Info */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-800">اطلاعات آزمون</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {quiz.questions.length}
                  </div>
                  <div className="text-sm text-blue-800">تعداد سوالات</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      const savedResults = localStorage.getItem("adminResults");
                      if (savedResults) {
                        const results = JSON.parse(savedResults);
                        return results.filter((r) => r.quizId === quizId)
                          .length;
                      }
                      return 0;
                    })()}
                  </div>
                  <div className="text-sm text-green-800">شرکت‌کنندگان</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-purple-600">
                    {new Date(quiz.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                  <div className="text-sm text-purple-800">تاریخ ایجاد</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-orange-600 break-all">
                    /quiz/{quiz.slug}
                  </div>
                  <div className="text-sm text-orange-800">آدرس آزمون</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <Button
                onClick={saveSettings}
                disabled={
                  isSaving ||
                  !title.trim() ||
                  !description.trim() ||
                  !slug.trim()
                }
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    ذخیره تنظیمات
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open(`/quiz/${quiz.slug}`, "_blank")}
                className="text-blue-600 hover:bg-blue-50"
              >
                <ExternalLink className="w-4 h-4 ml-2" />
                مشاهده آزمون
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={deleteQuiz}
              className="text-red-600 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف آزمون
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
