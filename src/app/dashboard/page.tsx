import DashboardClient from "./dashboard-client";
import { getServerDictionary } from "@/lib/locale";

export default async function DashboardPage() {
  const dict = await getServerDictionary();
  return <DashboardClient dict={dict.dashboard} />;
}
