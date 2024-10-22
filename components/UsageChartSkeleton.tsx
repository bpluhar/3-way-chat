"use client";

import React from "react";
import { Pie, PieChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const dummyData = [
  { value: 50 },
  { value: 50 },
];

export default function UsageChartSkeleton() {
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

  return (
    <Card className="flex flex-col sm:w-1/3">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-40" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {
          /* <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={chartConfig}
        > */
        }
        <div className="relative w-full h-full flex items-center justify-center my-4 pb-8">
          <Skeleton className="w-44 h-44 rounded-full" />
        </div>
        {/* </ChartContainer> */}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm w-full">
        <div className="flex items-center gap-2 font-medium leading-none w-full justify-center">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2 font-medium leading-none w-full justify-center">
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
