import apiClient from "./apiClient";

export const incomeService = {
  async createCategory(data: { name: string; organizationId?: string }) {
    const response = await apiClient.post("/income/categories", data);
    return response.data;
  },

  // async listCategories(organizationId?: string) {
  //   const response = await apiClient.get("/income/categories", {
  //     params: organizationId ? { organizationId } : {},
  //   });
  //   return response.data;
  // },

  async listCategories(activeOnly = false) {
    const response = await apiClient.get("/income/categories", {
      params: activeOnly ? { active: "true" } : {},
    });
    return response.data;
  },

  // async updateCategory(categoryId: string, data: { name: string }) {
  //   const response = await apiClient.patch(
  //     `/income/categories/${categoryId}`,
  //     data,
  //   );
  //   return response.data;
  // },

  async updateCategory(
    id: string,
    data: { name?: string; isActive?: boolean },
  ) {
    const response = await apiClient.patch(`/income/categories/${id}`, data);
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

  // async listIncomes(organizationId?: string) {
  //   const response = await apiClient.get("/income", {
  //     params: organizationId ? { organizationId } : {},
  //   });
  //   return response.data;
  // },

  async listIncomes(params: {
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get("/income", { params });
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

  async getSummary() {
    const response = await apiClient.get("/income/summary");
    return response.data;
  },
};
