"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ISignupPageWrapperProps {
  children: React.ReactNode;
}

export const SignupPageWrapper: React.FC<ISignupPageWrapperProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const activeTab = pathname.startsWith("/signup/member") ? "member" : "mess";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          {/* logo */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-primary font-semibold">Mess</span>
              <span className="text-muted-foreground">Mate</span>
            </div>
          </div>

          {/* tabs */}
          <Tabs value={activeTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="mess"
                nativeButton={false}
                render={<Link href="/signup/mess" />}
              >
                Mess
              </TabsTrigger>
              <TabsTrigger
                value="member"
                nativeButton={false}
                render={<Link href="/signup/member" />}
              >
                Member
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
