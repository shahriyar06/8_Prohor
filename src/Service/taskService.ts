import apiClient from "./apiClient";
import { CreateTaskInput } from "@/Type/task";

export const taskService = {
  async createTask(data: CreateTaskInput) {
    const response = await apiClient.post("/tasks", data);
    return response.data;
  },

  async listTasks(organizationId?: string) {
    const response = await apiClient.get("/tasks", {
      params: organizationId ? { organizationId } : {},
    });
    return response.data;
  },
};