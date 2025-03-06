"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Track as TrackInterface } from "@/lib/interface";
import { getUserData } from "@/utils/supabase/fetchData";

export async function addTrack(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tracks, error: fetchError } = await supabase
    .from("tracks")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const nextId = tracks.length > 0 ? tracks[0].id + 1 : 1;

  const { error } = await supabase
    .from("tracks")
    .insert([
      {
        id: nextId,
        user_id: user?.id,
        title: formData.get("title") as string,
        link: formData.get("link") as string,
        track_order: formData.get("trackorder") as string,
        colors: [],
        inserted_at: new Date(),
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}


export async function editTrack(track: TrackInterface) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("tracks")
    .update({ title: track.title })
    .eq("id", track.id)
    .eq("user_id", user?.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteTrack(id: number, userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("tracks").delete().eq("user_id", userId).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

/** Publish a public picker page */
export async function createPickerPage(userId: string, pageName: string, tracks: TrackInterface[]) {
  const supabase = await createClient();
  pageName = pageName.replace(/\s+/g, "-").toLowerCase();
  const { data, error } = await supabase
    .from("picker_pages")
    .insert({ user_id: userId, page_name: pageName })
    .select();

  if (error || !data) {
    throw new Error(error.message);
  }

  const pickerPageId = data[0].id;

  const trackAssociations = tracks.map(track => ({
    picker_page_id: pickerPageId,
    track_id: track.id
  }));

  const { error: trackError } = await supabase
    .from("picker_page_tracks")
    .insert(trackAssociations);

  if (trackError) {
    throw new Error(trackError.message);
  }

  return pickerPageId;
}


export async function addColorToTrack(track: TrackInterface, color: string) {
  const supabase = await createClient();

  console.log("in fetch (addColorToTrack): ", track.colors, color);
  console.log([...track.colors, color]);

  const { error } = await supabase
    .from("tracks")
    .update({ colors: [...track.colors, color] })
    .eq("id", track.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
};