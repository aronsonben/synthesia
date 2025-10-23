"use client";


import { Colorful } from "@uiw/react-color";
import { hsvaToHex } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { TrackWithAnalysis } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import { addColorToTrack } from "@/actions/synthesia/actions";
import { HSVA } from "./home-wrapper.types";
import Swatch from "../swatch";
import "@/components/ui/styles.css";

interface PickerWidgetProps {
  track: TrackWithAnalysis;
  hsva: HSVA;
  setHsva: (hsva: HSVA) => void;
  onSubmit: (color: string, colorName: string) => void;
  onColorChange: (hsva: HSVA) => void;
}

export default function PickerWidget({ track, hsva, setHsva, onSubmit, onColorChange }: PickerWidgetProps) {
  const handleColorChange = (color: any) => {
    const newHsva = color.hsva;
    setHsva(newHsva);
    onColorChange(newHsva);
  };

  const handleSubmit = async () => {
    const hexColor = hsvaToHex(hsva);
    const colorName = GetColorName(hexColor);
    
    // Save color to database
    await addColorToTrack(track, hexColor);
    
    // Notify parent component
    onSubmit(hexColor, colorName);
  };

  return (
    <>
      <div className="w-full flex flex-col mt-0 mb-0 items-center gap-2">
        <Colorful
          color={hsva}
          disableAlpha={true}
          onChange={handleColorChange}
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
  );
}