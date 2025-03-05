import { cache } from 'react'
import { redirect } from "next/navigation";
import { Profile as ProfileInterface } from "@/lib/interface";
import Profile from "@/components/profile";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getAllUsers, getUserData, getUserProfile, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);
const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export async function generateStaticParams() {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("username");

  if (error) {
    throw new Error(error.message);
  }
 
  return profiles.map((profile) => ({
    userName: profile.username.toString(),
  }))
}

export default async function ProfilePage({
  params,
}: { 
  params: Promise<{ userName: string }> 
}) {
  const { userName } = await params;
  const user = await getUserData(userName);
  
  if (!user) {
    throw new Error("User not found!");
  }

  const profile = await getUserProfileCached(user.id);
  const tracks = await getUserTracksCached(user.id);
  const pickerPages = await getUserPickerPagesCached(user.id);
  
  return (
    <Profile tracks={tracks} user={user} profile={profile} pages={pickerPages} />
  );
}
