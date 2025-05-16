"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import { randomHex } from "@/lib/utils";
import Swatch from "@/components/swatch"

interface TrackProps {
  track: TrackInterface;
}

export default function TrackPage({ track }: TrackProps) {
  const router = useRouter();
  const randomColor = randomHex();

  return (
    <div id="track-page" className="w-1/2 flex flex-col gap-4 items-center justify-center p-4">
      <div className="flex items-center justify-center gap-6">
        <div 
          style={{ 
          "width": "96px", 
          "height": "96px", 
          "backgroundColor": randomColor,
          }} 
          className="rounded-lg"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{track.title}</h1>
          <p className="text-sm text-gray-500">
            {/* TODO: figure way to get artistName from params */}
            {/* <Link href={`/${artistName}/${track.id}`}>
              {track.title}
            </Link> */}
            {track.title}
          </p>
        </div>
      </div>
      <Swatch swatch={track.colors} size="lg" />
    </div>
  );
}
