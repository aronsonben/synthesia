"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Track } from "@/lib/interface";

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


export async function editTrack(track: Track) {
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

/**
 * Function that creates a new public page that displays every track in the database
 * with its title and link as an audio player, along with a color picker tool for each track.
 * The page is available to anyone on the internet.
 */
export async function publishTracks() {
  console.log("publishing tracks");
}

export async function addColorToTrack(track: Track, color: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("tracks")
    .update({ colors: [...track.colors, color] })
    .eq("id", track.id)
    .eq("user_id", user?.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
};