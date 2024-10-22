import dynamic from "next/dynamic";
import { getTokenUsageLogs } from "@/app/lib/actions";
import UsageChartSkeleton from "./UsageChartSkeleton";
import { TokenUsageLog } from "@/types";

const ClientSideAnthropicUsageChart = dynamic(
  () => import("./ClientSideAnthropicUsageChart"),
  { ssr: false, loading: () => <UsageChartSkeleton /> },
);

export default async function AnthropicUsageChart() {
  const usageStats: TokenUsageLog[] = await getTokenUsageLogs();

  return <ClientSideAnthropicUsageChart usageStats={usageStats} />;
}
