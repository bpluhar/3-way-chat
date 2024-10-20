// ./app/actions.ts

"use server";

import { redirect } from "next/navigation";
import PocketBase from "pocketbase";
import { cookies } from "next/headers";
import { initPocketbaseFromCookie } from "../lib/pb";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: server-side validation

  const pb = new PocketBase(process.env.POCKETBASE_URL);

  const { token, record: model } = await pb
    .collection("users")
    .authWithPassword(email, password);

  const cookie = JSON.stringify({ token, model });

  try {
    await pb.collection("token_counts").create({
      id: model.id,
      openai: { "completionTokens": 0, "promptTokens": 0, "totalTokens": 0 },
      anthropic: { "completionTokens": 0, "promptTokens": 0, "totalTokens": 0 },
      google: { "completionTokens": 0, "promptTokens": 0, "totalTokens": 0 },
    });
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 400) {
      console.error("Error creating token count in PocketBase:", error);
    }
  }

  cookies().set("pb_auth", cookie, {
    secure: true,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
  });

  redirect("/dashboard");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const pb = await initPocketbaseFromCookie();

    // I would create a zod schema here to validate the email and password.
    // Too lazy for now.... look above for example of data validation.
    await pb.collection("users").authWithPassword(
      formData.get("email") as string,
      formData.get("password") as string,
    );

    if (pb.authStore.isValid) {
      cookies().set("pb_auth", pb.authStore.exportToCookie());
    }

    return "ok";
  } catch (error) {
    console.log(error);

    return "AuthError";
  }
}

export async function logout() {
  cookies().delete("pb_auth");
  redirect("/");
}
