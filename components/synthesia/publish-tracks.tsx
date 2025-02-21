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
  const router = useRouter();

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(e.target.value);
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const publicPageId = await createPickerPage(user.id, pageName, tracks);
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
          <Tracks tracks={tracks} user={user} variant="tight" />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="mt-2" size="sm">
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
