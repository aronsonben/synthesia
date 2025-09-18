import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  onComplete?: () => void;
}

export const AudioPlayer45 = ({ audioUrl, onComplete }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onComplete) onComplete();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="flex gap-4 justify-between items-center bg-gray-800 rounded-lg p-4">
        <button
          className="flex-shrink-1 w-10 h-10 rounded-full bg-white text-black 
                    flex items-center justify-center"
          onClick={togglePlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div 
          className="flex-1 w-full h-2 bg-gray-600 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            if (audioRef.current) {
              audioRef.current.currentTime = 
                (percentage / 100) * audioRef.current.duration;
            }
          }}
        >
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* <div className="flex items-center justify-between">
          <div id="track-time-tracking" className="text-sm text-gray-400">
            {formatTime(audioState.currentTime)} / {formatTime(audioState.duration)}
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS
// const formatTime = (seconds: number): string => {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// };