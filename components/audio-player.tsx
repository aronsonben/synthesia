import type { Track as TrackInterface, Profile} from "@/lib/interface";

interface AudioPlayerProps {
  track: TrackInterface,
  link?: string;
  user?: Profile;
} 

export default function AudioPlayer({ track, link, user }: AudioPlayerProps) {
  // Track will only be passed as a string if it is a URL to an audio file
  if (link) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <audio controls>
          <source src={link} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    )
  }

  // If track is an object, render the audio player with track details
  return (
    <div className="flex flex-col items-center justify-center gap-2" key={track.id} >
      <p className="">{user?.username + " -"} Track {track.id}</p>
      <audio controls>
        <source src={track.link} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

