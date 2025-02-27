"use client";

import { useEffect, useState } from "react";
import { Track as TrackInterface } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import "@/components/ui/styles.css";

interface ExploreProps {
  tracks: TrackInterface[];
  user?: { id: string };
}

export default function Explore({ tracks, user }: ExploreProps) {
  const [randomTrack, setRandomTrack] = useState<TrackInterface>(tracks[0]);

  useEffect(() => {
    const filteredTracks = tracks.filter(track => track.colors.length > 1);
    if (filteredTracks.length > 0) {
      const randomTrackPick = filteredTracks[Math.floor(Math.random() * filteredTracks.length)];
      setRandomTrack(randomTrackPick);
    }
  }, [tracks]);

  return (
    <div className="flex flex-col items-start justify-start m-4">
      <h1 className="text-xl font-bold">Synthesia</h1>
      <div className="flex flex-col my-4 gap-4">
        <h2>A random crowd-sourced color palette: </h2>
        <div className="flex flex-col gap-4 p-4 box-border bg-slate-100 rounded-sm">
          <h4 className="font-bold text-lg">{randomTrack.title}</h4>
          {/* <h4 className="text-sm">{randomTrack.user_id}</h4> */}
          <Swatch swatch={randomTrack?.colors} />
            <audio controls>
            <source src={randomTrack.link} type="audio/mpeg" />
            Your browser does not support the audio element.
            </audio>
        </div>
      </div>
      <div className="flex flex-col my-4">
        <h2>Users on Synthesia: </h2>
        <span className="italic">placeholder</span>
      </div>
    </div>
  );
}
