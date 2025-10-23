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

  // 1. Fetch tracks with any existing color_analysis row + corresponding color_submissions data
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

/** I am arbitrary deciding that the proper subset for a user to interact with is three (3) tracks at a time
 * Thus, this function should eventually handle any chosen subset. Given that this app is, for now, just for me
 * to use for research purposes, it will be hardcoded to three.
 */

/** 
 * Fetch a subset of tracks with pagination support
 * @param startAfterOrder - The track_order to start after (exclusive). Use 0 to start from beginning
 * @param limit - Number of tracks to fetch (default: 3)
 */
export const getTrackSubset = async (startAfterOrder: number = 0, limit: number = 3): Promise<TrackWithAnalysis[]> => {
  const supabase = await createClient();

  // Fetch tracks with track_order greater than startAfterOrder, ordered by track_order then by id for consistency
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*")
    .gt('track_order', startAfterOrder)
    .order('track_order', { ascending: true })
    .order('id', { ascending: true }) // Secondary sort by id to handle duplicates consistently
    .limit(limit) as { data: Track[] | null, error: any };

  if (error) {
    throw new Error(error.message);
  }

  return tracks || [];
};

/**
 * Get the next available track_order value after the current subset
 * This helps determine what startAfterOrder to use for the next page
 */
export const getNextTrackOrder = async (currentTracks: Track[]): Promise<number | null> => {
  if (currentTracks.length === 0) return null;
  
  // Get the highest track_order from current subset
  const maxOrder = Math.max(...currentTracks.map(track => track.track_order));
  
  const supabase = await createClient();
  
  // Check if there are more tracks after this order
  const { data: nextTrack, error } = await supabase
    .from("tracks")
    .select("track_order")
    .gt('track_order', maxOrder)
    .order('track_order', { ascending: true })
    .limit(1)
    .single();

  if (error || !nextTrack) {
    return null; // No more tracks
  }

  return maxOrder; // Return the current max to use as startAfterOrder for next page
};

/**
 * Check if there are more tracks available after the current subset
 */
export const hasMoreTracks = async (currentTracks: Track[]): Promise<boolean> => {
  const nextOrder = await getNextTrackOrder(currentTracks);
  return nextOrder !== null;
};

/**
 * Get the track_order to start from for the previous page
 * @param currentStartAfter - Current page's startAfter value
 * @param limit - Number of tracks per page
 */
export const getPreviousPageStartAfter = async (currentStartAfter: number, limit: number = 3): Promise<number> => {
  const supabase = await createClient();

  // Get tracks before current startAfter, ordered desc, limited to our page size
  const { data: previousTracks, error } = await supabase
    .from("tracks")
    .select("track_order")
    .lte('track_order', currentStartAfter)
    .order('track_order', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit + 1); // +1 to find the boundary

  if (error || !previousTracks || previousTracks.length <= limit) {
    return 0; // Return to first page
  }

  // The boundary is the track_order of the (limit+1)th track
  return previousTracks[limit].track_order;
};



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