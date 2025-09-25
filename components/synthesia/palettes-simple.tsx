"use client";

import { useEffect, useState } from "react";
import { Track as TrackInterface, TrackWithAnalysis } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";
import AudioPlayerButton from "@/components/audio-play-button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import chroma from "chroma-js";
import "@/components/ui/styles.css";

export const ColorBlock = (color: string) => (
    <div
      className="flex w-6 h-6"
      style={{ 
        backgroundColor: color,
        border: "1px solid black"
      }}
    ></div>
)

/**
 * Simplifiying the palettes page specifically for STOLIMPICO (Sept. '25)
 */
export default function PalettesSimple({ tracks }: { tracks: TrackWithAnalysis[] }) {
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
    <div className="h-1/2 flex flex-col items-center justify-between w-full pt-8" id="palettes">
      <div className="flex flex-col items-center justify-center py-2 gap-2">
        <h2 className="text-2xl font-bold">Palettes</h2>
        <p className="text-xs">Note: white is ignored in color analysis</p>
        {/* <Button onClick={sortByDeltaE}>Sort by Delta E</Button> */}
      </div>
      <div id="palettes-holder" className="flex flex-col w-[90vw] md:w-full md:justify-center md:items-center">
        {tracks.map((track) => {
          const analysis = track.colorAnalysis;
          const hue = analysis.averageHue.toFixed(2);
          const saturation = (analysis.averageSaturation * 100).toFixed(2);
          const lightness = (analysis.averageLightness * 100).toFixed(2);
          return(
            <div
              id={`palette_card_${track.id}`}
              key={track.id}
              className="flex flex-col flex-wrap gap-2 p-4 my-2 border rounded-lg w-full bg-white dark:bg-gray-800 md:max-w-lg "
            >
              <div id="audio_wrapper" className="flex my-2 items-center justify-start content-center gap-4">
                <AudioPlayerButton link={track.link} track={track} />
                <div className="flex flex-col">
                  <h5>stoic da poet</h5>
                  <h4 className="font-bold">{track.title}</h4>
                </div>
              </div>
              {/* Color Palette Swatch Display */}
              <div className="flex flex-wrap w-full">
                <Swatch swatch={track.colors} size="md" />
              </div>
              {/* Color Analysis Display */}
              <div className="flex flex-col flex-wrap w-full my-2">
                <p className="text-xs">Average Hue: {hue}</p>
                <p className="text-xs">Average Saturation: {saturation}%</p>
                <p className="text-xs">Average Lightness: {lightness}%</p>
                <div className="flex items-center my-1 gap-2">
                  <span className="text-xs">Average Color (based on hsl): </span>
                  <div
                    className="flex w-6 h-6"
                    style={{ 
                      backgroundColor: `hsl(${hue}deg ${saturation}% ${lightness}%)`,
                      border: "1px solid black"
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )})}
      </div>
      <div className="flex items-center justify-center p-4">
        <Link href={"/"} className="text-sm text-gray-500 underline">Home</Link>
      </div>
    </div>
  );
}
