"use client";

import { Menubar, MenubarTrigger, MenubarContent, MenubarItem, MenubarMenu } from "@/components/ui/menubar";
import { logout } from "@/app/auth/action";

export default function DashboardMenuBar() {
    return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="text-black">Settings</MenubarTrigger>
            <MenubarContent>            
              <MenubarItem className="text-red-500" onClick={() => logout()}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
    );
}