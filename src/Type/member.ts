export interface Role {
  id: string;
  name: string;
  isSystem: boolean;
}

export interface MemberProfile {
  memberId: string;
  profilePhoto: string | null;
  phoneNumber: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodGroup: string | null;
  nationality: string;
  address: string;
  designation: string;
  department: string | null;
  joinDate: string;
  employmentType: "full_time" | "part_time" | "volunteer" | "intern";
  memberStatus: "active" | "inactive" | "suspended";
}

export interface Member {
  id: string;
  user: { id: string; name: string; email: string };
  role: Role;
  profile: MemberProfile | null;
  joinedAt: string;
}