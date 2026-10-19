import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "cn";
import {
  ArrowRight,
  ClipboardCheck,
  ReceiptText,
  Utensils,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Daily Meal Tracking",
    description: "Keep monthly meal records organized and accessible.",
    icon: Utensils,
  },
  {
    title: "Transparent Expenses",
    description: "Track deposits and shared expenses in one place.",
    icon: ReceiptText,
  },
  {
    title: "Shared Monthly Sheet",
    description: "Keep managers and members on the same account records.",
    icon: ClipboardCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            MessMate
          </Link>
          <Button
            nativeButton={false}
            variant="ghost"
            render={<Link href="/signin" />}
          >
            Log in
          </Button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            Simple mess management for everyone
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Manage Your Mess, Without the Mess.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Track daily meals, member deposits, and shared expenses in one
            place. MessMate makes mess management transparent and helps everyone
            stay on top of their monthly accounts.
          </p>

          <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            <Card className="text-left transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-6">
                <h2 className="text-lg font-semibold">Register a Mess</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  Managing a mess? Create your mess account and manage meals,
                  deposits, and expenses.
                </p>

                <Link
                  href="/signup/mess"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mt-6 w-full text-center",
                  )}
                >
                  Get started
                  <ArrowRight />
                </Link>
              </CardContent>
            </Card>

            <Card className="text-left transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-6">
                <h2 className="text-lg font-semibold">Join a Mess</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  Already part of a mess? Join using your mess code and keep
                  track of meals and shared expenses.
                </p>

                <Link
                  href="/signup/member"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-6 w-full text-center",
                  )}
                >
                  Join with a code
                  <ArrowRight />
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </section>

        <section className="grid gap-4 border-t py-8 sm:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-foreground/10">
                <Icon className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-medium">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
