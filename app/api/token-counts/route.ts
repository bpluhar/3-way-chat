import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTokenCount } from "@/app/lib/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cookie = cookies().get("pb_auth");

  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error("Not logged in");

  try {
    const data = await getTokenCount();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      {
        status: 500,
      },
    );
  }
}
