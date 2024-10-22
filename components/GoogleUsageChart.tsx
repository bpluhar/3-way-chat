import dynamic from "next/dynamic";
import { getTokenUsageLogs } from "@/app/lib/actions";
import UsageChartSkeleton from "./UsageChartSkeleton";

const ClientSideGoogleUsageChart = dynamic(
  () => import("./ClientSideGoogleUsageChart"),
  { ssr: false, loading: () => <UsageChartSkeleton /> },
);

type TokenUsageLogCount = {
  openai?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  anthropic?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  google?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

type TokenUsageLog = {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  token_count: TokenUsageLogCount;
  updated: string;
  user_id: string;
};

export default async function GoogleUsageChart() {
  const usageStats = await getTokenUsageLogs();

  return <ClientSideGoogleUsageChart usageStats={usageStats} />;
}
