// ./app/actions.ts

"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { initPocketbaseFromCookie } from "../lib/pb";
import { createTokenCount } from "../lib/actions";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const pb = await initPocketbaseFromCookie();

    // I would create a zod schema here to validate the email and password.
    // Too lazy for now.... look above for example of data validation.
    await pb
      .collection("users")
      .authWithPassword(
        formData.get("email") as string,
        formData.get("password") as string,
      );

    if (pb.authStore.isValid) {
      cookies().set("pb_auth", pb.authStore.exportToCookie());
      await createTokenCount();
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
