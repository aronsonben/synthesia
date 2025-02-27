import { cache } from 'react'
import { redirect } from "next/navigation";
import Explore from "@/components/synthesia/explore";
import { getUserData, getAllTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getAllTracksCached = cache(getAllTracks);

export default async function ExplorePage() {
  // public page, user doesn't need to be signed-in
  // const user = await getUserData();

  const tracks = await getAllTracksCached();

  return (
    <Explore tracks={tracks} />
  );
}
