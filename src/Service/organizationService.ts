import apiClient from "./apiClient";

export const organizationService = {
  async getMyOrganization() {
    const response = await apiClient.get("/organizations/mine");
    return response.data;
  },

  async updateOrganization(
    organizationId: string,
    data: {
      name?: string;
      prefix?: string;
      address?: string;
      phoneNumber?: string;
    },
  ) {
    const response = await apiClient.patch(
      `/organizations/${organizationId}`,
      data,
    );
    return response.data;
  },

  async listRoles(organizationId: string) {
    const response = await apiClient.get(
      `/organizations/${organizationId}/roles`,
    );
    return response.data;
  },

  async addMember(organizationId: string, formData: FormData) {
    const response = await apiClient.post(
      `/organizations/${organizationId}/members`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async listMembers(organizationId: string) {
    const response = await apiClient.get(
      `/organizations/${organizationId}/members`,
    );
    return response.data;
  },

  async removeMember(organizationId: string, memberId: string) {
    const response = await apiClient.delete(
      `/organizations/${organizationId}/members/${memberId}`,
    );
    return response.data;
  },

  async getRolePermissions(organizationId: string, roleId: string) {
    const response = await apiClient.get(
      `/organizations/${organizationId}/roles/${roleId}/permissions`,
    );
    return response.data;
  },

  async setRolePermissions(
    organizationId: string,
    roleId: string,
    permissionKeys: string[],
  ) {
    const response = await apiClient.put(
      `/organizations/${organizationId}/roles/${roleId}/permissions`,
      { permissionKeys },
    );
    return response.data;
  },

    async getMemberById(organizationId: string, memberId: string) {
    const response = await apiClient.get(
      `/organizations/${organizationId}/members/${memberId}`,
    );
    return response.data;
  },

  async updateMember(
    organizationId: string,
    memberId: string,
    formData: FormData,
  ) {
    const response = await apiClient.patch(
      `/organizations/${organizationId}/members/${memberId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
