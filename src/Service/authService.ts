import apiClient from "./apiClient";
import { RegisterFormValues } from "@/Features/Register/registerFormSchema";

export const authService = {
  async register(data: RegisterFormValues) {
    const { confirmPassword, ...payload } = data;
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async verifyOtp(data: { email: string; otp: string }) {
    const response = await apiClient.post("/auth/verify-otp", data);
    return response.data;
  },

  async resendOtp(data: { email: string }) {
    const response = await apiClient.post("/auth/resend-otp", data);
    return response.data;
  },
};
