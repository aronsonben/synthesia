import type { Track as TrackInterface } from "@/lib/interface";

interface AudioPlayerProps {
  track: TrackInterface | string;
} 

export default function AudioPlayer({ track }: AudioPlayerProps) {
  // Track will only be passed as a string if it is a URL to an audio file
  if (typeof track === "string") {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <audio controls>
          <source src={track} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    )
  }

  // If track is an object, render the audio player with track details
  return (
    <div className="flex flex-col items-center justify-center gap-2" key={track.id} >
      <p className="">Track {track.id}</p>
      <audio controls>
        <source src={track.link} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

