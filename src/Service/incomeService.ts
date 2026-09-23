import apiClient from "./apiClient";

export const incomeService = {
  async createCategory(data: { name: string; organizationId?: string }) {
    const response = await apiClient.post("/income/categories", data);
    return response.data;
  },
  async listCategories(organizationId?: string) {
    const response = await apiClient.get("/income/categories", {
      params: organizationId ? { organizationId } : {},
    });
    return response.data;
  },
  async updateCategory(categoryId: string, data: { name: string }) {
    const response = await apiClient.patch(`/income/categories/${categoryId}`, data);
    return response.data;
  },
  async deleteCategory(categoryId: string) {
    const response = await apiClient.delete(`/income/categories/${categoryId}`);
    return response.data;
  },

  async createIncome(data: Record<string, unknown>) {
    const response = await apiClient.post("/income", data);
    return response.data;
  },
  async listIncomes(organizationId?: string) {
    const response = await apiClient.get("/income", {
      params: organizationId ? { organizationId } : {},
    });
    return response.data;
  },
  async updateIncome(incomeId: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/income/${incomeId}`, data);
    return response.data;
  },
  async deleteIncome(incomeId: string) {
    const response = await apiClient.delete(`/income/${incomeId}`);
    return response.data;
  },
};