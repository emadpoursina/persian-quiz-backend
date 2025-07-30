import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export function addQuiz() {
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
}
