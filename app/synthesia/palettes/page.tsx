import { cache } from 'react'
import { redirect } from "next/navigation";
import Palettes from "@/components/synthesia/palettes";
import { getUserData, getUserTracks } from "@/utils/supabase/fetchData";

const getUserTracksCached = cache(getUserTracks);

export default async function PalettesPage() {
  const user = await getUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const tracks = await getUserTracksCached(user.id);

  return <Palettes tracks={tracks} user={user} />;
}