
export interface SimpleUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website?: string;
}

export interface Track {
  id: number;
  user_id: string;
  title: string;
  link: string;
  colors: string[];
  track_order: number;
  inserted_at: Date;
}

export interface TrackWithAnalysis extends Track {
  colorAnalysis: ColorAnalysisResult;
}

export interface ColorAnalysisResult {
  averageHue: number;
  averageSaturation: number;
  averageLightness: number;
  // dominantHue: number;
  // deltaEFromWhite: number;
  // colorHarmony: 'complementary' | 'analogous' | 'triadic' | 'none';
  // colorTemperature: number;
  // ... placeholders ... other metrics
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: Date;
}

export interface PickerPage {
  id: number;
  user_id: string;
  page_name: string;
  created_at: Date;
  track_count: number;
}


/** Tutorial Artifacts ***/

export interface Todo {
  id: number;
  user_id: string;
  task: string;
  is_complete: boolean;
  inserted_at: Date;
}

export interface Note {
  id: number;
  user_id: string;
  title: string;
  inserted_at: Date;
}
