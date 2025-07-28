import { useAtom } from "jotai";
import authStorage from "../helpers/storage";
import apiClient from "@/lib/apiClient";
import { currentUserAtom } from "@/config/state";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const login = (data) => {
    authStorage.storeToken(data.token);
    localStorage.setItem("persian-quiz-user", JSON.stringify(data.user));

    setCurrentUser(data.user);
  };

  const logOut = async () => {
    authStorage.removeToken();
    localStorage.removeItem("persian-quiz-user");

    window.open("/auth/login", "_self");
  };

  const updateUser = async() => {
    if (!currentUser) return;

    const { data, ok } = await apiClient.get("/users/me");
    if (data?.state < 0 || !ok) {
      console.log("Err in updateUser in useAuth:", data);
      throw new Error("An error occured. Please try again later.");
    }

    localStorage.setItem("persian-quiz-user", JSON.stringify(data.user));

    setCurrentUser(data.user);
  };

  return {
    login,
    logOut,
    setCurrentUser,
    currentUser,
    updateUser,
  };
}
