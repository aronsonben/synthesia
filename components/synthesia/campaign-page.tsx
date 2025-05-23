"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Colorful } from "@uiw/react-color";
import { hsvaToHex, hexToHsva } from "@uiw/color-convert";
import { GetColorName } from "hex-color-to-color-name";
import { Track as TrackInterface } from "@/lib/interface";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { addColorToTrack } from "@/actions/synthesia/actions";
import "@/components/ui/styles.css";
import { cn } from "@/lib/utils";
import ProgressSwatch from "./progress-swatch";
import AudioPlayer from "@/components/audio-player";

interface PublicColorsPageProps {
  pageName: string;
  tracks: TrackInterface[];
  user?: { id: string; email: string };
}

const TextBubble = ({ text, variant }: { text: string, variant: string }) => {
  const bubbleBaseStyle = "flex flex-col my-2 items-center gap-2 bg-gray-200 text-black text-sm px-4 py-2 shadow-md max-w-xs self-start"
  const bubbleVariantStyle = variant === "right" ? "self-end rounded-lg rounded-tr-none" : "rounded-lg rounded-tl-none";
  const bubbleRadius = variant === "right" ? "20px 20px 5px 20px" : "20px 20px 20px 5px";
  return (
    <div
      id="text_bubble"
      className={cn(bubbleBaseStyle, bubbleVariantStyle)}
      style={{
      borderRadius: bubbleRadius,
      }}
    >
      <h4><i>{text}</i></h4>
    </div>
  )
}

// const AudioPlayer = ({ track }: { track: TrackInterface }) => {
//   return (
//     <div className="flex flex-col items-center justify-center gap-2" key={track.id} >
//       <p className="">Track {track.id}</p>
//       <audio controls>
//         <source src={track.link} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//     </div>
//   );
// }

export default function CampaignPage({
  pageName,
  tracks,
  user,
}: PublicColorsPageProps) {
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const storedColors = sessionStorage.getItem('selectedColors');
    if (storedColors) {
      setSelectedColors(JSON.parse(storedColors));
    }
    tracks.map((track) => {
      setSelectedColors((prevColors) => ({
        ...prevColors,
        [track.id]: prevColors[track.id] || "#ffffff",
      }));
    });
  }, [tracks]);

  // Handler function for the pagination display
  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
      const previousTrack = tracks[newIndex];
      setHsva(hexToHsva(selectedColors[previousTrack.id] || "#ffffff"));
      return newIndex;
    });
  };

  // Handler function for the pagination display
  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => {
      const newIndex = prevIndex < tracks.length - 1 ? prevIndex + 1 : prevIndex;
      const nextTrack = tracks[newIndex];
      // if the next color is white, reset the hsva to the default color (blue)
      setHsva(
        selectedColors[nextTrack.id] === "#ffffff" ? 
          { h: 226, s: 0, v: 100, a: 1 } 
          : 
          hexToHsva(selectedColors[nextTrack.id])
      );
      return newIndex;
    });
  };

  /* Handler function for when a user selects a color. This function should:
  * - Store the currently selected hsva color to local storage
  * - Move the user to the next track, if not at the end of the track list
  */
  const handleSelect = async () => {
    // convert hsva to hex for easier storage and display
    const hexColor = hsvaToHex(hsva);
    const currentTrack = tracks[currentTrackIndex];

    // append a new key:value pair of trackId:hexColor and append to the selectedColors object
    const newSelectedColors = {
      ...selectedColors,
      [currentTrack.id]: hexColor,
    };
    setSelectedColors(newSelectedColors);

    // update the local storage with the new selected colors
    sessionStorage.setItem('selectedColors', JSON.stringify(newSelectedColors));

    // If at the end of the track list, submit the selection
    if (currentTrackIndex === tracks.length - 1) {
      await handleSubmit();
    } else {
      // Move the user to the next track
      handleNext();
    }
  };

  /* Async handler function for when the user submits the final selection
  *
  */
  const handleSubmit = async () => {
    // Call the action to save the selected colors to the database per track
    await Promise.all(
      tracks.map(async (track) => {
        await addColorToTrack(track, selectedColors[track.id]);
      })
    );
    
    // reset the selected colors and local storage
    setSelectedColors({});
    sessionStorage.removeItem('selectedColors');

    // redirect the user to the palettes page
    router.push(`/synthesia/${pageName}/palettes`);
  };

  const handleClearSelection = () => {
    setSelectedColors({});
    sessionStorage.removeItem('selectedColors');
  }

  const getColor = (index: number) => {
    const track = tracks[index];
    return track ? selectedColors[track.id] || "#ffffff" : "#ffffff";
  };

  return (
    <div
      id="public-colors-page"
      className="h-1/2 flex flex-col gap-4 items-center justify-center py-4 px-2 w-full rounded-lg "
      style={{ backgroundColor: hsvaToHex(hsva) }}
    >
      <div className="w-full flex flex-col sm:max-w-[70vw]">
        <div id="pickerbox" className="flex-1 overflow-auto border rounded-lg shadow-lg bg-white dark:bg-black">
          <div className="flex flex-col justify-center items-center p-4 gap-2">
            <TextBubble text="Listen to this sound..." variant="left" />
            <div id="audio_wrapper" className="flex flex-col my-4 items-center justify-center gap-2">
              {tracks.length > 0 && (
                <AudioPlayer track={tracks[currentTrackIndex]} />
              )}
            </div>
            <TextBubble text="...then pick the color it makes you feel" variant="right" />
            <div className="flex flex-col my-4 mb-0 items-center gap-2">
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
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={handleSelect}
                className="flex-1"
                size="sm"
              >
                {currentTrackIndex === tracks.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
            <div id="progress-swatch" className="flex w-full items-center justify-center gap-8 my-4">
              <ProgressSwatch
                previousColor={getColor(currentTrackIndex - 1)}
                currentColor={getColor(currentTrackIndex)}
                nextColor={getColor(currentTrackIndex + 1)}
                totalTracks={tracks.length}
                currentTrackIndex={currentTrackIndex}
                getColor={getColor}
              />
            </div>
            <div className="flex w-full my-1">
              <Button
                onClick={handleClearSelection}
                className="flex w-full border-solid border border-black"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex w-full">
              <Button
                onClick={() => router.push(`/synthesia/${pageName}/palettes`)}
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
