"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/config/site";
import { User, Link } from "@nextui-org/react";

export const Navbar = () => {

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
      <User
          name="Aidan McKenzie"
          description={(
            <Link href="https://github.com/RaiderRoss " size="sm" isExternal>
              @RaiderRoss
            </Link>
          )}
          avatarProps={{
            src: "https://avatars.githubusercontent.com/u/83859448?v=4",
          }}
        />
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      
      </NavbarContent>
    </NextUINavbar>
  );
};
