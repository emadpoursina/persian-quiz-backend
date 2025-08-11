import { useState } from "react";
import { useParams } from "react-router-dom";
import WelcomeForm from "@/components/WelcomForm";
import Quiz from "@/components/Quiz";
import Results from "@/components/Result";
import useQuiz from "@/hooks/useQuiz";

export default function PersianQuizApp() {
  const { slug } = useParams();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "" });
  const [allAnswers, setAllAnswers] = useState([]);

  // Fetch quiz data from server using the slug
  const { data: quiz, isLoading, error } = useQuiz.getQuizBySlug(slug);

  const handleStartQuiz = (name, mobile) => {
    setUserInfo({ name, mobile });
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (allAnswers) => {
    setAllAnswers(allAnswers);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setAllAnswers([]);
    setUserInfo({ name: "", mobile: "" });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-white text-xl">در حال بارگذاری آزمون...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-white text-xl">خطا در بارگذاری آزمون</div>
      </div>
    );
  }

  // If no quiz data, show error
  if (!quiz) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-white text-xl">آزمون یافت نشد</div>
      </div>
    );
  }

  // Check if the quiz is inactive or outside the allowed time window
  if (
    quiz.isActive === false ||
    (quiz.startTime &&
      quiz.endTime &&
      (new Date() < new Date(quiz.startTime) ||
        new Date() > new Date(quiz.endTime)))
  ) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-white text-xl">این آزمون در حال حاضر غیر فعال هست</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {currentStep === "welcome" && (
          <WelcomeForm
            onStart={handleStartQuiz}
            quizTitle={quiz.title}
            quizDescription={quiz.description}
            quizAccessType={quiz.accessType}
            quizAllowedPhoneNumbers={quiz.allowedPhoneNumbers}
          />
        )}
        {currentStep === "quiz" && (
          <Quiz
            userName={userInfo.name}
            onComplete={handleQuizComplete}
            questions={
              (quiz.questions = quiz.questions.map((q) => {
                return {
                  ...q,
                  media:
                    q.attachmentType === "none"
                      ? undefined
                      : {
                          type: q.attachmentType,
                          url: q.attachmentUrl,
                          alt: q.attachmentAlt,
                        },
                };
              }))
            }
          />
        )}
        {currentStep === "results" && (
          <Results
            quizId={quiz._id}
            totalQuestions={quiz.questions.length}
            student={{
              fullName: userInfo.name,
              phoneNumber: userInfo.mobile,
              allAnswers,
            }}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
