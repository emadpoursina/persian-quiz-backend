import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
import { deleteQuiz } from "@/lib/storage";

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

  getQuizBySlug(slug) {
    return useQuery({
      queryKey: ["quiz", slug],
      queryFn: async () => {
        const response = await apiClient.get(`/quiz/${slug}`);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در دریافت آزمون");
        }

        return response.data;
      },
      onError: (error) => {
        console.error("Error getting quiz:", error);
      },
    });
  },

  getQuiz(id) {
    const queryClient = useQueryClient();

    return useQuery({
      queryKey: ["quiz", id],
      queryFn: async () => {
        const response = await apiClient.get(`/quiz/id/${id}`);

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

  deleteQuestion(quizId) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (questionId) => {
        const response = await apiClient.delete(
          `/quiz/${quizId}/questions/${questionId}`
        );

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در حذف سوال آزمون");
        }

        return response.data;
      },
      onSuccess: () => {
        // Invalidate the quiz questions cache if needed
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
        toast.success("سوال آزمون حذف شد.");
      },
      onError: (error) => {
        toast.error("خطا در حذف سوال آزمون");
        console.error("Error deleting question:", error);
      },
    });
  },

  getQuizStudents(quizId) {
    return useQuery({
      queryKey: ["quiz", quizId, "students"],
      queryFn: async () => {
        const response = await apiClient.get(`/quiz/${quizId}/students`);
        if (!response.ok) {
          throw new Error(
            response.data?.message || "خطا در دریافت دانش‌آموزان آزمون"
          );
        }
        return response.data;
      },
    });
  },

  updateQuiz(quizId) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (quizData) => {
        const response = await apiClient.put(`/quiz/${quizId}`, quizData);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در بروزرسانی آزمون");
        }

        return response.data;
      },
      onSuccess: (data) => {
        // Invalidate and refetch the specific quiz
        queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });

        // Update the quiz in the cache
        queryClient.setQueryData(["quiz", quizId], data);

        // Also invalidate the quizzes list to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });

        toast.success("آزمون با موفقیت بروزرسانی شد");
      },
      onError: (error) => {
        toast.error("خطا در بروزرسانی آزمون");
        console.error("Error updating quiz:", error);
      },
    });
  },

  toggleQuizStatus() {
    return useMutation({
      mutationFn: async (quizId) => {
        const response = await apiClient.put(`/quiz/${quizId}/status`);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در بروزرسانی آزمون");
        }

        return response.data;
      },
    });
  },

  deleteQuiz(quizId) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async () => {
        const response = await apiClient.delete(`/quiz/${quizId}`);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در حذف آزمون");
        }

        return response.data;
      },
      onSuccess: () => {
        // Remove the quiz from the cache
        queryClient.removeQueries({ queryKey: ["quiz", quizId] });

        // Invalidate the quizzes list
        queryClient.invalidateQueries({ queryKey: ["quizzes"] });

        toast.success("آزمون با موفقیت حذف شد");
      },
      onError: (error) => {
        toast.error("خطا در حذف آزمون");
        console.error("Error deleting quiz:", error);
      },
    });
  },

  deleteQuiz() {
    return useMutation({
      mutationFn: async (quizId) => {
        const response = await apiClient.delete(`/quiz/${quizId}`);

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در حذف آزمون");
        }

        return response.data;
      },
    });
  },

  addStudent(quizId, student) {
    return useMutation({
      mutationFn: async () => {
        const response = await apiClient.post(
          `/quiz/${quizId}/students`,
          student
        );

        if (!response.ok) {
          throw new Error(response.data?.message || "خطا در ثبت سوال آزمون");
        }

        // Return user score
        return response.data.correctAnswers;
      },
      onSuccess: () => {
        toast.success("آزمون شما با موفقیت ثبت شد.");
      },
      onError: (error) => {
        toast.error("خطا در ثبت جواب های شما.");
        console.error("Error sending answers", error);
      },
    });
  },
};

export default useQuiz;
