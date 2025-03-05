import { cache } from 'react'
import { redirect } from "next/navigation";
import Explore from "@/components/synthesia/explore";
import { getAllUsers, getAllTracks, getAllPickerPages, getUserProfile, getUserTracks, getUserPickerPages,  } from "@/utils/supabase/fetchData";

const getAllTracksCached = cache(getAllTracks);
const getAllUsersCached = cache(getAllUsers);
const getAllPickerPagesCached = cache(getAllPickerPages);

export default async function ExplorePage() {
  // public page, user doesn't need to be signed-in
  // const user = await getUserData();

  const tracks = await getAllTracksCached();
  const users = await getAllUsersCached();
  const pages = await getAllPickerPagesCached();

  return (
    <Explore tracks={tracks} users={users} pages={pages} />
  );
}
