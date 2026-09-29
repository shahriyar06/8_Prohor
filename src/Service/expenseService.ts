import apiClient from "./apiClient";

export const expenseService = {
  async createCategory(data: { name: string; organizationId?: string }) {
    const response = await apiClient.post("/expense/categories", data);
    return response.data;
  },

  async listCategories(params?: {
    activeOnly?: boolean;
    search?: string;
    status?: string;
  }) {
    const response = await apiClient.get("/expense/categories", {
      params: {
        ...(params?.activeOnly && { active: "true" }),
        ...(params?.search && { search: params.search }),
        ...(params?.status && { status: params.status }),
      },
    });
    return response.data;
  },

  async updateCategory(
    categoryId: string,
    data: { name?: string; isActive?: boolean },
  ) {
    const response = await apiClient.patch(
      `/expense/categories/${categoryId}`,
      data,
    );
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await apiClient.delete(
      `/expense/categories/${categoryId}`,
    );
    return response.data;
  },

  async createExpense(data: Record<string, unknown>) {
    const response = await apiClient.post("/expense", data);
    return response.data;
  },

  async listExpenses(params: {
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get("/expense", { params });
    return response.data;
  },

  async updateExpense(expenseId: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/expense/${expenseId}`, data);
    return response.data;
  },

  async deleteExpense(expenseId: string) {
    const response = await apiClient.delete(`/expense/${expenseId}`);
    return response.data;
  },

  async getSummary() {
    const response = await apiClient.get("/expense/summary");
    return response.data;
  },
};
