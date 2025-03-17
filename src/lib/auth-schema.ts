import { z } from "zod";

// Password validation regex with comments for clarity
const passwordValidationRegex = new RegExp(
  "^(?=.*[a-z])" + // At least one lowercase letter
    "(?=.*[A-Z])" + // At least one uppercase letter
    "(?=.*[0-9])" + // At least one number
    "(?=.*[!@#$%^&*])" + // At least one special character
    "(?=.{8,})" // At least 8 characters
);

const baseSignUpFormSchema = z.object({
  full_name: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(3, {
      message: "Full name must be at least 3 characters",
    })
    .max(50, {
      message: "Full name must be at most 50 characters",
    })
    .trim(),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Please enter a valid email address",
    })
    .max(100, {
      message: "Email must be at most 100 characters",
    })
    .trim(),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(50, {
      message: "Password must be at most 50 characters",
    })
    .regex(passwordValidationRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),

  confirm_password: z.string({
    required_error: "Confirm password is required",
    invalid_type_error: "Confirm password must be a string",
  }),
});

// Sign-up schema with refinement
export const signUpFormSchema = baseSignUpFormSchema.superRefine(
  (data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
    }
  }
);

// Sign-in schema (picked from the base schema)
export const signInFormSchema = baseSignUpFormSchema.pick({
  email: true,
  password: true,
});
