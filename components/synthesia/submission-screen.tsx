import { TrackWithAnalysis } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/ui/link";
import Swatch from "../swatch";
import ProgressBar from "./progress-bar";
import { GetColorName } from "hex-color-to-color-name";
import { HOME_CONFIG } from "./home-wrapper.types";

interface SubmissionScreenProps {
  currentTrack: TrackWithAnalysis;
  lastSubmittedColor: string;
  completedTracks: TrackWithAnalysis[];
  onNextTrack: () => void;
  onReset: () => void;
}

export default function SubmissionScreen({
  currentTrack,
  lastSubmittedColor,
  completedTracks,
  onNextTrack,
  onReset,
}: SubmissionScreenProps) {
  const isLastTrack = completedTracks.length >= HOME_CONFIG.TRACK_LIMIT;
  
  return (
    <div id="results-container" className="w-full flex flex-col justify-between items-center gap-8 h-[90%]">
      <div className="flex flex-col justify-center items-center gap-2 w-full h-full p-4 shadow-md sm:max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg">
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

        <div id="track-navigation" className="flex flex-col justify-center items-center gap-2 w-full pt-2 pb-4">
          <Button
            onClick={onNextTrack}
            className="flex-1 mb-4"
          >
            {isLastTrack ? "Finish" : "Next Track"}
          </Button>
          
          <ProgressBar 
            completed={completedTracks.length} 
            total={HOME_CONFIG.TRACK_LIMIT} 
          />
          
          <div className="flex justify-center items-center w-full">
            <CustomLink 
              href="" 
              onClick={onReset} 
              variant="default" 
              size="synth" 
              className="w-1/4 text-xs bg-slate-400"
            >
              Reset
            </CustomLink>
          </div>
        </div>
      </div>
    </div>
  );
}