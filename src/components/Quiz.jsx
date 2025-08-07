import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ImageIcon, Video } from "lucide-react";

export default function Quiz({ userName, onComplete, questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(3);
  const [isAnswered, setIsAnswered] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAnswered && timeLeft === 0) {
      handleNextQuestion();
    }
  }, [isAnswered, timeLeft]);

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setTimeLeft(3);

    const newAnswers = [...allAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setAllAnswers(newAnswers);

    // Calculate score but don't show it to user
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(3);
    } else {
      onComplete(score, questions.length, allAnswers);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="flex items-center justify-center min-h-[100dvh] px-4">
      {console.log(currentQ)}
      <Card className="w-full max-w-2xl bg-white border-gray-200 shadow-xl">
        <CardContent className="p-4 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              سلام {userName} عزیز! 👋
            </h2>
            <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
              <span>
                سوال {currentQuestion + 1} از {questions.length}
              </span>
              <span>پیشرفت: {Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>

          {/* Question */}
          <div className="mb-6 sm:mb-8">
            <div
              className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center leading-relaxed quiz-question"
              dangerouslySetInnerHTML={{ __html: currentQ.questionText }}
            />

            {/* Media Display */}
            {currentQ.media && (
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  {/* Media Type Indicator */}
                  <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    {currentQ.media.type === "image" ? (
                      <>
                        <ImageIcon className="w-3 h-3" />
                        تصویر
                      </>
                    ) : (
                      <>
                        <Video className="w-3 h-3" />
                        ویدیو
                      </>
                    )}
                  </div>

                  {currentQ.media.type === "image" ? (
                    <img
                      src={currentQ.media.url || "/placeholder.svg"}
                      alt={currentQ.media.alt || "تصویر سوال"}
                      className="max-w-full h-auto max-h-64 rounded-lg shadow-lg border-2 border-gray-200"
                      onError={(e) => {
                        const target = e.target;
                        target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(
                          currentQ.media?.alt || "تصویر سوال"
                        )}`;
                      }}
                    />
                  ) : (
                    <div className="w-full max-w-lg">
                      <iframe
                        src={currentQ.media.url}
                        className="w-full h-64 rounded-lg shadow-lg border-2 border-gray-200"
                        frameBorder="0"
                        allowFullScreen
                        title="ویدیو سوال"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timer */}
            {isAnswered && (
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <div className="flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-blue-600 ml-2" />
                  <span className="text-blue-700 font-medium text-sm">
                    سوال بعدی در {timeLeft} ثانیه
                  </span>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="grid gap-3 sm:gap-4">
              {currentQ.options.map((option, index) => {
                let buttonClass =
                  "w-full p-3 sm:p-4 text-right rounded-lg border-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ";

                if (!isAnswered) {
                  buttonClass +=
                    "bg-gray-50 border-gray-300 text-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 hover:text-purple-700";
                } else {
                  if (index === selectedAnswer) {
                    // Show selected answer with blue highlight
                    buttonClass +=
                      "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 text-blue-800";
                  } else {
                    // Show unselected options as disabled
                    buttonClass += "bg-gray-50 border-gray-200 text-gray-400";
                  }
                }

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={isAnswered}
                    variant="ghost"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{option.text}</span>
                      {isAnswered && index === selectedAnswer && (
                        <div className="mr-2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Confirmation Message */}
          {isAnswered && (
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                <span>پاسخ شما ثبت شد</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
