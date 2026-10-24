"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const UserDashboard = dynamic(() => import("@/components/user/UserDashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-zinc-500 gap-3 text-sm bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      Memuat Dasbor Pengguna...
    </div>
  ),
});

export default function DashboardPage() {
  return <UserDashboard />;
}
