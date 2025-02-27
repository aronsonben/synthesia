import { cache } from 'react'
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserData, getAllUsers, getUserProfile, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);
const getUserTracksCached = cache(getUserTracks);
const getUserPickerPagesCached = cache(getUserPickerPages);

export default async function ProfilePage() {
  const user = await getUserData();

  if (!user) {
    // Get a random user profile and redirect to it
    const users = await getAllUsers();
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];
    const userProfile = await getUserProfileCached(randomUser.id);
    return (
      <div className="flex flex-col items-start justify-start m-4 gap-2">
        <h2 className="text-xl font-bold">Profile not found</h2>
        <p className="text-lg text-gray-500">User not found</p>
        <div id="redirect-links" className="flex flex-col gap-2">
          <Link href="/synthesia" className="text-sm underline">Go Home</Link>
          <Link href={`/profile/${userProfile.username}`} className="text-sm underline">Go to a random user profile</Link>
        </div>
      </div>
    );
  } else {
    const userProfile = await getUserProfileCached(user.id);
    redirect(`/profile/${userProfile.username}`);
  }
}
