import TrackData from "./track-data";
import type { Track as TrackInterface } from "@/lib/interface";

interface TrackProps {
  track: TrackInterface;
  onEditTrack: (track: TrackInterface) => Promise<void>;
}

export default function Track({ track, onEditTrack }: TrackProps) {
  return (
    <div className="flex items-center gap-2 mb-4 IndividualTrack">
      <form
        className="flex-1 flex items-center gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          await onEditTrack(track);
        }}
      >
        <TrackData track={track} />
      </form>
    </div>
  );
}