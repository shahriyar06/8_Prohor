import apiClient from "./apiClient";

export const receivableService = {
  async createReceivable(data: Record<string, unknown>) {
    const response = await apiClient.post("/receivable", data);
    return response.data;
  },
  async listReceivables(params: {
    search?: string;
    date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get("/receivable", { params });
    return response.data;
  },
  async getSummary() {
    const response = await apiClient.get("/receivable/summary");
    return response.data;
  },
  async updateReceivable(id: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/receivable/${id}`, data);
    return response.data;
  },
  async addReceipt(id: string, amount: number) {
    const response = await apiClient.post(`/receivable/${id}/receipt`, {
      amount,
    });
    return response.data;
  },
  async deleteReceivable(id: string) {
    const response = await apiClient.delete(`/receivable/${id}`);
    return response.data;
  },
};
