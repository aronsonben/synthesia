"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { Track as TrackInterface } from "@/lib/interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Accordion from "../ui/accordion";
import { Track } from "@/lib/interface";
import { addColorToTrack } from "@/actions/synthesia/actions";
import "@/components/ui/styles.css";

interface PublicColorsPageProps {
  tracks: TrackInterface[];
  user: { id: string, email: string };
}

export default function PublicColorsPage({ tracks, user }: PublicColorsPageProps) {
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });
  const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const router = useRouter();
  
  useEffect(() => {
    setUserTracks(tracks.filter((track) => track.user_id == user.id));
  }, [tracks]);

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex < userTracks.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleSubmit = async () => {
    const hexColor = hsvaToHex(hsva);
    const currentTrack = userTracks[currentTrackIndex];
    await addColorToTrack(currentTrack, hexColor);

    if (currentTrackIndex < userTracks.length - 1) {
      handleNext();
    } else {
      router.push(`/synthesia/palettes`);
    }
  };

  return (
    <div className="h-1/2 flex flex-col gap-4 items-center justify-center p-4" style={{ backgroundColor: hsvaToHex(hsva)}}>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 p-4 my-2 border rounded-lg bg-white">
          <Link href={"/synthesia"} className="text-sm text-gray-500 underline">Return to Admin</Link>
          <h4 className="font-bold">{user?.email}'s Tracks</h4>
          <p className="text-xs text-gray-500">You are viewing your public page. This is what users will see when choosing colors.</p>
        </div>
        <div className="flex-1 overflow-auto  border rounded-lg shadow-lg">
          <div className="flex flex-col justify-center items-center p-4">
            <div className="flex flex-col my-4 items-center gap-2">
              <h2 className="text-xl font-bold">Synthesia</h2>
              <h4>
                <i>What does this sound look like?</i>
              </h4>
            </div>
            <div className="flex flex-col my-4 items-center gap-2">
              {userTracks.length > 0 && (
                <div key={userTracks[currentTrackIndex].id}>
                  <audio controls>
                    <source
                      src={userTracks[currentTrackIndex].link}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
            <div className="flex flex-col my-4 items-center gap-2">
              <Colorful
                color={hsva}
                disableAlpha={true}
                onChange={(color) => {
                  setHsva(color.hsva);
                }}
                style={{ width: "300px" }}
              />
              <div className="flex items-center gap-2 w-full rounded-lg p-2 text-white" style={{ backgroundColor: hsvaToHex(hsva)}} >
                <p className="mix-blend-difference">{GetColorName(hsvaToHex(hsva))}</p>
                <p className="mix-blend-difference">{JSON.stringify(hsvaToHex(hsva)).substring(1, 8)}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={handlePrevious} disabled={currentTrackIndex === 0}>
                Previous
              </Button>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentTrackIndex === userTracks.length - 1}
              >
                Next
              </Button>
            </div>
            <Link href="/synthesia/palettes" className="flex w-full mt-4">
              <Button className="w-full">
                View Palettes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
