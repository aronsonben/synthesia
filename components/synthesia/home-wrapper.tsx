"use client";

import { useState } from "react";
import { hsvaToHex } from "@uiw/color-convert";
import { Track as TrackInterface, Profile } from "@/lib/interface";
import AudioPlayer from "@/components/audio-player";
import PickerWidget from "./picker-widget";
import { CustomLink } from "@/components/ui/link";

interface HomeWrapperProps {
  track: TrackInterface;
  trackUser: Profile;
}

export default function HomeWrapper({ track, trackUser }: HomeWrapperProps) {
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });

  const backgroundColor = hsvaToHex(hsva);

  return (
    <main 
      className="flex flex-col gap-8 p-4 justify-start items-center transition-colors duration-300 h-full"
      style={{ backgroundColor }}
    >
      <div className="w-full flex flex-col justify-center items-center gap-8">
        <div id="campaign-widget" className="flex flex-col justify-center items-center gap-2 w-full p-4 border-gray-200 sm:max-w-sm bg-white/90 backdrop-blur-sm rounded-lg">
          <div className="w-full lex flex-col items-start justify-start gap-2">
            <p className="text-xs">Listen to the track...</p>
          </div>
          <AudioPlayer track={track} user={trackUser} />
          <div className="w-full flex flex-col items-end justify-end gap-2 mt-4 mb-0">
            <p className="text-xs">...then select the color you hear:</p>
          </div>
          <PickerWidget track={track} hsva={hsva} setHsva={setHsva} />
          <CustomLink href={"/palettes"} variant="outline" size="synth" className="w-full">View Palettes</CustomLink>
        </div>
      </div>
    </main>
  );
}