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

  async logout() {
    const response = await apiClient.post("/auth/logout");
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

  async getProfile() {
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  async updateProfile(data: FormData) {
    const response = await apiClient.patch("/auth/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },

  async updateLanguage(languagePref: "en" | "bn") {
    const response = await apiClient.patch("/auth/language", { languagePref });
    return response.data;
  },
};
