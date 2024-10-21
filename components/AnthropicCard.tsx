import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnthropicCard() {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Anthropic Stats</CardTitle>
        <CardDescription>
          Stats for your Anthropic usage. Numbers may not be accurate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Prompt Tokens: 0</p>
        <p>Completion Tokens: 0</p>
        <p>Total Tokens: 0</p>
      </CardContent>
      <CardFooter>
        <p></p>
      </CardFooter>
    </Card>
  );
}
