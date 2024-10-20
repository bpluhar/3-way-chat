import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard - Chat",
  description: "Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies().get("pb_auth");

  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error("Not logged in");

  return (
    <>
      {children}
    </>
  );
}
