export interface TokenUsageLogCount {
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
}

export interface TokenUsageLog {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  token_count: TokenUsageLogCount;
  updated: string;
  user_id: string;
}
