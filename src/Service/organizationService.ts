import apiClient from "./apiClient";

export const organizationService = {
  async getMyOrganization() {
    const response = await apiClient.get("/organizations/mine");
    return response.data;
  },

  async updateOrganization(organizationId: string, data: { name?: string; prefix?: string; address?: string; phoneNumber?: string }) {
    const response = await apiClient.patch(`/organizations/${organizationId}`, data);
    return response.data;
  },
};