import Link from "next/link";
import Swatch from "@/components/swatch";
import { redirect } from "next/navigation";
import { getUserData } from "@/utils/supabase/fetchData";
import { Button } from "@/components/ui/button";

export default async function SynthesiaHome() {
  const user = await getUserData();

  // Removing auth as part of simplification process (Sept '25)
  // if (!user) {
  //   return redirect("/");
  // }

  return (
    <div>
      <div id="DashboardStats" className="flex flex-col gap-2 bg-[rgba(48,125,165,0.15)] border border-solid border-[rgba(48,125,165,0.25)] p-4 rounded-md w-full">
          <div className="flex justify-between gap-2 items-center align-center">
            <h2 className="font-bold text-lg">Your Stats</h2>
            <p className="underline text-sm">View my Campaigns</p>
          </div>
          <div className="flex justify-between gap-4 items-center align-center h-12">
            {/* TODO: Eventually render these dynamically (3/12) */}
            <div id="IndividualDashboardStat" className="flex justify-start items-center align-center gap-6 flex-1">
              <h2 className="font-bold text-3xl">1</h2>
              <p className="text-xs">Campaign</p>
            </div>
            <div id="IndividualDashboardStat" className="flex justify-start items-center align-center gap-6 flex-1">
              <h2 className="font-bold text-3xl">6</h2>
              <p className="text-xs">Responses</p>
            </div> 
          </div>
      </div>
      <div id="DashboardTrack" className="flex flex-col gap-2 bg-[rgba(48,125,165,0.15)] border border-solid border-[rgba(48,125,165,0.25)] p-4 rounded-md w-full">
          <div className="flex justify-between gap-2 items-center align-center">
            <h2 className="font-bold text-lg">Featured Palette</h2>
            <p className="underline text-xs">View my Palettes</p>
          </div>
          <div className="flex justify-between gap-4 items-center align-center h-12 w-full">
            <p className="text-xs">{">"}</p>
            <Swatch swatch={["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"]} size="sm"/>
          </div>
      </div>
      <div id="DashboardExplore" className="flex flex-col gap-2 bg-[rgba(48,125,165,0.15)] border border-solid border-[rgba(48,125,165,0.25)] p-4 rounded-md w-full">
          <div className="flex justify-between gap-2 items-center align-center">
            <h2 className="font-bold text-lg">Featured Explore</h2>
            <p className="underline text-xs">View all Explore</p>
          </div>
          <div className="flex justify-between gap-4 items-center align-center h-12 w-full">
            <p className="text-xs">{">"}</p>
            <Swatch swatch={["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"]} size="sm"/>
          </div>
      </div>
      <div id="DashboardManage" className="flex flex-col gap-2 bg-[rgba(48,125,165,0.15)] border border-solid border-[rgba(48,125,165,0.25)] p-4 rounded-md w-full">
          <Button className="" variant="outline" size="lg">Manage my Tracks</Button>
      </div>
      <div>
        <h2 className="font-bold text-lg">I want to...</h2>
        <ul className="flex flex-col text-sm underline gap-2 py-2">
          <li>
            <Link href="/synthesia/manage">[Artist] Upload my tracks to start crowdsourcing a color palette</Link>
          </li>
          <li>
            <Link href="/explore">[Audience] View other users' tracks and color palettes (WIP)</Link>
          </li>
          <li>
            <Link href="/profile">[All] Edit my profile</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
