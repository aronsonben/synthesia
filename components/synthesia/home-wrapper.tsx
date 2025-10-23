"use client";

import { useEffect, useState } from "react";
import { hsvaToHex } from "@uiw/color-convert";
import { TrackWithAnalysis, Profile } from "@/lib/interface";
import { useHomeState, useColorSelection } from "./home-wrapper.hooks";
import { HOME_CONFIG } from "./home-wrapper.types";
import PickerScreen from "./picker-screen";
import SubmissionScreen from "./submission-screen";
import CompletedScreen from "./completed-screen";

interface HomeWrapperProps {
  track: TrackWithAnalysis;
  trackUser: Profile;
  tracks: TrackWithAnalysis[];
  hasMoreTracks: boolean;
  currentStartAfter: number;
}


export default function HomeWrapper({ track, trackUser, tracks, hasMoreTracks, currentStartAfter }: HomeWrapperProps) {
  const { state, currentTrack, hasNextBatch, actions } = useHomeState(track, tracks);
  const { backgroundColor } = useColorSelection(state.colorSelection.hsva);

  // Legacy state for compatibility with existing PickerWidget
  const [submitted, setSubmitted] = useState(false);
  const [colorName, setColorName] = useState("");
  const [tracksCompleted, setTracksCompleted] = useState<TrackWithAnalysis[]>([]);

  // Sync new state with legacy state for gradual migration
  useEffect(() => {
    setSubmitted(state.phase === 'submitted');
    setTracksCompleted(state.completedTracks);
  }, [state]);

  const handleNextTrack = () => {
    setSubmitted(false);
    setColorName("");
    actions.nextTrack();
  };

  const handleNextPage = () => {
    // Start a new batch of tracks from the current tracks array
    actions.startNewBatch();
  };

  const handleReset = (full?: boolean) => {
    actions.resetSession(full);
    setColorName("");
  };

  const renderScreen = () => {
    switch (state.phase) {
      case 'submitted':
        return (
          <SubmissionScreen
            currentTrack={currentTrack}
            lastSubmittedColor={state.lastSubmittedColor}
            completedTracks={tracksCompleted}
            onNextTrack={handleNextTrack}
            onReset={() => handleReset(true)}
          />
        );

      case 'completed':
        return (
          <CompletedScreen
            completedTracks={tracksCompleted}
            onNextPage={handleNextPage}
            hasMoreTracks={hasNextBatch}
          />
        );

      case 'picking':
      default:
        return (
          <PickerScreen
            currentTrack={currentTrack}
            trackUser={trackUser}
            hsva={state.colorSelection.hsva}
            setHsva={(hsva) => actions.updateColor(hsva, hsvaToHex(hsva))}
            onColorSubmit={(color, colorName) => {
              actions.submitColor(color, colorName);
              setColorName(colorName);
            }}
            onColorChange={(hsva) => actions.updateColor(hsva, hsvaToHex(hsva))}
          />
        );
    }
  };

  return (
    <main 
      className="flex flex-col gap-8 p-4 justify-start items-center transition-colors duration-300 h-full"
      style={{ backgroundColor }}
    >
      {renderScreen()}
    </main>
  );
}