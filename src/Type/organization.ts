export interface OrganizationData {
  id: string;
  name: string;
  prefix: string | null;
  address: string | null;
  phoneNumber: string | null;
  priorityColors: { low: string; medium: string; high: string } | null;
}