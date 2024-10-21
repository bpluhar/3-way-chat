import { initPocketbaseFromCookie, initPocketBaseFromRequest } from "./pb";
import { NextRequest } from "next/server";

type TokenCount = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

type TokenCountUpdate = {
  openai?: TokenCount;
  anthropic?: TokenCount;
  google?: TokenCount;
};

export async function getUser() {
  const pb = await initPocketbaseFromCookie();
  return pb.authStore.model;
}

export async function getTokenUsageLogs(request: NextRequest) {
  const pb = await initPocketBaseFromRequest(request);
  return pb.collection("token_usage_logs").getFullList({
    filter: `user_id = "${pb.authStore.model?.id}"`,
    sort: "-created",
  });
}

export async function updateTokenUsageLogs(tokenCount: TokenCountUpdate) {
  const pb = await initPocketbaseFromCookie();
  
  try {
    if (!pb.authStore.model?.id) {
      throw new Error("User not authenticated");
    }

    await pb.collection("token_usage_logs").create({
      token_count: tokenCount,
      user_id: pb.authStore.model?.id,
    });

    

  } catch (error) {
    console.error("Error updating token usage logs:", error);
    throw error;
  }

}

export async function updateTokenCount(tokenCount: TokenCountUpdate) {
  const pb = await initPocketbaseFromCookie();

  try {
    if (!pb.authStore.model?.id) {
      throw new Error("User not authenticated");
    }

    // Get the existing record

    const existingRecord = await pb
      .collection("token_counts")
      .getOne(pb.authStore.model.id)
      .catch(() => null);

    const updatedData: TokenCountUpdate = {};

    for (const [provider, count] of Object.entries(tokenCount)) {
      if (existingRecord && existingRecord[provider]) {
        updatedData[provider as keyof TokenCountUpdate] = {
          promptTokens: existingRecord[provider].promptTokens +
            count.promptTokens,
          completionTokens: existingRecord[provider].completionTokens +
            count.completionTokens,
          totalTokens: existingRecord[provider].totalTokens + count.totalTokens,
        };
      } else {
        updatedData[provider as keyof TokenCountUpdate] = count;
      }
    }

    if (existingRecord) {
      await pb
        .collection("token_counts")
        .update(pb.authStore.model.id, updatedData);

      await updateTokenUsageLogs(tokenCount);

    } else {
      await pb.collection("token_counts").create({
        ...updatedData,
        id: pb.authStore.model.id,
      });
    }
  } catch (error) {
    console.error("Error updating token count:", error);
    throw error;
  }

  return pb.authStore.model;
}

export async function getTokenCount() {
  const pb = await initPocketbaseFromCookie();

  try {
    if (!pb.authStore.model?.id) {
      throw new Error("User not authenticated");
    }

    const record = await pb
      .collection("token_counts")
      .getOne(pb.authStore.model.id);

    return record;
  } catch (error) {
    const timestamp = new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(
      /(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+):(\d+)/,
      "$1/$2/$3 - $4:$5:$6",
    );

    console.error(
      "\x1b[31m%s\x1b[0m",
      `[${timestamp}] > Error getting token count: ${error}`,
    );
    return null;
  }
}

export async function createTokenCount() {
  const pb = await initPocketbaseFromCookie();

  try {
    await pb.collection("token_counts").create({
      id: pb.authStore.model?.id,
      openai: { completionTokens: 0, promptTokens: 0, totalTokens: 0 },
      anthropic: { completionTokens: 0, promptTokens: 0, totalTokens: 0 },
      google: { completionTokens: 0, promptTokens: 0, totalTokens: 0 },
    });

    console.info("Token count created successfully");
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status !== 400) {
      console.error("Error creating token count in PocketBase");
    } else if (
      error instanceof Error && "status" in error && error.status === 400
    ) {
      console.error("Token count already exists in PocketBase");
    }
  }
}
