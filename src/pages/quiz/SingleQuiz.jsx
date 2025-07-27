import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import WelcomeForm from "../../components/welcome-form"
import Quiz from "../../components/quiz"
import Results from "../../components/results"
import { getQuizBySlug, addResult} from "@/lib/storage"

export default function QuizPage() {
  const params = useParams()
  const slug = params.slug

  const [currentStep, setCurrentStep] = useState("welcome")
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "" })
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [quizData, setQuizData] = useState(null)
  const [userAnswers, setUserAnswers] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const quiz = getQuizBySlug(slug)

    if (quiz) {
      // Check if quiz is active and within time range
      const now = new Date()
      const startTime = quiz.startTime ? new Date(quiz.startTime) : null
      const endTime = quiz.endTime ? new Date(quiz.endTime) : null

      if (!quiz.isActive) {
        setErrorMessage("این آزمون در حال حاضر غیرفعال است.")
        setCurrentStep("error")
        return
      }

      if (quiz.questions.length === 0) {
        setErrorMessage("این آزمون هنوز سوالی ندارد.")
        setCurrentStep("error")
        return
      }

      if (startTime && now < startTime) {
        setErrorMessage(`این آزمون از تاریخ ${startTime.toLocaleDateString("fa-IR")} شروع می‌شود.`)
        setCurrentStep("error")
        return
      }

      if (endTime && now > endTime) {
        setErrorMessage(`زمان این آزمون در تاریخ ${endTime.toLocaleDateString("fa-IR")} به پایان رسیده است.`)
        setCurrentStep("error")
        return
      }

      setQuizData(quiz)
    } else {
      setErrorMessage("آزمون مورد نظر یافت نشد.")
      setCurrentStep("error")
    }
  }, [slug])

  const handleStartQuiz = (name, mobile) => {
    setUserInfo({ name, mobile })
    setCurrentStep("quiz")
  }

  const handleQuizComplete = (finalScore, total, answers) => {
    setScore(finalScore)
    setTotalQuestions(total)
    setUserAnswers(answers)

    // Save result
    const result = {
      id: Date.now().toString(),
      quizId: quizData.id,
      userName: userInfo.name,
      userMobile: userInfo.mobile,
      answers,
      score: finalScore,
      completedAt: new Date().toISOString(),
    }

    addResult(result)
    setCurrentStep("results")
  }

  const handleRestart = () => {
    setCurrentStep("welcome")
    setScore(0)
    setTotalQuestions(0)
    setUserInfo({ name: "", mobile: "" })
    setUserAnswers([])
  }

  if (currentStep === "error" || !quizData) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-lg p-6 sm:p-8 text-center max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">خطا در بارگذاری آزمون</h1>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{errorMessage}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700" dir="rtl">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {currentStep === "welcome" && (
          <WelcomeForm onStart={handleStartQuiz} quizTitle={quizData.title} quizDescription={quizData.description} />
        )}
        {currentStep === "quiz" && (
          <Quiz userName={userInfo.name} onComplete={handleQuizComplete} questions={quizData.questions} />
        )}
        {currentStep === "results" && (
          <Results userName={userInfo.name} score={score} totalQuestions={totalQuestions} onRestart={handleRestart} />
        )}
      </div>
    </div>
  )
}
