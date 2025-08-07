import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star } from "lucide-react";

export default function Results({
  userName,
  score,
  totalQuestions,
  onRestart,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const getResultMessage = () => {
    if (percentage >= 80) return "عالی! شما واقعاً استاد هستید! 🏆";
    if (percentage >= 60) return "خوب! عملکرد قابل قبولی داشتید 👍";
    if (percentage >= 40) return "متوسط! می‌توانید بهتر شوید 📚";
    return "نیاز به تمرین بیشتر دارید 💪";
  };

  const getResultColor = () => {
    if (percentage >= 80) return "from-yellow-400 to-orange-400";
    if (percentage >= 60) return "from-green-400 to-blue-400";
    if (percentage >= 40) return "from-blue-400 to-indigo-400";
    return "from-gray-400 to-gray-500";
  };

  const getStars = () => {
    if (percentage >= 80) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 40) return 1;
    return 0;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card
        className={`w-full max-w-lg bg-white border-gray-200 shadow-xl transition-all duration-1000 ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <CardHeader className="text-center pb-4">
          <div
            className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r ${getResultColor()} rounded-full flex items-center justify-center mb-4 animate-bounce`}
          >
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            نتیجه آزمون
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {userName} عزیز، آزمون شما به پایان رسید
          </p>
        </CardHeader>

        <CardContent className="space-y-6 text-center p-4 sm:p-6">
          {/* Score Display */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 space-y-4 border border-gray-200">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800">
              {score} / {totalQuestions}
            </div>
            <div className="text-xl sm:text-2xl font-semibold text-gray-700">
              {percentage}%
            </div>

            {/* Stars */}
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    i < getStars()
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-white/30"
                  } transition-all duration-500`}
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Result Message */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <p className="text-blue-800 font-medium text-base sm:text-lg">
              {getResultMessage()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-3">
            <p className="text-gray-600 text-sm">
              متشکریم که در آزمون شرکت کردید
            </p>
            <Button variant="outline" className="mt-2" onClick={onRestart}>
              شروع مجدد آزمون
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
