export interface ProfileData {
  id: string;
  name: string;
  email: string;
  accountType: string;
  languagePref: string;
  profilePhoto: string | null;
  priorityColors: { low: string; medium: string; high: string } | null;
  allowedRoutes: string[];
  trialEndsAt: string | null;
}

export type PriorityColors = ProfileData["priorityColors"];
