import { AppSidebar } from "@/app/(dashboard)/_components/app-sidebar";
import { SiteHeader } from "@/app/(dashboard)/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserRole } from "@/interfaces/user-type";
import { getCookie } from "@/utils/token-handler";
import { verifyAccessToken } from "@/utils/verify-token";
import { connection } from "next/server";
import { Suspense } from "react";

async function AuthenticatedSidebar() {
  await connection();
  const token = await getCookie("access-token");
  const verified = token ? await verifyAccessToken(token) : null;
  const payload = verified?.success ? verified.payload?.payload : null;
  const user = {
    name: payload?.name ?? "MessMate user",
    email: payload?.email ?? "",
  };
  const dashboardPath = payload?.role === UserRole.MEMBER ? "/member" : "/mess";

  return (
    <AppSidebar variant="inset" user={user} dashboardPath={dashboardPath} />
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Suspense
        fallback={
          <AppSidebar
            variant="inset"
            user={{ name: "MessMate user", email: "" }}
            dashboardPath="/mess"
          />
        }
      >
        <AuthenticatedSidebar />
      </Suspense>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
