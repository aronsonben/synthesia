import { createClient } from "@/utils/supabase/server";

export const getUserData = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    throw new Error(error?.message || "Unknown error");
  }

  return data.user;
};

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