import { cache } from 'react'
import { redirect } from "next/navigation";
import Profile from "@/components/profile";
import { getUserData, getUserProfile, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);
const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const profile = await getUserProfileCached(user.id);
  const tracks = await getUserTracksCached(user.id);
  const pickerPages = await getUserPickerPagesCached(user.id);
  
  return (
    <Profile tracks={tracks} user={user} profile={profile} pages={pickerPages} />
  );
}
