import {
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileQuestion,
  ImageIcon,
  Video,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import TinyMCEEditor from "@/components/TinymceEditor";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useQuiz from "@/hooks/useQuiz";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const { id: quizId } = useParams();

  const [isAdding, setIsAdding] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Use the useQuiz hook to fetch quiz data
  const { data: quiz, isLoading, error } = useQuiz.getQuiz(quizId);

  const saveQuiz = (updatedQuiz) => {
    console.log("Saving quiz data:", updatedQuiz);
    // In demo state - just log the data
  };

  const addQuestion = (question, options, correct, media) => {
    if (!quiz) return;

    const newQuestion = {
      id: Date.now().toString(),
      question,
      options,
      correct,
      media,
    };

    const updatedQuiz = {
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    };

    console.log("Adding question:", newQuestion);
    console.log("Updated quiz:", updatedQuiz);
    setIsAdding(false);
  };

  const updateQuestion = (questionId, question, options, correct, media) => {
    if (!quiz) return;

    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) =>
        q.id === questionId ? { ...q, question, options, correct, media } : q
      ),
    };

    console.log("Updating question:", {
      questionId,
      question,
      options,
      correct,
      media,
    });
    console.log("Updated quiz:", updatedQuiz);
    setEditingQuestion(null);
  };

  const deleteQuestion = (questionId) => {
    if (!quiz) return;
    if (!confirm("آیا از حذف این سوال اطمینان دارید؟")) return;

    const updatedQuiz = {
      ...quiz,
      questions: quiz.questions.filter((q) => q.id !== questionId),
    };

    console.log("Deleting question:", questionId);
    console.log("Updated quiz:", updatedQuiz);
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
          <p className="text-red-500">خطا در بارگذاری آزمون: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">آزمون یافت نشد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
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

      <div className="grid gap-6">
        {/* Quiz Info */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                اطلاعات آزمون
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={quiz.isActive ? "default" : "secondary"}>
                  {quiz.isActive ? "فعال" : "غیرفعال"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {quiz.questions.length} سوال
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">عنوان</p>
                <p className="font-medium">{quiz.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">لینک آزمون</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  /quiz/{quiz.slug}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Question */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-800">سوالات آزمون</CardTitle>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4 ml-2" />
              افزودن سوال
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAdding && (
              <QuestionForm
                onSubmit={addQuestion}
                onCancel={() => setIsAdding(false)}
              />
            )}

            {editingQuestion && (
              <QuestionForm
                question={editingQuestion}
                onSubmit={(q, o, c, m) =>
                  updateQuestion(editingQuestion.id, q, o, c, m)
                }
                onCancel={() => setEditingQuestion(null)}
              />
            )}

            {quiz.questions.length === 0 ? (
              <div className="text-center py-12">
                <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  هنوز سوالی اضافه نشده
                </h3>
                <p className="text-gray-600 mb-4">
                  برای شروع، اولین سوال خود را اضافه کنید
                </p>
                <Button
                  onClick={() => setIsAdding(true)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن سوال
                </Button>
              </div>
            ) : (
              quiz.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">
                        <span className="ml-2">{index + 1}.</span>
                        <div
                          className="inline"
                          dangerouslySetInnerHTML={{
                            __html: question.question,
                          }}
                        />
                      </h4>

                      {/* Media Preview */}
                      {question.media && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                          {question.media.type === "image" ? (
                            <div className="flex items-center gap-3">
                              <ImageIcon className="w-5 h-5 text-blue-600" />
                              <img
                                src={question.media.url || "/placeholder.svg"}
                                alt={question.media.alt || "تصویر سوال"}
                                className="max-w-32 h-20 object-cover rounded border"
                              />
                              <span className="text-sm text-gray-600">
                                تصویر سوال
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Video className="w-5 h-5 text-red-600" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  ویدیو سوال
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {question.media.url}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm p-2 rounded border ${
                              optIndex === question.correct
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            }`}
                          >
                            <span className="font-medium">{optIndex + 1}.</span>{" "}
                            {option}
                            {optIndex === question.correct && (
                              <span className="mr-2 text-green-600">
                                ✓ پاسخ صحیح
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mr-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingQuestion(question)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Question Form Component
function QuestionForm({ question, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      questionText: question?.question || "",
      options: question?.options || ["", "", "", ""],
      correct: question?.correct || 0,
      media: question?.media || null,
    },
  });

  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const watchedOptions = watch("options");
  const watchedCorrect = watch("correct");
  const watchedMedia = watch("media");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setValue("media", {
          type: "image",
          url: result,
          alt: imageAlt || file.name,
        });
        setShowImageInput(false);
        setImageUrl("");
        setImageAlt("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = () => {
    if (imageUrl.trim()) {
      setValue("media", {
        type: "image",
        url: imageUrl.trim(),
        alt: imageAlt.trim() || "تصویر سوال",
      });
      setShowImageInput(false);
      setImageUrl("");
      setImageAlt("");
    }
  };

  const handleVideoUrl = () => {
    if (videoUrl.trim()) {
      let embedUrl = videoUrl.trim();

      // Convert YouTube URLs to embed format
      if (embedUrl.includes("youtube.com/watch?v=")) {
        embedUrl = embedUrl.replace(
          "youtube.com/watch?v=",
          "youtube.com/embed/"
        );
      } else if (embedUrl.includes("youtu.be/")) {
        embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/");
      }

      setValue("media", {
        type: "video",
        url: embedUrl,
      });
      setShowVideoInput(false);
      setVideoUrl("");
    }
  };

  const removeMedia = () => {
    setValue("media", null);
  };

  const onSubmit = (data) => {
    // Remove HTML tags for validation
    const plainText = data.questionText.replace(/<[^>]*>/g, "").trim();
    if (plainText && data.options.every((opt) => opt.trim())) {
      onSubmit(
        data.questionText.trim(),
        data.options.map((opt) => opt.trim()),
        data.correct,
        data.media
      );
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-medium text-blue-800 mb-4">
        {question ? "ویرایش سوال" : "افزودن سوال جدید"}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            متن سوال *
          </label>
          <TinyMCEEditor
            value={watch("questionText")}
            onChange={(value) => setValue("questionText", value)}
            placeholder="متن سوال را وارد کنید..."
            className="bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            از ابزارهای ویرایشگر برای قالب‌بندی سوال استفاده کنید
          </p>
        </div>

        {/* Media Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رسانه (اختیاری)
          </label>

          {watchedMedia ? (
            <div className="p-4 bg-white border border-gray-300 rounded-lg">
              {watchedMedia.type === "image" ? (
                <div className="flex items-center gap-4">
                  <img
                    src={watchedMedia.url || "/placeholder.svg"}
                    alt={watchedMedia.alt}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      تصویر انتخاب شده
                    </p>
                    <p className="text-xs text-gray-500">{watchedMedia.alt}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={removeMedia}
                    className="text-red-600 bg-transparent"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      ویدیو انتخاب شده
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {watchedMedia.url}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={removeMedia}
                    className="text-red-600 bg-transparent"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowImageInput(!showImageInput);
                  setShowVideoInput(false);
                }}
                className="text-blue-600 hover:bg-blue-50"
              >
                <ImageIcon className="w-4 h-4 ml-2" />
                افزودن تصویر
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowVideoInput(!showVideoInput);
                  setShowImageInput(false);
                }}
                className="text-red-600 hover:bg-red-50"
              >
                <Video className="w-4 h-4 ml-2" />
                افزودن ویدیو
              </Button>
            </div>
          )}

          {/* Image Input */}
          {showImageInput && (
            <div className="mt-3 p-4 bg-white border border-gray-300 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آپلود تصویر
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="text-center text-gray-500 text-sm">یا</div>
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="لینک تصویر را وارد کنید"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-white"
                />
                <Input
                  type="text"
                  placeholder="توضیح تصویر (اختیاری)"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="bg-white"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleImageUrl}
                    disabled={!imageUrl.trim()}
                  >
                    <Link className="w-4 h-4 ml-2" />
                    افزودن لینک
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowImageInput(false)}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Video Input */}
          {showVideoInput && (
            <div className="mt-3 p-4 bg-white border border-gray-300 rounded-lg space-y-3">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="لینک ویدیو (YouTube, Vimeo, ...)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-white"
                />
                <p className="text-xs text-gray-500">
                  مثال: https://youtube.com/watch?v=VIDEO_ID یا
                  https://youtu.be/VIDEO_ID
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleVideoUrl}
                    disabled={!videoUrl.trim()}
                  >
                    <Video className="w-4 h-4 ml-2" />
                    افزودن ویدیو
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowVideoInput(false)}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            گزینه‌ها *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {watchedOptions.map((option, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    {...register(`options.${index}`)}
                    placeholder={`گزینه ${index + 1}`}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant={index === watchedCorrect ? "default" : "outline"}
                    onClick={() => setValue("correct", index)}
                    className={
                      index === watchedCorrect
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                  >
                    {index === watchedCorrect ? "✓" : index + 1}
                  </Button>
                </div>
                {index === watchedCorrect && (
                  <p className="text-xs text-green-600">
                    این گزینه پاسخ صحیح است
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600"
            disabled={
              !watch("questionText").trim() ||
              !watchedOptions.every((opt) => opt.trim())
            }
          >
            <Save className="w-4 h-4 ml-2" />
            {question ? "ذخیره تغییرات" : "افزودن سوال"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 ml-2" />
            انصراف
          </Button>
        </div>
      </form>
    </div>
  );
}
