import { IMessType, ISignUpUser, UserRole } from "@/interfaces/user-type";
import { z } from "zod";

export const signupSchema = z
  .object({
    role: z.nativeEnum(UserRole),
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^0\d{10}$/, "Phone number must be 11 digits and start with 0"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be at most 50 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)",
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),

    // role-specific
    messName: z.string().trim().optional(),
    messType: z.nativeEnum(IMessType).optional(),
    messCode: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    if (data.role === UserRole.MESS) {
      if (!data.messName || data.messName.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["messName"],
          message: "Mess name is required",
        });
      }
      if (!data.messType) {
        ctx.addIssue({
          code: "custom",
          path: ["messType"],
          message: "Select a mess type",
        });
      }
    } else if (!data.messCode) {
      ctx.addIssue({
        code: "custom",
        path: ["messCode"],
        message: "Mess code is required",
      });
    }
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

/** Convert validated form values into the API payload. */
export function toSignupPayload(values: SignupFormValues): ISignUpUser {
  const { name, email, phone, password, confirmPassword } = values;

  if (values.role === UserRole.MESS) {
    return {
      name,
      email,
      phone,
      password,
      confirmPassword,
      messName: values.messName!,
      messType: values.messType!,
    };
  }

  return {
    name,
    email,
    phone,
    password,
    confirmPassword,
    messCode: values.messCode!,
  };
}
