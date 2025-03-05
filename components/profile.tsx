import { Track as TrackInterface } from "@/lib/interface";
import { Profile as ProfileInterface } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import "@/components/ui/styles.css";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { avatarImageLoader } from "@/utils/utils";

interface ExploreProps {
  tracks: TrackInterface[];
  user: User;
  profile: ProfileInterface;
  pages: { id: number, user_id: string, page_name: string, created_at: Date }[];
}

/** User Profile page. Should be visible for anyone that visits.
 * If the user is logged in, they should be able to edit their profile.
 * If the user is not logged in, they should only be able to view the profile.
 * The user should be able to edit:
 * - Username
 * - Website
 * - Avatar Image
 * - Password
 * - Featured Palette
 * - Public Pages
 */
export default function Profile({ tracks, user, profile, pages }: ExploreProps) {
  // console.log(profile);
  // Add checks for: empty tracks, empty profile, empty pages, empty user data (avatar, full name, etc.)

  return (
    <div className="flex flex-col items-start justify-start m-4 gap-4">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex gap-4 items-start justify-start w-full">
          <div 
            style={{ 
            "width": "96px", 
            "height": "96px", 
            "backgroundColor": `#${Math.floor(Math.random()*16777215).toString(16)}` 
            }} 
            className="rounded-lg"
          />
          {/* <Image 
            src={profile.avatar_url} 
            alt={profile.full_name}
            width={96} 
            height={96}
            className="rounded-lg" 
            loader={avatarImageLoader}
          /> */}
          <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-lg"><strong>{profile.username}</strong></p>
            <p className="text-sm italic">edit profile <br /> coming soon...</p>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-center w-full">
            <Button className="text-gray-500 dark:text-gray-100 bg-white dark:bg-black w-full border border-gray-500 border-solid" size="sm">Edit Profile</Button>
          {/* <Button variant="secondary" href="/profile/edit" size="sm">Change Password</Button> */}
        </div>
        {/* TODO: Make this an editable feature for the user to pick the track they want featured on their profile */}
        {/* <div className="flex flex-col gap-4 items-start justify-start w-full">
          <h3>Featured Palette</h3>
          <Swatch swatch={tracks[1]?.colors} />
        </div> */}
        
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <h3>Your Public Pages</h3>
          {pages.length > 0 ? (
          <ul className="list-disc list-inside">
            {pages.map((page) => (
              <li key={page.page_name}>
                <Link key={page.id} href={`/pages/${page.id}`} className="underline">{page.page_name}</Link>
              </li>
            ))}
          </ul>
          ) : (
            <p className="text-sm italic">You don't have any public pages yet. Add some tracks to get started.</p>
          )}
        </div>
        
        <div className="w-auto box-border bg-slate-200 dark:bg-slate-700 p-2 leading-none text-sm">
          <p>Have questions? Get in touch with the dev at borice.brainblasts@gmail.com</p>
        </div>
        {/* <div className="w-auto box-border bg-slate-200 dark:bg-slate-700 p-2 leading-none text-sm">
          <h4>User Info</h4>
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Website:</strong> {profile.website}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div> */}
      </div>
    </div>
  );
}
