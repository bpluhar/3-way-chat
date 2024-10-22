//"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { getUser } from "@/app/lib/actions";
import Image from "next/image";

export default async function DashboardMenuBar() {
  const user = await getUser();

  const avatarUrl =
    `https://pocket.leaselogic.app/api/files/${user?.collectionId}/${user?.id}/${user?.avatar}`;

  return (
    <>
      {avatarUrl.length >
          `https://pocket.leaselogic.app/api/files/_pb_users_auth_/${user?.id}/`
            .length
        ? (
        <Image src={avatarUrl} alt="User Avatar" width={40} height={40} className="rounded-full" />
      ) : null}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Usage
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Settings
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
