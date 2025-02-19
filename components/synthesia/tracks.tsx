"use client";

import { useEffect, useState } from "react";
import { editTrack } from "@/actions/synthesia/actions";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";
import PublishTracks from "./publish-tracks";
import Accordion from "../ui/accordion";
import Track from "./track";
import { Track as TrackInterface } from "@/lib/interface";

interface TracksProps {
  tracks: TrackInterface[];
  user: { id: string };
}

/** TODO: Bring back some of the client component code to here now that I've
 * shifted the fetching of track & user data to the synthesia page component.
 */
export default function Tracks({ tracks, user }: TracksProps) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);
  const [tracksIsEmpty, setTracksIsEmpty] = useState(userTracks.length === 0);

  useEffect(() => {
    setUserTracks(tracks.filter((track) => track.user_id == user.id));
    setTracksIsEmpty(userTracks.length === 0);
  }, [tracks]);

  const toggleManageMode = () => {
    setIsManageMode(!isManageMode);
  };

  const handleEditTrack = async (track: TrackInterface) => {
    await editTrack(track);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Manage Tracks</h2>
        {userTracks.length === 0 ? (
          <>
            <p className="text-xs py-2 text-gray-500 dark:text-gray-400">
              <i>Add some tracks to get started!</i>
            </p>
            <AddTrack />
          </>
        ) : (
          <>
            <Button onClick={toggleManageMode} className="mt-2 mb-4">
              {isManageMode ? "Disable Manage Mode" : "Enable Manage Mode"}
            </Button>
            {tracks &&
              userTracks.map((track) => (
                <div className="flex my-0 items-center" key={track.id}>
                  <Accordion
                    key={track.id}
                    trackTitle={track.title}
                    track={track}
                    onEditTrack={handleEditTrack}
                    className="track"
                    type="single"
                    defaultValue="track-1"
                    collapsible
                    disabled={!isManageMode}
                  />
                </div>
              ))}
            {isManageMode && (
              <div className="flex my-0 items-center">
                <AddTrack />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
