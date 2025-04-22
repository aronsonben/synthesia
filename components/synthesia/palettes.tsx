"use client";

import { useEffect, useState } from "react";
import { Track as TrackInterface } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";
import Swatch from "@/components/swatch";
import Link from "next/link";
import chroma from "chroma-js";
import "@/components/ui/styles.css";

interface PalettesProps {
  tracks: TrackInterface[];
  user?: { id: string };
}

export default function Palettes({ tracks, user }: PalettesProps) {
  // const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);
  const [sort, setSort] = useState("chronological");

  // useEffect(() => {
  //   setUserTracks(tracks.filter((track) => track.user_id == user.id));
  // }, [tracks]);

  const sortByDeltaE = () => {
    setSort("deltaE");
    // userTracks.map((tracks) => {
    //   tracks.colors.sort((a, b) => {
    //     const deltaA = chroma.deltaE(a, "#ffffff");
    //     const deltaB = chroma.deltaE(b, "#ffffff");
    //     return deltaA - deltaB;
    //   });
    //   // tracks.colors.reverse();
    // });
  };

  return (
    <div className="h-1/2 flex flex-col items-center justify-between w-full" id="palettes">
      <div className="flex flex-col items-center justify-center py-2">
        <h2 className="text-2xl font-bold">Palettes</h2>
        {/* <p className="text-sm">Sorted by: chronological</p> */}
        {/* <Button onClick={sortByDeltaE}>Sort by Delta E</Button> */}
      </div>
      <div className="flex flex-col w-full">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex flex-col flex-wrap gap-2 p-4 my-2 border rounded-lg w-full"
          >
            <div id="audio_wrapper" className="flex flex-col my-4 mt-2 items-start justify-start gap-2">
              <AudioPlayer track={track.link} />
            </div>
            <h4 className="font-bold">Track {track.id}</h4>
            <div className="flex flex-wrap w-full">
              <Swatch swatch={track.colors} size="md" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center p-4">
        <Link href={"/synthesia"} className="text-sm text-gray-500 underline">Home</Link>
      </div>
    </div>
  );
}
