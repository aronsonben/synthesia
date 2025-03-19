"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import Tracks from "@/components/synthesia/tracks";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";
import { CustomLink } from "@/components/ui/link";

interface TracksProps {
  tracks: TrackInterface[];
  user: { id: string };
  pages: PickerPage[];
}

export default function ArtistHome({ tracks, user, pages }: TracksProps) {
  const [userHasPublicPage, setUserHasPublicPage] = useState(false);
  const [userPublicPage, setUserPublicPage] = useState("");
  const [isManageMode, setIsManageMode] = useState(false);
  const router = useRouter();

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
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl font-bold">Manage Campaigns</h2>
        <div className="flex flex-col gap-2 border rounded-lg">
          {pages.length > 0 ? (
            pages.map((page, index) => (
              <div key={index} className="flex justify-between items-center p-4">
                pageName
              </div>
            ))
          ) : ( 
            <>
            <div className="flex justify-between items-center p-4 border-b text-sm">
              <p>Campaign 1</p>
              <p>5 tracks</p>
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex justify-between items-center p-4 border-b text-sm">
              <p>Campaign 2</p>
              <p>4 tracks</p>
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">View</Button>
            </div>
            <div className="flex justify-between items-center p-4 border-b text-xs text-gray-400">
              <p>You have no Campaigns. Create new Campaign now.</p>
            </div>
            </>
          )}
        </div>
        <Button onClick={() => router.push("/synthesia/publish")} className="mt-2 mb-4" size="sm">Create new Campaign</Button>
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
