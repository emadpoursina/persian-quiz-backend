import { useState } from "react";
import WelcomeForm from "@/components/WelcomForm";
import Quiz from "@/components/quiz";
import Results from "@/components/Result";
import { exampleQuizzes } from "@/lib/ExampleData";

export default function PersianQuizApp() {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "" });
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Use the example quiz with media
  const quizWithMedia = exampleQuizzes[0]; // "آزمون دانش عمومی ایران"

  const handleStartQuiz = (name, mobile) => {
    setUserInfo({ name, mobile });
    setCurrentStep("quiz");
  };

  const handleQuizComplete = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    setCurrentStep("welcome");
    setScore(0);
    setTotalQuestions(0);
    setUserInfo({ name: "", mobile: "" });
  };

  return (
    <div
      className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {currentStep === "welcome" && (
          <WelcomeForm
            onStart={handleStartQuiz}
            quizTitle={quizWithMedia.title}
            quizDescription={quizWithMedia.description}
          />
        )}
        {currentStep === "quiz" && (
          <Quiz
            userName={userInfo.name}
            onComplete={handleQuizComplete}
            questions={quizWithMedia.questions}
          />
        )}
        {currentStep === "results" && (
          <Results
            userName={userInfo.name}
            score={score}
            totalQuestions={totalQuestions}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
