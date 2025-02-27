import { cache } from 'react'
import { redirect } from "next/navigation";
import Profile from "@/components/profile";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getAllUsers, getUserData, getUserProfile, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);
const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export async function generateStaticParams() {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("*")

  if (error) {
    throw new Error(error.message);
  }
 
  return profiles.map((profile) => ({
    userName: profile.username,
  }))
}

export default async function ProfilePage({
  params,
}: { 
  params: Promise<{ userName: string }> 
}) {
  const { userName } = await params;
  const user = await getUserData(userName);

  // Completely refactor this code to fetch data from db 
  // based on the userName param instead of the current user
  const profile = await getUserProfileCached(user.id);
  const tracks = await getUserTracksCached(user.id);
  const pickerPages = await getUserPickerPagesCached(user.id);
  
  return (
    <Profile tracks={tracks} user={user} profile={profile} pages={pickerPages} />
  );
}
