import apiClient from "./apiClient";

export const liabilityService = {
  async createLiability(data: Record<string, unknown>) {
    const response = await apiClient.post("/liability", data);
    return response.data;
  },
  async listLiabilities(organizationId?: string) {
    const response = await apiClient.get("/liability", {
      params: organizationId ? { organizationId } : {},
    });
    return response.data;
  },
  async updateLiability(id: string, data: Record<string, unknown>) {
    const response = await apiClient.patch(`/liability/${id}`, data);
    return response.data;
  },
  async addPayment(id: string, amount: number) {
    const response = await apiClient.post(`/liability/${id}/payment`, { amount });
    return response.data;
  },
  async deleteLiability(id: string) {
    const response = await apiClient.delete(`/liability/${id}`);
    return response.data;
  },
};