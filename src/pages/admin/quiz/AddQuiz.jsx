import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight, Save, FileText } from "lucide-react";
import { addQuiz } from "@/hooks/useQuiz";
import { generateSlug } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      slug: "",
    },
  });
  const { mutateAsync, isLoading, isError, error } = addQuiz();

  const watchedTitle = watch("title");
  const watchedSlug = watch("slug");

  // Automatically generate slug when title changes
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!watchedSlug || watchedSlug === generateSlug(watchedTitle)) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  const onSubmit = async (formData) => {
    try {
      const newQuiz = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        slug: formData.slug.trim(),
      };

      const createdQuiz = await mutateAsync(newQuiz);

      setTimeout(() => {
        navigate(`/admin/quizzes/${createdQuiz._id}/questions`);
      }, 1000);
      toast.success("آزمون با موفقیت ایجاد شد.");
    } catch (error) {
      // Error is handled by the mutation
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/dashboard")}
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    عنوان آزمون *
                  </label>
                  <Input
                    type="text"
                    {...register("title", {
                      required: "عنوان آزمون الزامی است",
                      onChange: handleTitleChange,
                    })}
                    placeholder="مثال: آزمون دانش عمومی"
                    className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
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
                      {...register("slug", {
                        required: "نام مستعار الزامی است",
                        pattern: {
                          value: /^[a-z0-9-]+$/,
                          message: "فقط حروف کوچک، اعداد و خط تیره مجاز است",
                        },
                      })}
                      placeholder="quiz-name"
                      className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-r-none"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-xs text-red-500">
                      {errors.slug.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    آدرس آزمون:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      /quiz/{watchedSlug || "quiz-name"}
                    </code>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  توضیحات *
                </label>
                <Textarea
                  {...register("description", {
                    required: "توضیحات آزمون الزامی است",
                  })}
                  placeholder="توضیح مختصری درباره آزمون، موضوع و هدف آن..."
                  rows={4}
                  className="bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 w-full"
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  توضیحات آزمون که در صفحه ورود نمایش داده می‌شود
                </p>
              </div>

              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">
                    خطا در ایجاد آزمون:
                  </h4>
                  <p className="text-sm text-red-700">
                    {error?.message ||
                      "خطا در ایجاد آزمون. لطفاً دوباره تلاش کنید."}
                  </p>
                </div>
              )}

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
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  {isLoading ? (
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
                  onClick={() => navigate("/admin/dashboard")}
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
