import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    accountType: z.enum(["personal", "organization"], {
      message: "Please select an account type",
    }),
    organizationName: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.accountType === "personal" || !!data.organizationName,
    {
      message: "Organization name is required",
      path: ["organizationName"],
    }
  );

export type RegisterFormValues = z.infer<typeof registerFormSchema>;