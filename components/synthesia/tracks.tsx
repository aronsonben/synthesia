import { createClient } from "@/utils/supabase/server";
import ManageTracksToggle from "./manage-tracks";

export default async function Tracks() {
  const supabase = await createClient();

  const { data: tracks, error } = await supabase.from("tracks").select("*");

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    throw new Error(errorUser.message);
  }

  return <ManageTracksToggle tracks={tracks} user={data?.user} />;
}