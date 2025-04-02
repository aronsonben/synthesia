import { useState } from "react";
import { cn } from "@/lib/utils";

type ProgressSwatchProps = {
  previousColor: string;
  currentColor: string;
  nextColor: string;
  totalTracks: number;
  currentTrackIndex: number;
  getColor: (index: number) => string;
};

type SwatchBoxProps = {
  boxIndex: number;
  isCurrent: boolean;
  getColor: (index: number) => string;
}

const SwatchBox = ({ boxIndex, isCurrent, getColor }: SwatchBoxProps) => {
  const boxShadow = "inset 0 0 2px 2px #d3d3d3";
  return (
    <div
      className="w-6 h-6 border border-black"
      style={{ 
        backgroundColor: getColor(boxIndex),
        boxShadow: isCurrent ? boxShadow : undefined
      }}
    />
  )
}

export default function ProgressSwatch({
  previousColor,
  currentColor,
  nextColor,
  totalTracks,
  currentTrackIndex,
  getColor,
}: ProgressSwatchProps) {
  const isFirstTrack = currentTrackIndex === 0;
  const isLastTrack = currentTrackIndex === totalTracks - 1;

  const boxShadowStyle = { boxShadow: "inset 0 0 2px 2px #d3d3d3" };
  const boxShadow = "inset 0 0 2px 2px #d3d3d3";

  if (totalTracks === 1) {
    return null;
  }

  if (totalTracks === 2) {
    return (
      <div className="flex flex-row items-center gap-2">
        <span className="text-xs">{currentTrackIndex}</span>
        <div
            className="w-6 h-6 border border-black"
            style={{ 
              backgroundColor: getColor(0), 
              boxShadow: currentTrackIndex === 0 ? boxShadow : undefined, 
            }}
          ></div>
        <div
          className="w-6 h-6 border border-black"
          style={{ 
            backgroundColor: getColor(1) ,
            boxShadow: currentTrackIndex === 1 ? boxShadow : undefined,
          }}
        ></div>
        <span className="text-xs">{totalTracks - 1}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <span className="text-xs">{currentTrackIndex}</span>
      <SwatchBox boxIndex={isFirstTrack ? 0 : currentTrackIndex-1} isCurrent={isFirstTrack} getColor={getColor}  />
      <SwatchBox boxIndex={currentTrackIndex} isCurrent={!isFirstTrack && !isLastTrack} getColor={getColor}  />
      <SwatchBox boxIndex={isLastTrack ? totalTracks-1 : currentTrackIndex+1} isCurrent={isLastTrack} getColor={getColor}  />
      <span className="text-xs">{totalTracks - 1}</span>
    </div>
  );
}
