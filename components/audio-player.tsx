"use client";

import { useState, useRef, useEffect } from "react";
import type { Track as TrackInterface, Profile} from "@/lib/interface";

interface AudioPlayerProps {
  track: TrackInterface,
  link?: string;
  user?: Profile;
  hideInfo?: boolean;
  buttonMode?: boolean;
} 

export default function AudioPlayer({ track, link, user, hideInfo, buttonMode = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(30);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(30);
  const [error, setError] = useState<string | null>(null);

  const audioSrc = track.link;
  const trackTitle = track.title;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.log("Audio element not found.");
      return;
    }

    console.log("[AudioPlayer] Initializing with source:", audioSrc);
    console.log("[AudioPlayer] Duration: ", audio.duration);

    // Reset states when audio source changes
    setIsLoading(true);
    setError(null);
    setCurrentTime(30);

    // Set progress to 30 seconds in unless track is less than 60 seconds
    if(audio.duration > 60) {
      console.log("[AudioPlayer] Duration is greater than 60 seconds. Progress is: ", progress);
      setProgress(30);
    } else {
      setProgress(0);
    }

    const handleLoadStart = () => {
      console.log("[AudioPlayer] loadstart: Started loading audio");
      setIsLoading(true);
    };

    const handleLoadedMetadata = () => {
      console.log("[AudioPlayer] loadedmetadata: Duration set to", audio.duration);
      setDuration(audio.duration);
      setProgress(30);
      setCurrentTime(30);
    };

    const handleCanPlay = () => {
      console.log("[AudioPlayer] canplay: Audio is ready to play");
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      console.log("[AudioPlayer] loadeddata: Audio data is loaded");
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress);
    };

    const handleEnded = () => {
      console.log("[AudioPlayer] ended: Playback finished");
      setIsPlaying(false);
      setCurrentTime(30);
      setProgress(30);
    };

    const handleError = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      let errorMessage = 'Failed to load audio file.';
      
      if (target.error) {
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding failed.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported.';
            break;
        }
      }
      
      console.error("[AudioPlayer] Error:", errorMessage, target.error);
      setError(errorMessage);
      setIsLoading(false);
    };

    const handleStalled = () => {
      console.log("[AudioPlayer] stalled: Playback stalled");
      setError('Audio playback stalled. Check your connection.');
    };

    const handleSuspend = () => {
      console.log("[AudioPlayer] suspend: Browser has stopped loading");
    };

    const handleWaiting = () => {
      console.log("[AudioPlayer] waiting: Playback waiting for data");
      setIsLoading(true);
    };

    // Attach all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('suspend', handleSuspend);
    audio.addEventListener('waiting', handleWaiting);

    // Set audio start time to 30 seconds if duration allows
    // if(audio.duration > 60) {
    //   audio.currentTime = 30;
    // }

    // Force audio to load
    audio.currentTime = 30;
    audio.load();

    return () => {
      // Clean up all event listeners
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('suspend', handleSuspend);
      audio.removeEventListener('waiting', handleWaiting);
    };
  }, [audioSrc]); // Added audioSrc dependency to reset when source changes

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    console.log("[AudioPlayer] Toggling play/pause. Audio position is: ", audio.currentTime);

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Progress bar clicked");
    const audio = audioRef.current;
    if (!audio || duration == null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    const newTime = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  
    // setCurrentTime(newTime);
    setProgress(newTime);
  };

 // const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioSrc) {
    return (
      <div className="bg-slate-700 rounded-xl p-6 text-center">
        <p className="text-amber-400 font-medium">No audio source available</p>
      </div>
    );
  }

  // If button mode & hide info, render a simple play/pause button
  if(buttonMode && hideInfo) {
    return (
      <div className=" rounded-xl max-w-md" key={track?.id} >
        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioSrc+"#t=00:00:30"} key={audioSrc}>
          Your browser does not support the audio element.
        </audio>

        {/* Combine Play Button & Custom Progress bar into one row */}
        <div className="flex items-center gap-8">
            {/* Play Button */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
              className="w-12 h-12 bg-white border-solid border-2 border-black rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-6 bg-slate-800 rounded-sm"></div>
                  <div className="w-1.5 h-6 bg-slate-800 rounded-sm"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-slate-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  } else { 
    return (
      <div className="bg-white border border-solid border-[gainsboro] rounded-xl p-4 max-w-md mx-auto shadow-lg w-full" key={track?.id} >
        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioSrc+"#t=00:00:30"} key={audioSrc}>
          Your browser does not support the audio element.
        </audio>

        {/* Track Title */}
        {!hideInfo && ( 
          <div className="text-left mb-4">
            <p className="text-black font-medium text-sm"><span className="font-semibold">Track Title: </span>{trackTitle}</p>
          </div>
        )}

        {/* Combine Play Button & Custom Progress bar into one row */}
        <div className="flex items-center mb-2 gap-8">
            {/* Play Button */}
            <div className="flex justify-center">
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
              className="w-12 h-12 bg-white border border-solid border-slate-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-6 bg-slate-800 rounded-sm"></div>
                  <div className="w-1.5 h-6 bg-slate-800 rounded-sm"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-slate-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              )}
            </button>
          </div>

          {/* Custom Progress Bar */}
          {!buttonMode && (
            <div className="w-full">
              <div
                className="w-full h-8 bg-slate-600 rounded-md cursor-pointer hover:bg-slate-500 transition-colors duration-200"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-amber-400 rounded-md transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
