import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "./routers/index.jsx";
import "@/assets/css/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
