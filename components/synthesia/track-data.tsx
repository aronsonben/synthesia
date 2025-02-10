"use client";

import { useEffect, useState } from "react";
import { editTrack } from "@/actions/synthesia/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Track } from "@/lib/interface";

export default function TrackData({ track }: { track: Track }) {
  const [title, setTitle] = useState(track.title);
  const [isEditing, setIsEditing] = useState(false);
  const insertedAtDate = new Date(track.inserted_at);

  useEffect(() => {
    setTitle(track.title);
  }, [track.title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
  };

  const handleTitleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editTrack({ ...track, title: title });
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col justify-content w-full bg-slate-200 shadow-md rounded-lg p-4 TrackData">
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Title:</label>
        {isEditing ? (
          <>
            <Input
              className="p-0 border-none focus-visible:ring-transparent"
              value={title}
              onChange={handleInputChange}
            />
            <Button onClick={handleTitleChange} className="mt-2">Save</Button>
          </>
        ) : (
          <>
            <span className="block text-gray-900">{track.title}</span>
            <Button onClick={toggleEditMode} className="mt-2">Edit</Button>
          </>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Link:</label>
        <span className="block text-gray-900">
          <audio className="w-full" controls controlsList="nodownload noplaybackrate" src={track.link}></audio>
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Palette:</label>
        <span className="flex text-gray-900 p-2 border border-black flex-start">
          <Palette colors={track.colors} />
        </span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Track Order:</label>
        <span className="block text-gray-900">{track.track_order}</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Date Added:</label>
        <span className="block text-gray-900">{insertedAtDate.toDateString()}</span>
      </div>
    </div>
  );
}

function Palette({ colors }: { colors: string[] }) {
  return (
    colors.map((color) => (
      <span
        key={color+Math.random()}
        className="inline-block h-4 w-4 mr-2 relative group"
        style={{ backgroundColor: color }}>
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
          {color}
        </span> 
        &nbsp;
      </span>
    ))
  );
}