import dynamic from 'next/dynamic';
import { getTokenUsageLogs } from '@/app/lib/actions';
import UsageChartSkeleton from './UsageChartSkeleton';

const ClientSideAnthropicUsageChart = dynamic(
  () => import('./ClientSideAnthropicUsageChart'),
  { ssr: false, loading: () => <UsageChartSkeleton /> }
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

export default async function AnthropicUsageChart() {
  const usageStats = await getTokenUsageLogs();

  return <ClientSideAnthropicUsageChart usageStats={usageStats} />;
}
