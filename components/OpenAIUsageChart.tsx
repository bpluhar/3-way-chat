import dynamic from "next/dynamic";
import { getTokenUsageLogs } from "@/app/lib/actions";
import UsageChartSkeleton from "./UsageChartSkeleton";
import { TokenUsageLog } from "@/types";

const ClientSideOpenAIUsageChart = dynamic(
  () => import("./ClientSideOpenAIUsageChart"),
  { ssr: false, loading: () => <UsageChartSkeleton /> },
);

export default async function OpenAIUsageChart() {
  const usageStats: TokenUsageLog[] = await getTokenUsageLogs();

  return <ClientSideOpenAIUsageChart usageStats={usageStats} />;
}
