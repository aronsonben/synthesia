"use client";

import { useEffect, useState } from "react";
import { Track as TrackInterface, SimpleUser } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import "@/components/ui/styles.css";

interface ExploreProps {
  tracks: TrackInterface[];
  users: SimpleUser[];
  user?: { id: string };
}

export default function Explore({ tracks, users, user }: ExploreProps) {
  const [randomTrack, setRandomTrack] = useState<TrackInterface>(tracks[0]);
  const [randomTrackUser, setRandomTrackUser] = useState<SimpleUser>(users[0]);

  useEffect(() => {
    const filteredTracks = tracks.filter(track => track.colors.length > 1);
    if (filteredTracks.length > 0) {
      const randomTrackPick = filteredTracks[Math.floor(Math.random() * filteredTracks.length)];
      const randomUser = users.find(user => user.id === randomTrackPick.user_id);
      setRandomTrack(randomTrackPick);
      setRandomTrackUser(randomUser || users[0]);
    }
  }, [tracks]);

  return (
    <div className="flex flex-col items-start justify-start m-4">
      <h1 className="text-xl font-bold">Explore</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Welcome to Synthesia. Here you can explore the color palettes and music tracks that users have shared.
      </p>
      <div className="flex flex-col my-4 gap-4">
        <h2 className="font-bold">Random Color Palette: </h2>
        <div className="flex flex-col p-4 box-border bg-slate-300 rounded-sm">
          <h4 className="font-bold text-xl">{randomTrack.title}</h4>
          <h4 className="text-sm">{randomTrackUser.username}</h4>
          <div className="my-4">
            <Swatch swatch={randomTrack?.colors} />
          </div>
          <div className="my-4">
            <audio controls>
            <source src={randomTrack.link} type="audio/mpeg" />
            Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col my-4">
        <h2 className="font-bold">All Public Pages: </h2>
        <div className="flex flex-col">
          <span>placeholder</span>
        </div>
      </div> */}
      <div className="flex flex-col my-4">
        <h2 className="font-bold">Users on Synthesia: </h2>
        <div className="flex flex-col">
          {users.map((user, index) => (
            <div key={index} className="flex flex-col gap-1">
              <Link href={`/profile/${user.username}`} passHref>
              <p className="text-sm underline">{user.username}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
