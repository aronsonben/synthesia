"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import Tracks from "@/components/synthesia/tracks";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";

interface TracksProps {
  tracks: TrackInterface[];
  user: { id: string };
  pages: PickerPage[];
}

export default function ArtistHome({ tracks, user, pages }: TracksProps) {
  const [userHasPublicPage, setUserHasPublicPage] = useState(false);
  const [userPublicPage, setUserPublicPage] = useState("");
  const [isManageMode, setIsManageMode] = useState(false);

  useEffect(() => {
    if (pages.length > 0) {
      setUserHasPublicPage(true);
      {/* Change this eventually to accommodate for each user having multiple pages */};
      setUserPublicPage(pages[0].page_name);
    }
  }, [pages]);

  const toggleManageMode = () => {
    setIsManageMode(!isManageMode);
  };

  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center p-4">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-semibold text-2xl">Synthesia</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Welcome to synthesia. Upload your tracks, then create a public page to
          crowdsource color palettes for your songs.
        </p>
      </div>
      {tracks.length !== 0 && userHasPublicPage ? (
        <div className="flex flex-col w-full border rounded-lg shadow-lg p-4 bg-blue-200 dark:bg-blue-600">
          <p className="flex justify-center text-black dark:text-white font-bold underline">
            <Link href={"/synthesia/" + userPublicPage}>
              View your public page
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4 mb-4 border rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-xs italic">
            Your tracks aren't public yet! Create a public page to get started
            crowdsourcing color palettes for your music.
          </p>
          <Link href="/synthesia/publish" className="text-sm underline">
            Publish Tracks
          </Link>
        </div>
      )}
      <div
        className="flex flex-col w-full border rounded-lg shadow-lg p-4"
        id="manage-tracks"
      >
        <h2 className="text-xl font-bold">Manage Tracks</h2>
        {tracks.length === 0 ? (
          <>
            <p className="text-xs py-2 text-gray-500 dark:text-gray-400 italic">
              Add some tracks to get started!
            </p>
            <AddTrack />
          </>
        ) : (
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
        )}
      </div>
    </main>
  );
}
