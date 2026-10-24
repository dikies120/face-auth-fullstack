export interface Member {
  id: string;
  name: string;
  memberCode?: string | null;
  department?: string | null;
  email?: string | null;
  faceImageUrl?: string | null;
  createdAt: string;
  _count?: { attendances: number };
}

export interface TodayStats {
  totalMembers: number;
  presentToday: number;
  inCount: number;
  outCount: number;
  lateCount: number;
  onTimeCount: number;
}

export interface AttendanceLog {
  id: string;
  userId: string;
  type: "IN" | "OUT";
  status: "ON_TIME" | "LATE";
  similarityDistance: number;
  snapshotUrl?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string | null;
    memberCode?: string | null;
    department?: string | null;
    faceImageUrl?: string | null;
  };
}

export interface PlatformStats {
  totalUsers: number;
  totalAttendances: number;
  todayAttendances: number;
  totalFaceLogins: number;
}

export interface AdminManagedUser {
  id: string;
  name: string;
  email?: string | null;
  memberCode?: string | null;
  department?: string | null;
  role: string;
  faceImageUrl?: string | null;
  createdAt: string;
  _count?: {
    attendances: number;
    loginLogs: number;
  };
}
