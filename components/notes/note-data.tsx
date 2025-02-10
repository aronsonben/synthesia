"use client";

import { useEffect, useState } from "react";
import { editNote } from "@/actions/notes/actions";
import { Input } from "@/components/ui/input";
import type { Note } from "@/lib/interface";

export default function NoteData({ note }: { note: Note }) {
  const [description, setDescription] = useState(note.title);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    setDescription(note.title);
  }, [note.title]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);

    // Clear previous timeout if exists
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout
    setTypingTimeout(
      setTimeout(async () => {
        await editNote({ ...note, title: e.target.value });
      }, 2000),
    );
  };

  return (
    <Input
      className="p-0 border-none focus-visible:ring-transparent"
      value={description}
      onChange={handleInputChange}
    />
  );
}