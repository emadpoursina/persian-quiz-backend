import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "react-advance-jalaali-datepicker";
import {
  Settings,
  Save,
  Clock,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/AdminPageHeader";
import useQuiz from "@/hooks/useQuiz";
import toast from "react-hot-toast";
import moment from "moment-jalaali";

export default function QuizSettingsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const quizId = params.id;

  // Use React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      isActive: false,
      startTime: "",
      endTime: "",
    },
  });

  // Watch form values
  const watchedValues = watch();

  // Use the useQuiz hook to fetch quiz data
  const { data: quiz, isLoading, error } = useQuiz.getQuiz(quizId);

  // Use mutation hooks for updating and deleting
  const updateQuizMutation = useQuiz.updateQuiz(quizId);
  const deleteQuizMutation = useQuiz.deleteQuiz(quizId);

  // Update form fields when quiz data is loaded
  useEffect(() => {
    if (quiz) {
      setValue("title", quiz.title || "");
      setValue("description", quiz.description || "");
      setValue("slug", quiz.slug || "");
      setValue("isActive", quiz.isActive || false);
      setValue(
        "startTime",
        moment(quiz.startTime).format("jYYYY/jMM/jDD HH:mm") || ""
      );
      setValue(
        "endTime",
        moment(quiz.endTime).format("jYYYY/jMM/jDD HH:mm") || ""
      );
    }
  }, [quiz, setValue]);

  const onSubmit = async (data) => {
    if (!quiz) {
      toast.error("آزمون مورد نظر یافت نشد");
      return;
    }

    const updatedQuizData = {
      title: data.title.trim(),
      description: data.description.trim(),
      slug: data.slug.trim(),
      isActive: data.isActive,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
    };

    // Convert data on noEdit update to unix

    if (typeof data.startTime == "string") {
      data.startTime = moment(data.startTime, "jYYYY/jMM/jDD HH:mm").unix();
    }
    updatedQuizData.startTime = data.startTime;

    if (typeof data.endTime == "string") {
      data.endTime = moment(data.endTime, "jYYYY/jMM/jDD HH:mm").unix();
    }
    updatedQuizData.endTime = data.endTime;

    await updateQuizMutation.mutateAsync(updatedQuizData);
  };

  const deleteQuiz = async () => {
    if (!quiz) return;

    const confirmMessage = `آیا از حذف آزمون "${quiz.title}" اطمینان دارید؟\n\nاین عمل غیرقابل بازگشت است و تمام سوالات و نتایج آزمون حذف خواهد شد.`;

    if (confirm(confirmMessage)) {
      await deleteQuizMutation.mutateAsync();
      navigate("/admin/quizzes");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-gray-600">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
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

  return (
    <div className="p-6">
      <AdminPageHeader />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto px-4 grid gap-6"
      >
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
                  {...register("title", {
                    required: "عنوان آزمون الزامی است",
                    minLength: {
                      value: 3,
                      message: "عنوان آزمون باید حداقل ۳ کاراکتر باشد",
                    },
                  })}
                  placeholder="عنوان آزمون"
                  className={`bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 ${
                    errors.title
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
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
                    {...register("slug", {
                      required: "نام مستعار الزامی است",
                      pattern: {
                        value: /^[a-z0-9-]+$/,
                        message:
                          "نام مستعار فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد",
                      },
                      minLength: {
                        value: 3,
                        message: "نام مستعار باید حداقل ۳ کاراکتر باشد",
                      },
                    })}
                    placeholder="quiz-name"
                    className={`bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 rounded-r-none ${
                      errors.slug
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : ""
                    }`}
                    onChange={(e) => {
                      const value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "");
                      setValue("slug", value);
                    }}
                  />
                </div>
                {errors.slug && (
                  <p className="text-red-500 text-sm">{errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                توضیحات *
              </label>
              <Textarea
                {...register("description")}
                placeholder="توضیحات آزمون"
                rows={4}
                className={`bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
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
                  {watchedValues.isActive
                    ? "آزمون فعال است و کاربران می‌توانند شرکت کنند"
                    : "آزمون غیرفعال است"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={watchedValues.isActive ? "default" : "secondary"}
                >
                  {watchedValues.isActive ? "فعال" : "غیرفعال"}
                </Badge>
                <Switch
                  checked={watchedValues.isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                  style={{ direction: "ltr" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  زمان شروع (اختیاری)
                </label>
                {watchedValues.startTime && (
                  <DateTimePicker
                    placeholder="انتخاب تاریخ و ساعت"
                    format="jYYYY/jMM/jDD HH:mm"
                    id="startDateTimePicker"
                    onChange={(unix) => setValue("startTime", unix)}
                    cancelOnBackgroundClick={true}
                    preSelected={watchedValues.startTime}
                  />
                )}
                <p className="text-xs text-gray-500">
                  اگر تنظیم نشود، آزمون بلافاصله در دسترس خواهد بود
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  زمان پایان (اختیاری)
                </label>
                {watchedValues.endTime && (
                  <DateTimePicker
                    placeholder="انتخاب تاریخ و ساعت"
                    format="jYYYY/jMM/jDD HH:mm"
                    id="endDateTimePicker"
                    onChange={(unix) => setValue("endTime", unix)}
                    cancelOnBackgroundClick={true}
                    preSelected={watchedValues.endTime}
                  />
                )}
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
                  {quiz.questions?.length || 0}
                </div>
                <div className="text-sm text-blue-800">تعداد سوالات</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quiz.students?.length || 0}
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
              type="submit"
              disabled={
                updateQuizMutation.isPending ||
                !watchedValues.title?.trim() ||
                !watchedValues.description?.trim() ||
                !watchedValues.slug?.trim()
              }
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              {updateQuizMutation.isPending ? (
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
              type="button"
              variant="outline"
              onClick={() => window.open(`/quiz/${quiz.slug}`, "_blank")}
              className="text-blue-600 hover:bg-blue-50"
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              مشاهده آزمون
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={deleteQuiz}
            disabled={deleteQuizMutation.isPending}
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            {deleteQuizMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin ml-2" />
                در حال حذف...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 ml-2" />
                حذف آزمون
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
