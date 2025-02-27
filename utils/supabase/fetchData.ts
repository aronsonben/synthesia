import { createClient } from "@/utils/supabase/server";
import { PickerPage, Track } from "@/lib/interface";
import { SupabaseClient } from "@supabase/supabase-js";

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

  return profile;
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

export const getAllTracks = async () => {
  const supabase = await createClient();

  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return tracks;
}

/** **********************************
********** Misc. Functions *********
*********************************** */


/** Retrieve list of tracks associated with the picker page page name */
export const getTracksByPickerPageName = async (pageName: string): Promise<Track[]> => {
  const supabase = await createClient();

  console.log("in fetch: ", pageName);

  // 1. Get picker page ID from name
  const { data: page, error: pageError } = await supabase
    .from("picker_pages")
    .select("id")
    .eq("page_name", pageName)
    .single();

  if (pageError) {
    throw new Error(pageError.message);
  }

  const pickerPageId = page?.id;

  // 2. Get tracks associated with the picker page ID
  const { data: tracks, error: trackError } = await supabase
    .from("tracks")
    .select("*, picker_page_tracks!inner(track_id)")
    .eq("picker_page_tracks.picker_page_id", pickerPageId);

  if (trackError) {
    throw new Error(trackError.message);
  }

  return tracks as Track[];
}