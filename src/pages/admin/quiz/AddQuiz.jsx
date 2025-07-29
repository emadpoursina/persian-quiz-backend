import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight, Save, FileText } from "lucide-react";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !slug.trim()) return;

    setIsSubmitting(true);

    try {
      // Check if slug already exists
      const savedQuizzes = localStorage.getItem("adminQuizzes");
      const existingQuizzes = savedQuizzes ? JSON.parse(savedQuizzes) : [];

      if (existingQuizzes.some((q) => q.slug === slug)) {
        alert(
          "این نام مستعار قبلاً استفاده شده است. لطفاً نام دیگری انتخاب کنید."
        );
        setIsSubmitting(false);
        return;
      }

      const newQuiz = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        slug: slug.trim(),
        questions: [],
        isActive: false,
        createdAt: new Date().toISOString(),
      };

      const updatedQuizzes = [...existingQuizzes, newQuiz];
      localStorage.setItem("adminQuizzes", JSON.stringify(updatedQuizzes));

      // Redirect to quiz management page
      navigate(`/admin/quizzes/${newQuiz.id}/questions`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("خطا در ایجاد آزمون. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          بازگشت
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 w-full">
        <Card className="bg-white shadow-sm border border-gray-200 w-full">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              اطلاعات آزمون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    عنوان آزمون *
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="مثال: آزمون دانش عمومی"
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    عنوان آزمون که برای کاربران نمایش داده می‌شود
                  </p>
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
                      type="text"
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
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    آدرس آزمون:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      /quiz/{slug || "quiz-name"}
                    </code>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  توضیحات *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیح مختصری درباره آزمون، موضوع و هدف آن..."
                  rows={4}
                  className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 w-full"
                  required
                />
                <p className="text-xs text-gray-500">
                  توضیحات آزمون که در صفحه ورود نمایش داده می‌شود
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">مراحل بعدی:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• پس از ایجاد آزمون، سوالات خود را اضافه کنید</li>
                  <li>• زمان‌بندی آزمون را تنظیم کنید</li>
                  <li>• آزمون را فعال کنید تا کاربران بتوانند شرکت کنند</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !title.trim() ||
                    !description.trim() ||
                    !slug.trim()
                  }
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      در حال ایجاد...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 ml-2" />
                      ایجاد آزمون
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
