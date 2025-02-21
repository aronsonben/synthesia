"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { Track as TrackInterface } from "@/lib/interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addColorToTrack } from "@/actions/synthesia/actions";
import "@/components/ui/styles.css";
import ProgressSwatch from "./progress-swatch";

interface PublicColorsPageProps {
  tracks: TrackInterface[];
  user: { id: string; email: string };
}

export default function PublicColorsPage({
  tracks,
  user,
}: PublicColorsPageProps) {
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });
  const [userTracks, setUserTracks] = useState<TrackInterface[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const storedColors = localStorage.getItem('selectedColors');
    if (storedColors) {
      setSelectedColors(JSON.parse(storedColors));
    }
    setUserTracks(tracks);
    tracks.map((track) => {
      setSelectedColors((prevColors) => ({
        ...prevColors,
        [track.id]: prevColors[track.id] || "#ffffff",
      }));
    });
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

  const handleSelect = () => {
    const hexColor = hsvaToHex(hsva);
    const currentTrack = userTracks[currentTrackIndex];
    const newSelectedColors = {
      ...selectedColors,
      [currentTrack.id]: hexColor,
    };
    setSelectedColors(newSelectedColors);
    localStorage.setItem('selectedColors', JSON.stringify(newSelectedColors));
    if (currentTrackIndex < userTracks.length - 1) {
      handleNext();
    }
  };

  const handleSubmit = async () => {
    userTracks.map(async (track) => {
      await addColorToTrack(track, selectedColors[track.id]);
    });
    setSelectedColors({});
    localStorage.removeItem('selectedColors');
    router.push(`/synthesia/palettes`);
  };

  const getColor = (index: number) => {
    const track = userTracks[index];
    return track ? selectedColors[track.id] || "#ffffff" : "#ffffff";
  };

  return (
    <div
      className="h-1/2 flex flex-col gap-4 items-center justify-center p-4"
      style={{ backgroundColor: hsvaToHex(hsva) }}
    >
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 p-4 my-2 border rounded-lg bg-white">
          <Link href={"/synthesia"} className="text-sm text-gray-500 underline">
            Return to Admin
          </Link>
          <h4 className="font-bold">{user?.email}'s Tracks</h4>
          <p className="text-xs text-gray-500">
            You are viewing your public page. This is what users will see when
            choosing colors.
          </p>
        </div>
        <div
          id="pickerbox"
          className="flex-1 overflow-auto border rounded-lg shadow-lg bg-white dark:bg-black"
        >
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
              <div
                className="flex items-center gap-2 w-full rounded-lg p-2 text-white"
                style={{ backgroundColor: hsvaToHex(hsva) }}
              >
                <p className="mix-blend-difference">
                  {GetColorName(hsvaToHex(hsva))}
                </p>
                <p className="mix-blend-difference">
                  {JSON.stringify(hsvaToHex(hsva)).substring(1, 8)}
                </p>
              </div>
            </div>
            <div className="flex w-full justify-between gap-4 mt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentTrackIndex === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button onClick={handleSelect} className="flex-1">
                Select
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentTrackIndex === userTracks.length - 1}
                className="flex-1"
              >
                Next
              </Button>
            </div>
            <div id="progress-swatch" className="flex w-full items-center justify-center gap-8 my-4">
              <ProgressSwatch
                previousColor={getColor(currentTrackIndex - 1)}
                currentColor={getColor(currentTrackIndex)}
                nextColor={getColor(currentTrackIndex + 1)}
                totalTracks={userTracks.length}
                currentTrackIndex={currentTrackIndex}
                getColor={getColor}
              />
            </div>
            <div className="flex w-full my-4">
              <Button onClick={handleSubmit} className="flex w-full">
                Submit
              </Button>
            </div>
            <div className="flex w-full">
              <Button
                onClick={() => router.push(`/synthesia/palettes`)}
                className="flex w-full bg-gradient-to-r from-red-500 to-blue-300 border-solid border border-black"
                size="sm"
              >
                View Palettes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
