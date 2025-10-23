import { useReducer, useEffect, useState } from "react";
import { hsvaToHex } from "@uiw/color-convert";
import { TrackWithAnalysis } from "@/lib/interface";
import { 
  HomeState, 
  HomeAction, 
  createInitialState, 
  HOME_CONFIG, 
  CompletedTrack,
  HSVA 
} from "./home-wrapper.types";

// Reducer for managing home state
function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'UPDATE_COLOR':
      return {
        ...state,
        colorSelection: action.payload,
      };

    case 'SUBMIT_COLOR':
      // We'll get the current track from the hook that has access to tracks array
      // For now, create a placeholder - this will be handled by the hook
      const completedTrack: CompletedTrack = {
        ...action.payload.track,
        selectedColor: action.payload.color,
        selectedColorName: action.payload.colorName,
      };

      const newCompletedTracks = [...state.completedTracks, completedTrack];
      const isSessionComplete = newCompletedTracks.length >= HOME_CONFIG.TRACK_LIMIT;
      
      let newColorSelection = state.colorSelection;
      if (isSessionComplete) {
        const randomColor = HOME_CONFIG.getCompletionRandomColor();
        newColorSelection = {
          hsva: randomColor,
          hex: hsvaToHex(randomColor),
        };
      }
      
      return {
        ...state,
        phase: 'submitted',
        completedTracks: newCompletedTracks,
        lastSubmittedColor: action.payload.color, // Store the actual submitted color
        colorSelection: newColorSelection,
      };

    case 'NEXT_TRACK':
      const shouldComplete = state.completedTracks.length >= HOME_CONFIG.TRACK_LIMIT;
      
      return {
        ...state,
        phase: shouldComplete ? 'completed' : 'picking',
        currentTrackIndex: shouldComplete ? state.currentTrackIndex : state.currentTrackIndex + 1,
      };

    case 'COMPLETE_SESSION':
      return {
        ...state,
        phase: 'completed',
      };

    case 'RESET_SESSION':
      const fullReset = action.payload?.fullReset ?? false;
      
      return {
        ...state,
        phase: 'picking',
        currentTrackIndex: fullReset ? 0 : state.currentTrackIndex,
        batchStartIndex: fullReset ? 0 : state.batchStartIndex,
        completedTracks: [],
        lastSubmittedColor: HOME_CONFIG.DEFAULT_HEX,
        colorSelection: {
          hsva: HOME_CONFIG.DEFAULT_HSVA,
          hex: HOME_CONFIG.DEFAULT_HEX,
        },
      };

    case 'START_NEW_BATCH':
      // Move to the next batch of tracks (next HOME_CONFIG.TRACK_LIMIT tracks)
      const nextBatchStart = state.batchStartIndex + HOME_CONFIG.TRACK_LIMIT;
      
      return {
        ...state,
        phase: 'picking',
        currentTrackIndex: 0, // Reset to first track of new batch
        batchStartIndex: nextBatchStart,
        completedTracks: [],
        lastSubmittedColor: HOME_CONFIG.DEFAULT_HEX,
        colorSelection: {
          hsva: HOME_CONFIG.DEFAULT_HSVA,
          hex: HOME_CONFIG.DEFAULT_HEX,
        },
      };

    default:
      return state;
  }
}



// Custom hook for managing home state
export function useHomeState(initialTrack: TrackWithAnalysis, tracks: TrackWithAnalysis[]) {
  const [state, dispatch] = useReducer(homeReducer, createInitialState(initialTrack));

  // Get current track based on batch and index within batch
  const actualTrackIndex = state.batchStartIndex + state.currentTrackIndex;
  const currentTrack = tracks[actualTrackIndex] || initialTrack;
  
  // Check if there are more tracks available for the next batch
  const hasNextBatch = (state.batchStartIndex + HOME_CONFIG.TRACK_LIMIT) < tracks.length;

  // Actions
  const actions = {
    updateColor: (hsva: HSVA, hex: string) => {
      dispatch({ type: 'UPDATE_COLOR', payload: { hsva, hex } });
    },

    submitColor: (color: string, colorName: string) => {
      dispatch({ type: 'SUBMIT_COLOR', payload: { track: currentTrack, color, colorName } });
    },

    nextTrack: () => {
      dispatch({ type: 'NEXT_TRACK' });
    },

    completeSession: () => {
      dispatch({ type: 'COMPLETE_SESSION' });
    },

    resetSession: (fullReset: boolean = false) => {
      dispatch({ type: 'RESET_SESSION', payload: { fullReset } });
    },

    startNewBatch: () => {
      dispatch({ type: 'START_NEW_BATCH' });
    },
  };

  return {
    state,
    currentTrack,
    hasNextBatch,
    actions,
  };
}

// Custom hook for color selection management
export function useColorSelection(initialHsva: HSVA = HOME_CONFIG.DEFAULT_HSVA) {
  const [hsva, setHsva] = useState<HSVA>(initialHsva);
  const [hex, setHex] = useState(hsvaToHex(initialHsva));

  useEffect(() => {
    const newHex = hsvaToHex(hsva);
    setHex(newHex);
  }, [hsva]);

  const backgroundColor = hex;

  return {
    hsva,
    hex,
    backgroundColor,
    setHsva,
    updateColor: (newHsva: HSVA) => {
      setHsva(newHsva);
    },
  };
}