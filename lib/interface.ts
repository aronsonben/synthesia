
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

// Row stored in the color_analysis table
export interface ColorAnalysisRow {
  id: number;
  track_id: number; // FK to tracks.id
  created_at: string; // Supabase returns timestamps as strings (ISO)
  hue: number; // averageHue
  sat: number; // averageSaturation
  lum: number; // averageLightness
}

// Original color analysis interface defined prior to table being set up
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

export interface TrackWithAnalysis extends Track {
  color_analysis?: ColorAnalysisRow | null;
}

// Track joined with (optional) color_analysis row from the DB
export interface TrackWithDbAnalysis extends Track {
  color_analysis?: ColorAnalysisRow | null;
}

// export interface TrackWithAnalysis extends Track {
//   colorAnalysis: ColorAnalysisResult;
// }




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
