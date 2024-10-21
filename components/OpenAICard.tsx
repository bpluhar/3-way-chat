"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OpenAIUsageChart } from "@/components/OpenAIUsageChart";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OpenAICard() {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>OpenAI Stats</CardTitle>
        <CardDescription>
          Stats for your OpenAI usage. Numbers may not be accurate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OpenAIUsageChart />
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/chat/openai">
          <Button variant="default">Chat with OpenAI</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
