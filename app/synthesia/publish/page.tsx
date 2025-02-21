import { cache } from 'react'
import { redirect } from "next/navigation";
import { getUserData, getUserTracks } from "@/utils/supabase/fetchData";
import PublishTracks from "@/components/synthesia/publish-tracks";

const getUserTracksCached = cache(getUserTracks);

export default async function PublishTracksPage() {
  const user = await getUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const tracks = await getUserTracksCached(user.id);

  return <PublishTracks tracks={tracks} user={user} />;
}