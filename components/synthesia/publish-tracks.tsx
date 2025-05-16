"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import Tracks from "./tracks";
import { Track as TrackInterface } from "@/lib/interface";
import { createPickerPage } from "@/actions/synthesia/actions"; 

interface TracksProps {
  tracks: TrackInterface[];
  user: { id: string };
}

export default function PublishTracks({ tracks, user }: TracksProps) {
  const [pageName, setPageName] = useState("");
  const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([]);
  const router = useRouter();

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(e.target.value);
  };

  // Handle checkbox toggle
  const handleTrackCheckbox = (trackId: number) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only include selected tracks
    const selectedTracks = tracks.filter((t) => selectedTrackIds.includes(t.id));
    const publicPageId = await createPickerPage(user.id, pageName, selectedTracks);
    router.push(`/synthesia/${pageName}`);
  };

  return (
    <div className="flex flex-col items-start gap-2 m-4">
      <div className="flex gap-2">
        <Button
          onClick={() => router.back()}
          className="text-xs"
          size="sm"
        > Back </Button>
      </div>
      <h2>Publish Page</h2>
      <p className="text-gray-500 dark:text-gray-400 text-xs italic">
        Create a public page to share with your fans and friends to start
        crowdsourcing color palettes for your music.
      </p>
      <form
        className="flex flex-col w-full items-start gap-2 my-4 p-4 border rounded-lg"
        onSubmit={handlePublish}
      >
        <Label htmlFor="pageName">Page Name*</Label>
        <Input
          id="pageName"
          className="p-2 focus-visible:ring-transparent"
          name="pageName"
          placeholder="Enter page name"
          value={pageName}
          onChange={handlePageNameChange}
          required
        />
        <div className="flex flex-col my-4 w-full gap-4">
          <Label>Tracks to be Published</Label>
          {/* Render checkboxes for each track */}
          <div className="flex flex-col gap-2">
            {tracks.map((track) => (
              <label key={track.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTrackIds.includes(track.id)}
                  onChange={() => handleTrackCheckbox(track.id)}
                />
                <span>{track.title}</span>
              </label>
            ))}
          </div>
          {/* Optionally, you can still show the Tracks component for preview */}
          {/* <Tracks tracks={tracks.filter(t => selectedTrackIds.includes(t.id))} user={user} variant="tight" /> */}
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            className="mt-2"
            size="sm"
            disabled={selectedTrackIds.length === 0}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
