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

  getAllQuizzes() {
    return useQuery({
      queryKey: ["quizzes"],
      queryFn: async () => {
        const response = await apiClient.get("/quiz");

        if (!response.ok) {
          throw new Error(
            response.data?.message || "خطا در دریافت لیست آزمون‌ها"
          );
        }

        return response.data;
      },
      onSuccess: (data) => {
        // Optionally, you can do something on success, like logging
        console.log("Quizzes fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error getting quizzes:", error);
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

  addQuestion(quizId) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ question, isFile }) => {
        let contentType = "";
        let requestBody = null;

        if (isFile) {
          contentType = "multipart/form-data";
          requestBody = new FormData();

          // Append question fields
          requestBody.append("questionText", question.questionText);
          requestBody.append("attachmentType", question.attachmentType);
          requestBody.append("attachmentUrl", question.attachmentUrl);
          requestBody.append("attachmentAlt", question.attachmentAlt);

          question.options.forEach((opt, idx) => {
            requestBody.append(`options[${idx}][text]`, opt.text);
            requestBody.append(`options[${idx}][isCorrect]`, opt.isCorrect);
          });
        } else {
          contentType = "application/json";
          requestBody = {
            questionText: question.questionText,
            options: question.options.map((opt) => ({
              text: opt.text,
              isCorrect: !!opt.isCorrect,
            })),
            attachmentUrl: question.attachmentUrl,
            attachmentAlt: question.attachmentAlt,
            attachmentType: question.attachmentType,
          };
        }

        const response = await apiClient.post(
          `/quiz/${quizId}/questions/add`,
          requestBody,
          {
            headers: {
              "Content-Type": contentType,
            },
          }
        );

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در ثبت سوال آزمون");
        }

        return response.data;
      },
      onSuccess: () => {
        // Invalidate the quiz questions cache if needed
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
        toast.success("سوال آزمون اضافه شد.");
      },
      onError: (error) => {
        toast.error("خطا در ذخیره سوال آزمون");
        console.error("Error adding question:", error);
      },
    });
  },

  updateQuestion(quizId, onSuccess) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async ({ question, isFile }) => {
        let contentType = "";
        let requestBody = null;

        if (isFile) {
          contentType = "multipart/form-data";
          requestBody = new FormData();

          // Append question fields
          requestBody.append("_id", question._id);
          requestBody.append("questionText", question.questionText);
          requestBody.append("attachmentType", question.attachmentType);
          requestBody.append("attachmentUrl", question.attachmentUrl);
          requestBody.append("attachmentAlt", question.attachmentAlt);

          question.options.forEach((opt, idx) => {
            requestBody.append(`options[${idx}][text]`, opt.text);
            requestBody.append(`options[${idx}][isCorrect]`, opt.isCorrect);
          });
        } else {
          contentType = "application/json";
          requestBody = {
            questionText: question.questionText,
            options: question.options.map((opt) => ({
              text: opt.text,
              isCorrect: !!opt.isCorrect,
            })),
            attachmentUrl: question.attachmentUrl,
            attachmentAlt: question.attachmentAlt,
            attachmentType: question.attachmentType,
          };
        }

        const response = await apiClient.put(
          `/quiz/${quizId}/questions/${question._id}`,
          requestBody,
          {
            headers: {
              "Content-Type": contentType,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            response.data?.message || "خطا در بروزرسانی سوال آزمون"
          );
        }

        return response.data;
      },
      onSuccess: () => {
        // Invalidate the quiz questions cache if needed
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
        toast.success("سوال آزمون بروزرسانی شد.");
        onSuccess();
      },
      onError: (error) => {
        toast.error("خطا در بروزرسانی سوال آزمون");
        console.error("Error updating question:", error);
      },
    });
  },
};

export default useQuiz;
