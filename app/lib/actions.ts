import { initPocketbaseFromCookie } from "./pb";

export async function updateTokenCount(tokenCount: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}) {
  const pb = await initPocketbaseFromCookie();
  
    try {
        await pb.collection('token_counts').update(pb.authStore.model!.id, {
            anthropic: tokenCount
        });
    } catch (error) {
        console.log(error);
    }

  return pb.authStore.model;
}

export async function getTokenCount() {
    const pb = await initPocketbaseFromCookie();

    try {
        const record = await pb.collection('token_counts').getOne(pb.authStore.model!.id);
        return record;
    } catch (error) {
        console.log(error);
    }
}