"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTrack } from "@/actions/synthesia/actions";
import { Label } from "../ui/label";

export default function AddTrack() {
  const ref = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [trackorder, setTrackorder] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitle(newValue);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLink(newValue);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTrackorder(Number(newValue));
  };

  const handleAddTrack = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("trackorder", trackorder.toString());

    await addTrack(formData);
    setIsAdding(false);
    ref.current?.reset();
  };

  const toggleAddMode = () => {
    setIsAdding(!isAdding);
  };

  return (
    <form
      className="flex outline-none items-center gap-2"
      ref={ref}
      action={async (formData: FormData) => {
        await addTrack(formData);
        ref.current?.reset();
      }}
    >
      {isAdding ? (
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              className="p-0 border-none focus-visible:ring-transparent"
              name="title"
              placeholder="Track title"
              value={title}
              onChange={handleTitleChange}
              required
            />
            <Label htmlFor="link">Link*</Label>
            <Input
              id="link"
              className="p-0 border-none focus-visible:ring-transparent"
              name="link"
              placeholder="Link to song mp3"
              value={link}
              onChange={handleLinkChange}
              required
            />
            <Label htmlFor="trackorder">Track Order*</Label>
            <Input
              id="trackorder"
              className="p-0 border-none focus-visible:ring-transparent"
              name="trackorder"
              placeholder="Track order"
              value={trackorder}
              onChange={handleOrderChange}
              required
            />
            <div className="flex gap-2">
              <Button onClick={toggleAddMode} className="mt-2">Cancel</Button>
              <Button onClick={handleAddTrack} className="mt-2">Save</Button>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={toggleAddMode} className="mt-2">Add Track</Button>
          </>
        )}
    </form>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}