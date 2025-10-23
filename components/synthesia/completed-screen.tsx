import { TrackWithAnalysis } from "@/lib/interface";
import { CustomLink } from "@/components/ui/link";
import ColorInfoBlock from "./color-info-block";
import ProgressBar from "./progress-bar";
import { HOME_CONFIG } from "./home-wrapper.types";

interface CompletedScreenProps {
  completedTracks: TrackWithAnalysis[];
  onNextPage: () => void;
  hasMoreTracks?: boolean;
}

export default function CompletedScreen({
  completedTracks,
  onNextPage,
  hasMoreTracks = false,
}: CompletedScreenProps) {
  return (
    <div id="completed-container" className="w-full flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col justify-center items-center gap-2 w-full h-full p-4 border border-solid border-gray-200 sm:max-w-sm bg-white/90 backdrop-blur-sm rounded-lg">
        <h3>nice job! thanks!</h3>
        
        <p className="text-xs self-start">your swatch:</p>
        {completedTracks.map((track) => (
          <ColorInfoBlock track={track} showTitle key={track.id} />
        ))}
        
        <div className="flex flex-col justify-start items-start gap-2 py-4 w-full">
          <h3 className="self-center font-bold">Go Deeper</h3>
          
          {hasMoreTracks && (
            <>
              <p className="text-xs self-start">keep picking:</p>
              <CustomLink 
                href="" 
                onClick={onNextPage} 
                variant="outline" 
                size="synth" 
                className="w-full border-blue-600"
              >
                Three More Tracks
              </CustomLink>
            </>
          )}
          
          <p className="text-xs self-start">explore all palettes:</p>
          <CustomLink 
            href="/palettes" 
            variant="outline" 
            size="synth" 
            className="w-full"
          >
            View Palettes
          </CustomLink>
          
          <p className="text-xs self-start">listen to the music:</p>
          <CustomLink 
            href="https://borice.exposed/stolimpico" 
            variant="outline" 
            size="synth" 
            className="w-full"
          >
            STOLIMPICO
          </CustomLink>
        </div>
        
        <ProgressBar 
          completed={completedTracks.length} 
          total={HOME_CONFIG.TRACK_LIMIT} 
        />
      </div>
    </div>
  );
}