import { cache } from 'react'
import { redirect } from "next/navigation";
import Explore from "@/components/synthesia/explore";
import { getUserData, getAllUsers, getAllTracks, getUserProfile, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);
const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);
const getAllTracksCached = cache(getAllTracks);
const getAllUsersCached = cache(getAllUsers);

export default async function ExplorePage() {
  // public page, user doesn't need to be signed-in
  // const user = await getUserData();

  const tracks = await getAllTracksCached();
  const users = await getAllUsersCached();

  return (
    <Explore tracks={tracks} users={users} />
  );
}
