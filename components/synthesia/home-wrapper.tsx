"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hsvaToHex } from "@uiw/color-convert";
import { Track as TrackInterface, TrackWithAnalysis, Profile } from "@/lib/interface";
import AudioPlayer from "@/components/audio-player";
import PickerWidget from "./picker-widget";
import { CustomLink } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import Swatch from "../swatch";
import { GetColorName } from "hex-color-to-color-name";

interface HomeWrapperProps {
  track: TrackWithAnalysis;
  trackUser: Profile;
  tracks: TrackWithAnalysis[];
}

const ColorInfoBlock = ({ track, showTitle = true }: { track: TrackWithAnalysis, showTitle?: boolean }) => (
  <div className="flex flex-col justify-start items-start gap-2 w-full">
    {showTitle && <p className="text-sm">{track.title}</p>}
    <div className="flex justify-start items-start gap-2">
      <Swatch swatch={[track.colors[track.colors.length-1]]} size="lg" />
      <div className="flex flex-col justify-start items-start">
        <p>{track.colors[track.colors.length-1]}</p>
        <p>{GetColorName(track.colors[track.colors.length-1])}</p>
      </div>
    </div>
  </div>
);

export default function HomeWrapper({ track, trackUser, tracks }: HomeWrapperProps) {
  const router = useRouter();
  const [hsva, setHsva] = useState({ h: 226, s: 0, v: 100, a: 1 });
  const [hex, setHex] = useState<string>("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState<string>(hsvaToHex(hsva));
  const [currentTrack, setCurrentTrack] = useState<TrackWithAnalysis>(track);
  const [tracksCompleted, setTracksCompleted] = useState<TrackWithAnalysis[]>([]);
  const [lastSubmittedColor, setLastSubmittedColor] = useState<string>("#ffffff");
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  // Results state
  const [colorName, setColorName] = useState("");

  const limit = 3;

  // Color analysis details
  const analysis = track.color_analysis;
  // This null check should eventually be removed once I figure out how to ensure colorAnalysis is never null...?
  let hue = "0", saturation = "0", lightness = "0";
  if(analysis) {
    console.log("Color analysis found: ", analysis);
    hue = analysis.hue.toFixed(2);
    saturation = (analysis.sat * 100).toFixed(2);
    lightness = (analysis.lum * 100).toFixed(2);
  } 

  useEffect(() => {
    console.log("Updating hex", hsva);
    setHex(hsvaToHex(hsva));
    setBackgroundColor(hsvaToHex(hsva))
  }, [hsva]);

  useEffect(() => {
    console.log("tracksCompleted Update: ", tracksCompleted);
    setLastSubmittedColor(hex);
    if (tracksCompleted.length >= limit) {
      console.log("Completed!");
      setCompleted(true);
      // set hsva to random color so background is fun
      setHsva({ h: Math.floor(Math.random() * 360), s: 0.5, v: 0.5, a: 1 });
    }
  }, [tracksCompleted]);

  const handleNextTrack = () => {
    // 1. Reset states
    setSubmitted(false);
    // setHsva({ h: 226, s: 0, v: 100, a: 1 });
    setColorName("");

    // 2. Set next track (current index always start at 0 because tracks are sorted by track_order asc)
    const currentIndex = tracks.findIndex(t => t.track_order === currentTrack.track_order);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    console.log("Next track: ", tracks[nextIndex]);
  }

  const handleReset = (full?: boolean) => {
    setTracksCompleted([])
    setLastSubmittedColor("#ffffff");
    setColorName("");
    setHsva({ h: 226, s: 0, v: 100, a: 1 });
    setSubmitted(false);
    setCompleted(false);

    if(full) {
      setCurrentTrack(track);
    }
  }

  return (
    <main 
      className="flex flex-col gap-8 p-4 justify-start items-center transition-colors duration-300 h-full"
      style={{ backgroundColor }}
    >
      {submitted ? (
        <div id="results-container" className="w-full flex flex-col justify-between items-center gap-8 h-[90%]">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full p-4 shadow-md sm:max-w-sm bg-white/90 backdrop-blur-sm rounded-lg">
            <h3>{currentTrack.title}</h3>
            <div id="user-pick" className="flex flex-col justify-start items-start gap-2 w-full py-4">
              <p className="text-xs self-start">your pick:</p>
              <div className="flex justify-start items-start gap-2">
                <Swatch swatch={[lastSubmittedColor]} size="lg" />
                <div className="flex flex-col justify-start items-start">
                  <p>{lastSubmittedColor}</p>
                  <p>{GetColorName(lastSubmittedColor)}</p>
                </div>
              </div>
            </div>
            <div id="community-picks" className="flex flex-col justify-start items-start gap-2 w-full py-4">
              <p className="text-xs self-start">community picks:</p>
              <div className="flex justify-start items-start gap-2 w-full">
                <Swatch swatch={currentTrack.colors.concat(lastSubmittedColor)} size="md" highlightLast />
              </div>
              <p className="text-[9px] self-start">your selection highlighted in <span className="text-[#ffd700]">gold</span>.</p>
            </div>
            <div id="insights" className="flex flex-col justify-start items-start gap-2 w-full py-2">
                {/* 1. Show color analysis of track -- 2. compare user color to average color of track (in color analysis) */}
                {/* Color Analysis Display */}
                <p className="text-xs self-start">color analysis:</p>
                <div className="flex flex-col flex-wrap w-full">
                  <p className="text-xs">Average Hue: {hue}</p>
                  <p className="text-xs">Average Saturation: {saturation}%</p>
                  <p className="text-xs">Average Lightness: {lightness}%</p>
                  <div className="flex items-center my-1 gap-2">
                    <span className="text-xs">Average Color (based on hsl): </span>
                    <div
                      className="flex w-6 h-6"
                      style={{ 
                        backgroundColor: `hsl(${hue}deg ${saturation}% ${lightness}%)`,
                        border: "1px solid black"
                      }}
                    ></div>
                  </div>
                </div>
            </div>
            <div id="community-picks" className="flex flex-col justify-center items-center gap-2 w-full py-4">
              <Button
                onClick={handleNextTrack}
                className="flex-1"
                size="sm"
              >
                {tracksCompleted.length == 3 ? "Finish" : "Next Track"}
              </Button>
              {/* Progress bar from 1 to limit */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((tracksCompleted.length) / limit) * 100}%` }}
                ></div>
              </div>
              <div className="w-full flex justify-between text-xs">
                <span>{tracksCompleted.length} / {limit} completed</span>
                <span>{limit - (tracksCompleted.length)} to go</span>
              </div>
              <div className="flex justify-center items-center w-full">
              <CustomLink href={""} onClick={() => handleReset(true)} variant="default" size="synth" className="w-1/4 text-xs bg-slate-400">Reset</CustomLink>
              </div>
            </div>
          </div>
        </div>
      ) : completed ? ( 
        <div id="completed-container" className="w-full flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center gap-2 w-full h-full p-4 border border-solid border-gray-200 sm:max-w-sm bg-white/90 backdrop-blur-sm rounded-lg">
            {/* When complete show: 1) all results, 2) option to do more, 3) explore site (all palettes) */}
            <h3>nice job! thanks!</h3>
            <p className="text-xs self-start">your swatch:</p>
            {tracksCompleted.map((track) => (
              <ColorInfoBlock track={track} showTitle />
            ))}
            <div className="flex flex-col justify-start items-start gap-2 py-4 w-full">
              <h3>Go Deeper</h3>
              <p className="text-xs self-start">explore all palettes:</p>
              <CustomLink href={"/palettes"} variant="outline" size="synth" className="w-full">View Palettes</CustomLink>
              <p className="text-xs self-start">listen to the music:</p>
              <CustomLink href={"https://borice.exposed/stolimpico"} variant="outline" size="synth" className="w-full">STOLIMPICO</CustomLink>
              <p className="text-xs self-start">keep picking:</p>
              <CustomLink href={""} onClick={() => handleReset(false)} variant="outline" size="synth" className="w-full border-blue-600">Three More Tracks</CustomLink>
            </div>
            {/* Progress bar from 1 to limit */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((tracksCompleted.length) / limit) * 100}%` }}
              ></div>
            </div>
            <div className="w-full flex justify-between text-xs">
              <span>{tracksCompleted.length} / {limit} completed</span>
              <span>{limit - (tracksCompleted.length)} to go</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center gap-8 h-[90%]">
          <div id="campaign-widget" className="flex flex-col justify-center items-center gap-2 w-full p-4 border-gray-200 sm:max-w-sm bg-white/90 backdrop-blur-sm rounded-lg">
            <div className="w-full lex flex-col items-start justify-start gap-2">
              <p className="text-xs">Listen to the track...</p>
            </div>
            <AudioPlayer track={currentTrack} user={trackUser} />
            <div className="w-full flex flex-col items-end justify-end gap-2 mt-4 mb-0">
              <p className="text-xs">...then select the color you hear:</p>
            </div>
            <PickerWidget 
              track={currentTrack} 
              hsva={hsva} 
              setHsva={setHsva} 
              submitted={submitted} 
              setSubmitted={setSubmitted} 
              setColorName={setColorName}
              tracksCompleted={tracksCompleted}
              setTracksCompleted={setTracksCompleted}
              />
            {process.env.NODE_ENV === "development" && (
              <CustomLink href={"/palettes"} variant="outline" size="synth" className="w-full">
                View Palettes
              </CustomLink>
            )}
          </div>
        </div>
      )}
    </main>
  );
}