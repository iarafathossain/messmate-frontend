import { cn } from "@/lib/utils";
import { LoaderIcon, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { Button } from "../ui/button";

interface SubmitBtnProps extends ComponentPropsWithoutRef<typeof Button> {
  onSubmit?: () => void;
  formName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  icon?: LucideIcon;
}

export function SubmitButton({
  onSubmit,
  formName,
  isLoading,
  disabled,
  label,
  icon: Icon,
  className,
  variant = "default",
  size = "default",
  ...props
}: SubmitBtnProps) {
  return (
    <Button
      type={onSubmit ? "button" : "submit"}
      onClick={onSubmit}
      form={onSubmit ? undefined : formName}
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      className={cn("text-base font-normal tracking-wide", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderIcon className="h-4 w-4 animate-spin" />
          <span>{label}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
