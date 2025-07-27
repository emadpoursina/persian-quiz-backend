import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Plus, LogOut, BookOpen } from "lucide-react"

const menuItems = [
  {
    title: "داشبورد",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "آزمون‌ها",
    url: "/admin/quizzes",
    icon: FileText,
  },
  {
    title: "ایجاد آزمون",
    url: "/admin/quizzes/create",
    icon: Plus,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const adminUser = typeof window !== "undefined" ? localStorage.getItem("adminUser") : null

  return (
    <Sidebar side="right" className="border-r border-gray-200 bg-white order-2" collapsible="icon" variant="sidebar">
      {/* Header */}
      <SidebarHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
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
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium group-data-[collapsible=icon]:sr-only px-2">
            مدیریت اصلی
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="w-full justify-start"
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="group-data-[collapsible=icon]:sr-only">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50 w-full justify-start px-3 py-2"
              tooltip="خروج"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="group-data-[collapsible=icon]:sr-only">خروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
