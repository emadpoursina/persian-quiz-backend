import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminPageHeader({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <SidebarTrigger />
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/quizzes")}
        className="text-gray-600 hover:text-gray-800"
      >
        <ArrowRight className="w-4 h-4 ml-1" />
        بازگشت به لیست آزمون‌ها
      </Button>
      {children}
    </div>
  );
}
