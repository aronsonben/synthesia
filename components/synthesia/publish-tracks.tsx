"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";

export default function PublishTracks() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [pageName, setPageName] = useState("");
  const router = useRouter();

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(e.target.value);
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/synthesia/${pageName}`);
  };

  const togglePublishMode = () => {
    setIsPublishing(!isPublishing);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {isPublishing ? (
        <form className="flex flex-col items-start gap-2" onSubmit={handlePublish}>
          <Label htmlFor="pageName">Page Name*</Label>
          <Input
            id="pageName"
            className="p-0 border-none focus-visible:ring-transparent"
            name="pageName"
            placeholder="Enter page name"
            value={pageName}
            onChange={handlePageNameChange}
            required
          />
          <div className="flex gap-2">
            <Button onClick={togglePublishMode} className="mt-2">Cancel</Button>
            <Button type="submit" className="mt-2">Publish</Button>
          </div>
        </form>
      ) : (
        <Button onClick={togglePublishMode} className="mt-2">Publish Tracks</Button>
      )}
    </div>
  );
}