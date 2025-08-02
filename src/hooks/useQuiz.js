import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";

const useQuiz = {
  addQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (quizData) => {
        const response = await apiClient.post("/quiz/add", quizData);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در ایجاد آزمون");
        }

        return response.data;
      },
      onSuccess: (data) => {
        // Invalidate and refetch quizzes list
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });

        // Optionally, you can also add the new quiz to the cache
        queryClient.setQueryData(["quizzes"], (oldData) => {
          if (oldData) {
            return [...oldData, data];
          }
          return [data];
        });
      },
      onError: (error) => {
        console.error("Error adding quiz:", error);
      },
    });
  },

  getQuiz(id) {
    const queryClient = useQueryClient();

    return useQuery({
      queryKey: ["quiz", id],
      queryFn: async () => {
        const response = await apiClient.get(`/quiz/${id}`);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در دریافت آزمون");
        }

        return response.data;
      },
      onSuccess: (data) => {
        // Invalidate the specific quiz query to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ["quiz", data._id || id] });
        console.log("Quiz fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error getting quiz:", error);
      },
    });
  },

  setQuestions(quizId, onSuccessSet) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (questions, isFile) => {
        let contentType = "";
        let requestBody = null;
        if (isFile) {
          contentType = "multipart/form-data";
          requestBody = new FormData();
          questions.forEach((q, idx) => {
            // Append question text and options as JSON string
            formData.append(`questions[${idx}][questionText]`, q.questionText);
            formData.append(`questions[${idx}][attachment]`, q.attachmentUrl);
            q.options.forEach((opt, optionIdx) => {
              formData.append(
                `questions[${idx}][options][${optionIdx}][text]`,
                option.text
              );
              formData.append(
                `questions[${idx}][options][${optionIdx}][isCorrect]`,
                option.isCorrect
              );
            });
          });
          // You may want to use formData in your request body
        } else {
          contentType = "application/json";

          // Transform questions to required format
          requestBody = questions.map((q) => ({
            questionText: q.questionText,
            options: q.options.map((opt, idx) => ({
              text: opt.text,
              isCorrect: !!opt.isCorrect,
            })),
            attachmentUrl: q.attachmentUrl,
          }));
        }

        const response = await apiClient.post(
          `/quiz/${quizId}/questions`,
          requestBody,
          {
            headers: {
              "Content-Type": contentType,
            },
          }
        );

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در ثبت سوالات آزمون");
        }

        return response.data;
      },
      onSuccess: () => {
        // Invalidate the quiz questions cache if needed
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
        toast.success("سوالات آزمون بروزرسانی شد.");
        onSuccessSet();
      },
      onError: (error) => {
        toast.error("خطا در ذخیره سوالات آزمون");
        console.error("Error setting questions:", error);
      },
    });
  },
};

export default useQuiz;
