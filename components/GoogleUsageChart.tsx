import dynamic from "next/dynamic";
import { getTokenUsageLogs } from "@/app/lib/actions";
import UsageChartSkeleton from "./UsageChartSkeleton";
import { TokenUsageLog } from "@/types";

const ClientSideGoogleUsageChart = dynamic(
  () => import("./ClientSideGoogleUsageChart"),
  { ssr: false, loading: () => <UsageChartSkeleton /> },
);

export default async function GoogleUsageChart() {
  const usageStats: TokenUsageLog[] = await getTokenUsageLogs();

  return <ClientSideGoogleUsageChart usageStats={usageStats} />;
}
