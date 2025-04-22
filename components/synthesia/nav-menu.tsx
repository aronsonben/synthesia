"use client"

import { usePathname } from "next/navigation";
import { CustomLink } from "@/components/ui/link";
import { Button } from "@/components/ui/button";

export default function NavMenu() {
  const path = usePathname();
  // INCREDIBLY JANKY MANNER OF DETERMINING IF THIS IS A COLOR PICKER PAGE !!!!!! CHANGE!!! TEMP ONLY!!
  const pathIsColorPickerPage = (path.includes("synthesia") && (path.includes("stolimpico-full") || path.includes("benito")));
  const pathIsPalettePage = path.includes("palettes");
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
    <div id="DashboardNav" className="flex flex-col justify-between gap-2 w-full sm:max-w-[70vw] sm:justify-center">
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
      {pathIsPalettePage && (
        <div className="flex gap-2 w-full">
          <Button size="synth" variant="outline2" className="w-full" onClick={() => window.history.back()}>
            ← Back
          </Button>
          {/* TEMP: Eventually should go to profile page or some other summary page */}
          <CustomLink href="/explore" className="w-full" variant={setLinkVariant("Explore")} size="synth">Next</CustomLink>
        </div>
      )}
    </div>
  );
}