// ./app/actions.ts

"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { initPocketbaseFromCookie } from "../lib/pb";
import { createTokenCount } from "../lib/actions";
import { loginSchema } from "../lib/schemas";
import { z } from "zod";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const validatedFields = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const pb = await initPocketbaseFromCookie();

    await pb
      .collection("users")
      .authWithPassword(validatedFields.email, validatedFields.password);

    
      
    if (pb.authStore.isValid) {
      cookies().set("pb_auth", pb.authStore.exportToCookie());
      await createTokenCount();
    }

    return "ok";
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error("Validation error:", error.errors);
      return "ValidationError";
    }
    console.error("Authentication error:", error);
    return "AuthError";
  }
}

export async function logout() {
  cookies().delete("pb_auth");
  redirect("/");
}
