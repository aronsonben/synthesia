"use client"

import { usePathname } from "next/navigation";
import { CustomLink } from "@/components/ui/link";

export default function NavMenu() {
  const path = usePathname();
  // INCREDIBLY JANKY MANNER OF DETERMINING IF THIS IS A COLOR PICKER PAGE !!!!!! CHANGE!!! TEMP ONLY!!
  const pathIsColorPickerPage = path.includes("synthesia") && (path.includes("stolimpico-full") || path.includes("benito"));
  
  const setLinkVariant = (pageName: string) => {
    const leaf = path.split("/").pop();
    if (leaf === "synthesia" && pageName === "Home") {
      return "active";
    } else if (pageName === "Profile" && path.includes("profile")) {
      return "active";
    } else if (leaf === pageName.toLowerCase()) {
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
      {!pathIsColorPickerPage && (
      <div className="flex justify-between gap-2">
        <CustomLink href="/synthesia/manage" className="" variant={setLinkVariant("Manage")} size="synth">Manage</CustomLink>
        <CustomLink href="/synthesia" className="" variant={setLinkVariant("Palettes")} size="synth">Palettes</CustomLink>
        <CustomLink href="/explore" className="" variant={setLinkVariant("Explore")} size="synth">Explore</CustomLink>
        <CustomLink href="/profile" className="" variant={setLinkVariant("Profile")} size="synth">Profile</CustomLink>
      </div>
      )}
    </div>
  );
}