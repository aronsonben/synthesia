"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Track as TrackInterface, PickerPage } from "@/lib/interface";
import { randomHex } from "@/lib/utils";

interface ArtistProps {
  tracks: TrackInterface[];
  artistName: string;
  user: { id: string; email: string };
}

export default function ArtistPage({ tracks, artistName, user }: ArtistProps) {
  const router = useRouter();
  const randomColor = randomHex();

  return (
    <div id="artist-page" className="flex flex-col gap-4 items-start justify-start p-4">
      <div className="flex items-start justify-center gap-6">
        <div 
          style={{ 
          "width": "96px", 
          "height": "96px", 
          "backgroundColor": randomColor,
          }} 
          className="rounded-lg"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{artistName}</h1>
          <p className="text-sm text-gray-500">
            {tracks.length} tracks
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-4 w-full">
        <h2 className="font-bold">All tracks</h2>
        {tracks.length === 0 && (
          <p className="text-sm text-gray-500">
            No tracks found.{" "}
          </p>
        )}
        {tracks.map((track) => (
          <div key={track.id} className="flex flex-col gap-2 underline hover:underline-offset-2">
            <Link href={`/${artistName}/${track.id}`}>
              {track.title}
            </Link>
          </div>
        ))}
        </div>
    </div>
  );
}
