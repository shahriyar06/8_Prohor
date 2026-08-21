import { z } from "zod";

export const memberFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.string().uuid("Please select a role"),
  phoneNumber: z.string().min(6, "Phone number is required"),
  dateOfBirth: z.date({ message: "Date of birth is required" }),
  gender: z.enum(["male", "female", "other"]),
  bloodGroup: z.string().optional(),
  nationality: z.string().min(2, "Nationality is required"),
  address: z.string().min(2, "Address is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().optional(),
  joinDate: z.date({ message: "Join date is required" }),
  employmentType: z.enum(["full_time", "part_time", "volunteer", "intern"]),
  memberStatus: z.enum(["active", "inactive", "suspended"]).default("active"),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;