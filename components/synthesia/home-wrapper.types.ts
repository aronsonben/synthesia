import { TrackWithAnalysis } from "@/lib/interface";

// HSVA type definition (matching @uiw/color-convert structure)
export interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

// App flow phases
export type AppPhase = 'picking' | 'submitted' | 'completed';

// Configuration constants
export const HOME_CONFIG = {
  TRACK_LIMIT: 3,
  DEFAULT_HSVA: { h: 226, s: 0, v: 100, a: 1 },
  DEFAULT_HEX: "#ffffff",
  getCompletionRandomColor: (): HSVA => ({ h: Math.floor(Math.random() * 360), s: 0.5, v: 0.5, a: 1 })
} as const;

// Completed track with color selection
export interface CompletedTrack extends TrackWithAnalysis {
  selectedColor: string;
  selectedColorName: string;
}

// Main application state
export interface HomeState {
  phase: AppPhase;
  currentTrackIndex: number; // Index within current batch (0, 1, 2)
  batchStartIndex: number;   // Starting index of current batch in tracks array
  completedTracks: CompletedTrack[];
  lastSubmittedColor: string; // Track the actual last submitted color separately
  colorSelection: {
    hsva: HSVA;
    hex: string;
  };
}

// Action types for useReducer
export type HomeAction = 
  | { type: 'SUBMIT_COLOR'; payload: { track: TrackWithAnalysis; color: string; colorName: string } }
  | { type: 'NEXT_TRACK' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET_SESSION'; payload?: { fullReset: boolean } }
  | { type: 'UPDATE_COLOR'; payload: { hsva: HSVA; hex: string } }
  | { type: 'START_NEW_BATCH' };

// Initial state factory
export const createInitialState = (initialTrack: TrackWithAnalysis): HomeState => ({
  phase: 'picking',
  currentTrackIndex: 0,
  batchStartIndex: 0,
  completedTracks: [],
  lastSubmittedColor: HOME_CONFIG.DEFAULT_HEX,
  colorSelection: {
    hsva: HOME_CONFIG.DEFAULT_HSVA,
    hex: HOME_CONFIG.DEFAULT_HEX,
  },
});