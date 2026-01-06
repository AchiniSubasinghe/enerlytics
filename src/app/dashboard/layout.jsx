"use client";

import TopNav from "@/components/global/TopNav";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  HomeIcon,
  UserIcon,
  ZapIcon,
  ClipboardListIcon,
  CreditCardIcon,
  SettingsIcon,
  LogOutIcon,
  DollarSignIcon,
  FileTextIcon,
  AlertCircleIcon,
  BarChart3,
  ActivityIcon,
  UserXIcon,
  TrendingUpIcon,
  TrophyIcon,
  PlusSquareIcon,
  HistoryIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Admin Menu
  const adminMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/admin" },
    { label: "Users", icon: UserIcon, href: "/dashboard/admin/users" },
    { label: "Logs", icon: SettingsIcon, href: "/dashboard/admin/logs" },
  ];

  // Admin_Staff
  const adminStaffMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/admin-staff" },
    { label: "Customers", icon: UserIcon, href: "/dashboard/admin-staff/customers" },
    { label: "Meters", icon: ZapIcon, href: "/dashboard/admin-staff/meters" },
    { label: "Meter Readers", icon: ClipboardListIcon, href: "/dashboard/admin-staff/meter-readers" },
    { label: "Tariffs", icon: DollarSignIcon, href: "/dashboard/admin-staff/tariffs" },
  ];

  // Meter Reader Menu
  const meterReaderMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/meter-reader" },
    { label: "Readings History", icon: HistoryIcon, href: "/dashboard/meter-reader/readings/history/[meterId]", },
  ];

  // Billing Menu
  const billingMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/billing" },
    { label: "bills", icon: FileTextIcon, href: "/dashboard/billing/bills/[billId]" },
    { label: "outsatnding", icon: AlertCircleIcon, href: "/dashboard/billing/outstanding" },
    { label: "Add payment", icon: CreditCardIcon, href: "/dashboard/billing/payments/add/[billId]" },
    { label: "Payment History", icon: HistoryIcon, href: "/dashboard/billing/payments/history/[customerId]" },
    { label: "summary", icon: BarChart3, href: "/dashboard/billing/summary" },
  ];

  // Manager Menu
  const managerMenu = [
    { label: "Dashboard", icon: HomeIcon, href: "/dashboard/manager" },
    { label: "consumption", icon: ActivityIcon, href: "/dashboard/manager/consumption" },
    { label: "defaulters", icon: UserXIcon, href: "/dashboard/manager/defaulters" },
    { label: "payments", icon: CreditCardIcon, href: "/dashboard/manager/payments" },
    { label: "revenue", icon: TrendingUpIcon, href: "/dashboard/manager/revenue" },
    { label: "top-consumers", icon: TrophyIcon, href: "/dashboard/manager/top-consumers" },
  ];

  function getMenu() {
    if (pathname.startsWith("/dashboard/admin-staff")) return adminStaffMenu;
    if (pathname.startsWith("/dashboard/admin")) return adminMenu;
    if (pathname.startsWith("/dashboard/meter-reader")) return meterReaderMenu;
    if (pathname.startsWith("/dashboard/billing")) return billingMenu;
    if (pathname.startsWith("/dashboard/manager")) return managerMenu;
    return [];
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const menu = getMenu();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar collapsible="icon" className="border-r bg-white">
          <SidebarContent>
            {/*  App Title */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <h1 className="text-xl font-bold">Enerlytics</h1>
              </SidebarGroupLabel>

              {/*  Dynamic Menu */}
              <SidebarMenu className="mt-4">
                {menu.map((item, i) => (
                  <SidebarMenuItem
                    key={i}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {/*  Logout Section */}
            <SidebarGroup className="mt-auto mb-20">
              <SidebarMenu>
                <SidebarMenuItem
                  icon={LogOutIcon}
                  label="Logout"
                  onClick={handleLogout}
                />
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="w-full">
          <TopNav title={pathname} />
          <div className="flex-1 flex flex-col">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
