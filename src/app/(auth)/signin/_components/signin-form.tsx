"use client";

import { signinAction } from "@/actions/auth/signin-action";
import { SubmitButton } from "@/components/shared/submit-button";
import { TextField } from "@/components/shared/text-field";
import { FieldGroup } from "@/components/ui/field";
import { getDefaultDashboardRoute } from "@/utils/get-dashboard-route";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SigninFormValues, signinSchema } from "../_libs/signin-schema";

export default function SigninForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, formState } = form;

  async function onSubmit(values: SigninFormValues) {
    try {
      const result = await signinAction(values);

      if (result.success) {
        setServerError(null);
        const role = result.data?.user?.role;

        if (!role) {
          setServerError("User role is missing");
          return;
        }

        router.push(getDefaultDashboardRoute(role));
        form.reset();
      } else {
        setServerError(result.message || "Signin failed");
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <fieldset className="space-y-4">
        <FieldGroup>
          <TextField
            control={control}
            name="email"
            label="Email"
            placeholder="john@example.com"
            autoComplete="email"
          />

          <TextField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </FieldGroup>

        <SubmitButton
          isLoading={formState.isSubmitting}
          label="Go ahead"
          className="w-full"
        />
      </fieldset>

      {serverError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}
    </form>
  );
}
