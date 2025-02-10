"use client";

import { useEffect, useState } from "react";
import { Track as TrackInterface } from "@/lib/interface";
import { editTrack } from "@/actions/synthesia/actions";
import { Button } from "@/components/ui/button";
import AddTrack from "./add-track";
import PublishTracks from "./publish-tracks";
import Accordion from "../ui/accordion";
import Track from "./track";

interface ManageTracksToggleProps {
  tracks: TrackInterface[];
  user: { id: string };
}

export default function ManageTracksToggle({
  tracks,
  user,
}: ManageTracksToggleProps) {
  const [isManageMode, setIsManageMode] = useState(false);
  const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);

  useEffect(() => {
    setUserTracks(tracks.filter((track) => track.user_id == user.id));
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
        <Button onClick={toggleManageMode} className="mt-2 mb-4">
          {isManageMode ? "Disable Manage Mode" : "Enable Manage Mode"}
        </Button>
        {isManageMode && (
          <div className="flex my-4 items-center gap-4">
            <AddTrack />
          </div>
        )}
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
          <div className="flex my-4 items-center gap-4">
            <PublishTracks />
          </div>
        )}
      </div>
    </div>
  );
}
