"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { Track as TrackInterface, TrackWithAnalysis } from "@/lib/interface";
import Link from "next/link";
import { CustomLink } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { addColorToTrack } from "@/actions/synthesia/actions";
import "@/components/ui/styles.css";
import { cn } from "@/lib/utils";
import ProgressSwatch from "./progress-swatch";
import AudioPlayer from "@/components/audio-player";
import Swatch from "../swatch";
import { revalidatePath } from "next/cache";

interface PickerWidgetProps {
  track: TrackWithAnalysis;
  hsva: { h: number; s: number; v: number; a: number; };
  setHsva: (hsva: { h: number; s: number; v: number; a: number; }) => void;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
  setColorName: (colorName: string) => void;
  tracksCompleted: TrackWithAnalysis[];
  setTracksCompleted: (tracksCompleted: TrackWithAnalysis[]) => void;
}

export default function PickerWidget({ track, hsva, setHsva, submitted, setSubmitted, setColorName, tracksCompleted, setTracksCompleted }: PickerWidgetProps) {
  const [usedPickerWidget, setUsedPickerWidget] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // 1. Save submitted hex color to db
    const hexColor = hsvaToHex(hsva);
    await addColorToTrack(track, hexColor);

    // 2. Fetch palette for current track via track object
    const palette = track.colors;

    // 3. Replace picker widget with palette display & button offering user to "pick again"
    setSubmitted(true);
    setColorName(GetColorName(hexColor));
    setTracksCompleted([...tracksCompleted, track]);

    // 4. Reset to base color
    // ** being done in home-wrapper **
  };

  return (
    <>
      {!usedPickerWidget ? (
        <>
          <div className="w-full flex flex-col mt-0 mb-0 items-center gap-2">
          <Colorful
            color={hsva}
            disableAlpha={true}
            onChange={(color) => {
              setHsva(color.hsva);
            }}
            style={{ width: "100%" }}
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
          <Button
            onClick={handleSubmit}
            className="flex-1"
            size="sm"
          >
            Submit
          </Button>
        </div>
      </>
      ) : (
        <>
          <div className="flex flex-wrap w-full">
            <Swatch swatch={track.colors} size="md" />
          </div>
          <div className="flex w-full justify-between items-center gap-4 mt-4">
          <Button
            onClick={() => setUsedPickerWidget(false) }
            className="flex-1"
            size="sm"
          >
            Pick Again
          </Button>
        </div>
        </>
      )}
    </>
  )
}