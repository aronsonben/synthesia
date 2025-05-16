import { cache } from 'react'
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { 
  getUserData,
  getUserTracksByName } 
from "@/utils/supabase/fetchData";
import ArtistPage from "@/components/synthesia/artist-page";

const getUserTracksByNameCached = cache(getUserTracksByName);

// Return a list of `params` to populate the [artistName] dynamic segment
export async function generateStaticParams() {
  const { data: artistPages, error } = await supabaseAdmin
    .from("profiles")
    .select("username");

  console.log("Generating Static Params", artistPages);

  if (error) {
    throw new Error(error.message);
  }
 
  return artistPages.map((artist) => ({
    artistName: artist.username,
  }))
}

export default async function ArtistPageContainer({
  params,
}: { 
  params: Promise<{ artistName: string }> 
}) {
  const { artistName } = await params;
  // console.log("Params of art: ", artistName);
  
  // Users don't need to be logged in to view the public picker pages
  const user = await getUserData();

  const tracks = await getUserTracksByNameCached(artistName);
  // console.log(tracks);

  return (
    <ArtistPage 
      tracks={tracks} 
      artistName={artistName} 
      user={user} 
    />
  );
}
