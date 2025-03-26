import { cache } from 'react'
import { redirect } from "next/navigation";
import ArtistHome from "@/components/synthesia/artist-home";
import { getUserData, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export default async function UserHomePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const tracks = await getUserTracksCached(user.id);
  const campaigns = await getUserPickerPagesCached(user.id);

  return <ArtistHome tracks={tracks} user={user} campaigns={campaigns} />;
}
