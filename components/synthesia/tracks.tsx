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
  manageMode?: boolean;
  variant?: "default" | "tight";
}

export default function Tracks({ tracks, user, manageMode = false, variant = "default" }: TracksProps) {
  const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);

  useEffect(() => {
    setUserTracks(tracks.filter((track) => track.user_id == user.id));
  }, [tracks]);

  const handleEditTrack = async (track: TrackInterface) => {
    await editTrack(track);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex flex-col">
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
                rootVariant={variant}
                triggerVariant={variant}
                collapsible
                disabled={!manageMode}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
