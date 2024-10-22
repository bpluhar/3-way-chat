"use client";

import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

type ChartDataItem = {
  name: string;
  value: number;
  fill: string;
};

const chartConfig = {
  tokens: {
    label: "Tokens",
  },
  promptTokens: {
    label: "Prompt Tokens",
    color: "hsl(var(--chart-1))",
  },
  completionTokens: {
    label: "Completion Tokens",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ClientSideOpenAIUsageChart(
  { usageStats }: { usageStats: TokenUsageLog[] },
) {
  const chartData: ChartDataItem[] = useMemo(() => {
    const totalPromptTokens = usageStats.reduce(
      (sum, log) => sum + (log.token_count.openai?.promptTokens || 0),
      0,
    );
    const totalCompletionTokens = usageStats.reduce(
      (sum, log) => sum + (log.token_count.openai?.completionTokens || 0),
      0,
    );

    return [
      {
        name: "promptTokens",
        value: totalPromptTokens,
        fill: chartConfig.promptTokens.color,
      },
      {
        name: "completionTokens",
        value: totalCompletionTokens,
        fill: chartConfig.completionTokens.color,
      },
    ];
  }, [usageStats]);

  const totalTokens = useMemo(
    () =>
      usageStats.reduce(
        (sum, log) => sum + (log.token_count.openai?.totalTokens || 0),
        0,
      ),
    [usageStats],
  );

  return (
    <Card className="flex flex-col sm:w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>OpenAI Usage</CardTitle>
        <CardDescription>Token Usage Statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTokens.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tokens
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm w-full">
        <div className="flex items-center gap-2 font-medium leading-none">
          <strong>Prompt Tokens: {chartData[0].value.toLocaleString()}</strong>
        </div>
        <div className="flex items-center gap-2 font-medium leading-none">
          Completion Tokens: {chartData[1].value.toLocaleString()}
        </div>
        <Link href="/dashboard/chat/openai" className="w-full">
          <Button variant="default" className="w-full">
            Chat with OpenAI
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}