import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

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
};

export default useQuiz;
