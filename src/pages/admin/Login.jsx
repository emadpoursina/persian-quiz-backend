import { User, Lock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import RootLayout from "@/components/Layouts/RootLayout";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  // Define validation schema with Joi
  const joiSchema = Joi.object({
    phone: Joi.string()
      .pattern(/^09\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "شماره موبایل نامعتبر است.",
        "string.empty": "شماره موبایل را وارد کنید.",
      }),
    password: Joi.string().required().messages({
      "string.empty": "رمز عبور را وارد کنید.",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(joiSchema),
  });

  const {
    mutate: mutateLogin,
    isLoading,
    error: loginError,
  } = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post("/auth/login", data);
      const token = response.headers && response.headers["x-auth-token"];
      if (response.ok && token) {
        login(response.data);
        return response.data;
      }
      if (response.status === 401) {
        throw new Error("ایمیل یا رمز عبور اشتباه است");
      }
      throw new Error(
        response.data?.message || response.problem || "ورود ناموفق بود"
      );
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    },
    onError: () => {
      toast.error("Login failed. Please try again.");
    },
  });

  return (
    <RootLayout>
      <AdminLayout>
        <div
          className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center px-4"
          dir="rtl"
        >
          <Card className="w-full max-w-md bg-white border-gray-200 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                ورود به پنل مدیریت
              </CardTitle>
              <p className="text-gray-600 text-sm">
                برای دسترسی به پنل مدیریت وارد شوید
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-4 sm:p-6">
              <form onSubmit={handleSubmit(mutateLogin)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="tell"
                      id="phone"
                      {...register("phone")}
                      className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                      placeholder="شماره موبایل خود را وارد کنید."
                      required
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      id="password"
                      {...register("password")}
                      className="pr-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                      placeholder="رمز عبور خود را وارد کنید"
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>
                {loginError && (
                  <div className="text-red-500 text-sm text-center">
                    {loginError.message || "ورود ناموفق بود"}
                  </div>
                )}
                <Button
                  type="submit"
                  // disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      در حال ورود...
                    </>
                  ) : (
                    "ورود به پنل"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </RootLayout>
  );
}
