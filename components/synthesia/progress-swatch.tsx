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

export default function ProgressSwatch({
  previousColor,
  currentColor,
  nextColor,
  totalTracks,
  currentTrackIndex,
  getColor,
}: ProgressSwatchProps) {
  if (totalTracks === 1) {
    return null;
  }

  const boxShadowStyle = { boxShadow: "inset 0 0 2px 2px #d3d3d3" };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {currentTrackIndex === 0 && totalTracks > 2 ? (
          <div
            className="flex items-center gap-2"
            id={"farleft-block-" + currentTrackIndex}
          >
            <span className="text-xs">{currentTrackIndex}</span>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(0), ...boxShadowStyle }}
            ></div>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(1) }}
              id="center-block"
            ></div>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(2) }}
              id="right-block"
            ></div>
            <span className="text-xs">{totalTracks - 1}</span>
          </div>
        ) : currentTrackIndex === totalTracks - 1 && totalTracks > 2 ? (
          <div
            className="flex items-center gap-2"
            id={"farright-block-" + currentTrackIndex}
          >
            <span className="text-xs">{currentTrackIndex}</span>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(totalTracks - 3) }}
            ></div>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(totalTracks - 2) }}
              id="center-block"
            ></div>
            <div
              className="w-6 h-6 border border-black"
              style={{ backgroundColor: getColor(totalTracks - 1), ...boxShadowStyle }}
              id="right-block"
            ></div>
            <span className="text-xs">{totalTracks - 1}</span>
          </div>
        ) : (
          <>
            <div
              className="flex items-center gap-1"
              id={"left-block-" + currentTrackIndex}
            >
              <span className="text-xs">{currentTrackIndex}</span>
              <div
                className="w-6 h-6 border border-black"
                style={{
                  backgroundColor: getColor(currentTrackIndex - 1),
                }}
              ></div>
            </div>
            <div
              className="w-6 h-6 border border-black"
              style={{
                backgroundColor: getColor(currentTrackIndex),
                ...boxShadowStyle,
              }}
              id="center-block"
            ></div>
            <div className="flex items-center gap-1" id="right-block">
              <div
                className="w-6 h-6 border border-black"
                style={{ backgroundColor: getColor(currentTrackIndex + 1) }}
              ></div>
              <span className="text-xs">{totalTracks - 1}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
