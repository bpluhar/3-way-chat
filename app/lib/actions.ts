import { initPocketbaseFromCookie } from "./pb";

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

export async function updateTokenCount(tokenCount: TokenCountUpdate) {
  const pb = await initPocketbaseFromCookie();

  try {
    if (!pb.authStore.model?.id) {
      throw new Error("User not authenticated");
    }

    const existingRecord = await pb
      .collection("token_counts")
      .getOne(pb.authStore.model.id)
      .catch(() => null);

    const updatedData: TokenCountUpdate = {};

    for (const [provider, count] of Object.entries(tokenCount)) {
      if (existingRecord && existingRecord[provider]) {
        updatedData[provider as keyof TokenCountUpdate] = {
          promptTokens:
            existingRecord[provider].promptTokens + count.promptTokens,
          completionTokens:
            existingRecord[provider].completionTokens + count.completionTokens,
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
    console.error("Error getting token count:", error);
    return null;
  }
}
