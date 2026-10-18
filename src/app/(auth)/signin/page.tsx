import { Card } from "@/components/ui/card";
import SigninForm from "./_components/signin-form";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md rounded-lg p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Sign In</h1>
        <p className="mb-6 text-center text-gray-600">
          Sign in to your account to continue.
        </p>
        <SigninForm />
      </Card>
    </div>
  );
}
