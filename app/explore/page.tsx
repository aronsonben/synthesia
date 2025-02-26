import { cache } from 'react'
import { redirect } from "next/navigation";
import Explore from "@/components/synthesia/explore";
import { getUserData, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export default async function ExplorePage() {
  const user = await getUserData();

  // public page, user doesn't need to be signed-in
  // if (!user) {
    // redirect("/sign-in");
  // }

  const tracks = await getUserTracksCached(user.id);
  const pickerPages = await getUserPickerPagesCached(user.id);

  return (
    <Explore tracks={tracks} />
  );
}
