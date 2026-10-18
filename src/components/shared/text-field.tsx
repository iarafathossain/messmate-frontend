"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type NativeInputProps = Omit<
  React.ComponentProps<"input">,
  "name" | "value" | "defaultValue" | "onChange" | "onBlur" | "ref" | "id"
>;

interface ITextFieldProps<T extends FieldValues> extends NativeInputProps {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  type = "text",
  ...inputProps
}: ITextFieldProps<T>) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>

          {isPassword ? (
            <InputGroup>
              <InputGroupInput
                {...inputProps}
                {...field}
                value={field.value ?? ""}
                id={id}
                type={inputType}
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          ) : (
            <Input
              {...inputProps}
              {...field}
              value={field.value ?? ""}
              id={id}
              type={inputType}
              aria-invalid={fieldState.invalid}
            />
          )}

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
