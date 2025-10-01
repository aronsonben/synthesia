import { createClient } from "@/utils/supabase/server";
import { PickerPage, Profile, Track, TrackWithDbAnalysis, ColorAnalysisRow } from "@/lib/interface";
import { SupabaseClient } from "@supabase/supabase-js";
import { analyzeTrackColors } from '@/utils/colorAnalysis';
import { TrackWithAnalysis } from '@/lib/interface';

export const getUserData = async (userName?: string) => {
  const supabase = await createClient();

  if (userName) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", userName)
      .single();
    // TODO: Might want to add a null check or some error behavior
    return profile;
  }

  const { data, error } = await supabase.auth.getUser();
  
  // Not checking for error because this should either return the user or null 
  // Pages will handle the null response 
  // if (error) {
  //   throw new Error(error?.message || "Unknown error");
  // }

  if (!data?.user) {
    return null;
  }

  return data.user;
};

export const getUserIdByName = async (username: string) => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile as Profile;
}

export const getUserProfile = async (user_id: string) => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile as Profile;
}

export const getUserTracks = async (user_id: string) => {
  const supabase = await createClient();

  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw new Error(error.message);
  }

  return tracks;
};

export const getUserTracksByName = async (username: string) => {
  const supabase = await createClient();

  const profile = await getUserIdByName(username);

  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("user_id", profile.id);

  if (error) {
    throw new Error(error.message);
  }

  return tracks;
};

/** Retrieve a list of all published picker pages tied to the specified user */
export const getUserPickerPages = async (user_id: string) => {
  const supabase = await createClient();

  const { data: pages, error } = await supabase
    .from("picker_pages")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw new Error(error.message);
  }

  return pages;
}

/** **********************************
********** Track Functions *********
*********************************** */

export const getTrackById = async (id: number) => {
  const supabase = await createClient();

  const { data: track, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return track;
};

/** **********************************
********** Get ALL Functions *********
*********************************** */

export const getAllUsers = async () => {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")

  if (error) {
    throw new Error(error.message);
  }

  return users;
};

/** Retrieve a list of all published picker pages in the database */
export const getAllPickerPages = async (): Promise<PickerPage[]> => {
  const supabase = await createClient();

  const { data: pages, error } = await supabase
    .from("picker_pages")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  // Should eventually use supabase-js dynamically generated types instead of this
  return pages as PickerPage[];
}

export const getAllTracks = async (): Promise<TrackWithAnalysis[]> => {
  const supabase = await createClient();

  // 1. Fetch tracks with any existing color_analysis row
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*, color_analysis(*)")
    .order('track_order', { ascending: true }) as { data: TrackWithDbAnalysis[] | null, error: any };

  if (error) {
    throw new Error(error.message);
  }

  if (!tracks) return [];

  // 2. Lazily compute analyses for tracks missing them
  const tracksNeedingAnalysis = tracks.filter(t => !t.color_analysis);

  if (tracksNeedingAnalysis.length > 0) {
    console.log(`[getAllTracks] Computing color analysis for ${tracksNeedingAnalysis.length} tracks (lazy).`);

    const rowsToInsert = tracksNeedingAnalysis.map(t => {
      const computed = analyzeTrackColors(t.title, t.colors);
      return {
        track_id: t.id,
        hue: computed.averageHue,
        sat: computed.averageSaturation,
        lum: computed.averageLightness
      };
    });

    // 3. Upsert into color_analysis table (track_id should be UNIQUE in schema)
    const { error: upsertError } = await supabase
      .from('color_analysis')
      .upsert(rowsToInsert, { onConflict: 'track_id' });

    if (upsertError) {
      console.error('[getAllTracks] Failed to upsert color analyses', upsertError);
    } else {
      console.log('[getAllTracks] Color analyses upserted:', rowsToInsert.length);
    }

    // 4. Re-fetch only the updated subset to get created_at & ids populated (avoid refetching all if large dataset)
    const updatedIds = rowsToInsert.map(r => r.track_id);
    const { data: refreshedSubset, error: refreshError } = await supabase
      .from('tracks')
      .select('*, color_analysis(*)')
      .in('id', updatedIds) as { data: TrackWithDbAnalysis[] | null, error: any };
    if (!refreshError && refreshedSubset) {
      // Merge refreshed subset back into main array
      const refreshedMap = new Map<number, TrackWithDbAnalysis>(refreshedSubset.map(t => [t.id, t]));
      for (let i = 0; i < tracks.length; i++) {
        if (refreshedMap.has(tracks[i].id)) {
          tracks[i] = refreshedMap.get(tracks[i].id)!;
        }
      }
    }
  }

  return tracks;
};

/** **********************************
********** Misc. Functions *********
*********************************** */


/** Retrieve list of tracks associated with the picker page page_name */
export const getTracksByPickerPageName = async (pageName: string): Promise<Track[]> => {
  const supabase = await createClient();

  console.log("pageName:", pageName);

  // 1. Get picker page ID from name
  const { data: page, error: pageError } = await supabase
    .from("picker_pages")
    .select("id")
    .eq("page_name", pageName)
    .limit(1)
    .single();

  if (pageError) {
    throw new Error(pageError.message);
  }

  const pickerPageId = page?.id;
  console.log("[fetchData] pickerPageId:", pickerPageId);

  // 2. Get tracks associated with the picker page ID
  const { data: tracks, error: trackError } = await supabase
    .from("tracks")
    .select(`
      *, 
      picker_page_tracks!inner ( 
        track_id
      )`)
    .eq("picker_page_tracks.picker_page_id", pickerPageId);

  if (trackError) {
    throw new Error(trackError.message);
  }

  return tracks as Track[];
}

export const getTracksWithAnalysisByPickerPageName = async (
  pageName: string
): Promise<TrackWithAnalysis[]|null> => {
  const tracks = await getTracksByPickerPageName(pageName);
  
  const trackTitles = ['ethereal', 'pecans', 'bossasausa', 'porcho', 'waxxx', 'riverdalestation'];
  // const trackTitlesLess = ['ethereal'];
  // const trackSubset = tracks.filter(track => trackTitles.includes(track.title.toLowerCase()));
  const trackSubset = tracks; // Use all tracks for now
  // return trackSubset.map(track => ({
  //   ...track,
  //   colorAnalysis: analyzeTrackColors(track.title, track.colors)
  // }));
  return null;
};

/** Fetch random track from database */
export const getRandomTrack = async () => {
  const supabase = await createClient();

  const { data: track, error } = await supabase.rpc('get_random_track').single();
  
  if (error) {
    throw new Error(error.message);
  }

  return track as Track;
}