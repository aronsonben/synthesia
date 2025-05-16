"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import Tracks from "@/components/synthesia/tracks";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";
import ManageTable from "@/components/synthesia/manage-table";

interface TracksProps {
  tracks: TrackInterface[];
  user: { id: string };
  campaigns: PickerPage[];
}

export default function ArtistHome({ tracks, user, campaigns }: TracksProps) {
  const [isManageMode, setIsManageMode] = useState(false);
  const router = useRouter();

  const toggleManageMode = () => {
    setIsManageMode(!isManageMode);
  };

  console.log("campaign count for user: ", campaigns);

  return (
    <main className="h-1/2 w-full flex flex-col gap-4 items-center justify-center">
      <ManageTable type="campaigns" tracks={tracks} campaigns={campaigns} />
      <ManageTable type="tracks" tracks={tracks} campaigns={campaigns} />
      {/* v0 code */}
      {/* <div
        className="flex flex-col w-full border rounded-lg shadow-lg p-4"
        id="manage-tracks"
      >
        <h2 className="text-xl font-bold">Manage Tracks</h2>
        <>
          <Button onClick={toggleManageMode} className="mt-2 mb-4">
            {isManageMode ? "Disable Manage Mode" : "Enable Manage Mode"}
          </Button>
          <Tracks tracks={tracks} user={user} manageMode={isManageMode} />
          {isManageMode && (
            <div className="flex my-0 items-center">
              <AddTrack />
            </div>
          )}
        </>
      </div> */}
    </main>
  );
}
