import { TrackWithAnalysis } from "@/lib/interface";
import Swatch from "../swatch";
import { GetColorName } from "hex-color-to-color-name";

interface ColorInfoBlockProps {
  track: TrackWithAnalysis;
  showTitle?: boolean;
}

export default function ColorInfoBlock({ track, showTitle = true }: ColorInfoBlockProps) {
  const lastColor = track.colors[track.colors.length - 1];
  
  return (
    <div className="flex flex-col justify-start items-start gap-2 w-full">
      {showTitle && <p className="text-sm">{track.title}</p>}
      <div className="flex justify-start items-start gap-2">
        <Swatch swatch={[lastColor]} size="lg" />
        <div className="flex flex-col justify-start items-start">
          <p>{lastColor}</p>
          <p>{GetColorName(lastColor)}</p>
        </div>
      </div>
    </div>
  );
}