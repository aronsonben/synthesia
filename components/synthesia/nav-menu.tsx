"use client"

import { usePathname } from "next/navigation";
import { CustomLink } from "@/components/ui/link";

export default function NavMenu() {
  const path = usePathname();

  /** NOTE: This won't work for Palettes and Home right now (3/19) */
  const setLinkVariant = (pageName: string) => {
    const leaf = path.split("/").pop();
    console.log(leaf);
    if (leaf === pageName.toLowerCase()) {
      return "active";
    } else {
      return "outline";
    }
  };

  return (
    <div id="DashboardNav" className="flex flex-col justify-between gap-2 w-full md:max-w-md">
      <div className="flex w-full">
        <CustomLink href="/synthesia" className="w-full" variant={setLinkVariant("Home")} size="synth">Home</CustomLink>
      </div>
      <div className="flex justify-between gap-2">
        <CustomLink href="/synthesia/manage" className="" variant={setLinkVariant("Manage")} size="synth">Manage</CustomLink>
        <CustomLink href="/synthesia" className="" variant={setLinkVariant("Palettes")} size="synth">Palettes</CustomLink>
        <CustomLink href="/explore" className="" variant={setLinkVariant("Explore")} size="synth">Explore</CustomLink>
        <CustomLink href="/profile" className="" variant={setLinkVariant("Profile")} size="synth">Profile</CustomLink>
      </div>
    </div>
  );
}