"use client";

import { logout } from "@/app/auth/action";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    //   <button
    //   onClick={() => logout()}
    //   className="bg-[#101516] hover:bg-[#1c2526] text-red-800 font-bold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#060F11] border border-red-800"
    // >
    //   Logout
    // </button>
    <Button onClick={() => logout()}>Logout</Button>
  );
}
