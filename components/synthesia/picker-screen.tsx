import { TrackWithAnalysis, Profile } from "@/lib/interface";
import { HSVA } from "./home-wrapper.types";
import AudioPlayer from "@/components/audio-player";
import PickerWidget from "./picker-widget";
import { CustomLink } from "@/components/ui/link";

interface PickerScreenProps {
  currentTrack: TrackWithAnalysis;
  trackUser: Profile;
  hsva: HSVA;
  setHsva: (hsva: HSVA) => void;
  onColorSubmit: (color: string, colorName: string) => void;
  onColorChange: (hsva: HSVA) => void;
}

export default function PickerScreen({
  currentTrack,
  trackUser,
  hsva,
  setHsva,
  onColorSubmit,
  onColorChange,
}: PickerScreenProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-8 h-[90%]">
      <div 
        id="campaign-widget" 
        className="flex flex-col justify-center items-center gap-2 w-full p-4 border-gray-200 sm:max-w-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg"
      >
        <div className="w-full flex flex-col items-start justify-start gap-2">
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
          onSubmit={onColorSubmit}
          onColorChange={onColorChange}
        />
        
        {process.env.NODE_ENV === "development" && (
          <CustomLink 
            href="/palettes" 
            variant="outline" 
            size="synth" 
            className="w-full"
          >
            View Palettes
          </CustomLink>
        )}
      </div>
    </div>
  );
}