"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { signupAction } from "@/actions/auth/signup-action";
import { SubmitButton } from "@/components/shared/submit-button";
import { TextField } from "@/components/shared/text-field";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMessType, UserRole } from "@/interfaces/user-type";
import { getDefaultDashboardRoute } from "@/utils/get-dashboard-route";
import Link from "next/link";
import {
  SignupFormValues,
  signupSchema,
  toSignupPayload,
} from "../_libs/signup-schema";

const MESS_TYPE_ITEMS = [
  { value: IMessType.BOYS, label: "Boys" },
  { value: IMessType.GIRLS, label: "Girls" },
];

interface ISignupFormProps {
  role: UserRole;
}

export default function SignupForm({ role }: ISignupFormProps) {
  const router = useRouter();
  const isMess = role === UserRole.MESS;
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role,
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      messName: "",
      messType: undefined,
      messCode: "",
    },
  });

  const { control, formState } = form;

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);
    try {
      const payload = toSignupPayload(values);
      const result = await signupAction(payload, role);

      if (result.success) {
        setServerError(null);
        router.push(getDefaultDashboardRoute(role));
        form.reset();
      } else {
        setServerError(result.message);
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={formState.isSubmitting} className="space-y-4">
        <FieldGroup>
          <h3 className="text-lg font-semibold">
            {isMess ? "Create your mess" : "Join a mess"}
          </h3>

          {/* role-specific fields */}
          {isMess ? (
            <>
              <TextField
                control={control}
                name="messName"
                label="Mess name"
                placeholder="Green View Mess"
                autoComplete="off"
              />

              <Controller
                name="messType"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-messType">Mess type</FieldLabel>
                    <Select
                      name={field.name}
                      items={MESS_TYPE_ITEMS}
                      value={field.value ?? null}
                      onValueChange={(value) =>
                        field.onChange(value ?? undefined)
                      }
                    >
                      <SelectTrigger
                        id="signup-messType"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {MESS_TYPE_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </>
          ) : (
            <TextField
              control={control}
              name="messCode"
              label="Mess code"
              placeholder="Ask your mess manager"
              autoComplete="off"
            />
          )}

          {/* shared fields */}
          <TextField
            control={control}
            name="name"
            label="Full name"
            autoComplete="name"
          />
          <TextField
            control={control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <TextField
            control={control}
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
          />
          <TextField
            control={control}
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <TextField
            control={control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />

          {serverError && (
            <p className="text-sm text-destructive" role="alert">
              {serverError}
            </p>
          )}

          <SubmitButton
            isLoading={formState.isSubmitting}
            label="Go ahead"
            className="w-full"
          />
        </FieldGroup>
      </fieldset>

      {/* already have an account? */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-primary underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
