import { SidebarTrigger } from "@/components/ui/sidebar"
import { BookOpen } from "lucide-react"

export default function SidebarHeader({ adminUser }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <h2 className="text-lg font-bold text-gray-800">پنل مدیریت</h2>
          <p className="text-sm text-gray-600">{adminUser ? `خوش آمدید ${adminUser}` : "آزمون‌های آنلاین"}</p>
        </div>
      </div>
      <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
    </div>
  )
}
