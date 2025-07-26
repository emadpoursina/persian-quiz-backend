import { create } from "apisauce";
import authStorage from "@/helpers/storage";

const apiUrl =
  import.meta.env.VITE_WEBSITE_URL + import.meta.env.VITE_API_PREFIX;
const apiClient = create({
  baseURL: apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  const token = authStorage.getToken();
  if (token) request.headers["X-Auth-Token"] = token;
});

apiClient.addAsyncResponseTransform(async (response, b) => {
  if (response.status === 401) {
    authStorage.removeToken();
    localStorage.removeItem("persian-quiz-user");
  }
});

export default apiClient;
