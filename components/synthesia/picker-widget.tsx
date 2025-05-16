"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { Track as TrackInterface } from "@/lib/interface";
import Link from "next/link";
import { CustomLink } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { addColorToTrack } from "@/actions/synthesia/actions";
import "@/components/ui/styles.css";
import { cn } from "@/lib/utils";
import ProgressSwatch from "./progress-swatch";
import AudioPlayer from "@/components/audio-player";

interface PickerWidgetProps {
  track: TrackInterface;
}

export default function PickerWidget({ track }: PickerWidgetProps) {
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const [usedPickerWidget, setUsedPickerWidget] = useState(false);

  const handleSubmit = async () => {
    const hexColor = hsvaToHex(hsva);
    await addColorToTrack(track, hexColor);
    
    // display message 
    setUsedPickerWidget(true);
  };

  return (
    <>
      <div className="flex flex-col my-4 mb-0 items-center gap-2">
        <Colorful
          color={hsva}
          disableAlpha={true}
          onChange={(color) => {
            setHsva(color.hsva);
          }}
          style={{ width: "300px" }}
        />
        <div
          className="flex items-center gap-2 w-full rounded-lg p-2 text-white"
          style={{ backgroundColor: hsvaToHex(hsva) }}
        >
          <p className="mix-blend-difference">
            {GetColorName(hsvaToHex(hsva))}
          </p>
          <p className="mix-blend-difference">
            {JSON.stringify(hsvaToHex(hsva)).substring(1, 8)}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between items-center gap-4 mt-4">
        {!usedPickerWidget ? (
          <Button
          onClick={handleSubmit}
          className="flex-1"
          size="sm"
        >
          Submit
        </Button>)
        : (
          <>
            <p className="flex-1 flex justify-center text-sm">Submitted!</p>
            {/* TODO: THIS IS HARDCODED, NEED TO CREATE PAGE FOR INDIVIDUAL TRACKS */}
            <CustomLink
                href={`/synthesia/stolimpico-full/palettes`}
                className="flex flex-1 bg-gradient-to-r from-red-500 to-blue-300 border-solid border border-black"
                size="sm"
              >
                View Palettes
              </CustomLink>
          </>
        )}
      </div>
    </>
  )
}