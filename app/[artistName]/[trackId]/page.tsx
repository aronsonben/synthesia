import { cache } from 'react'
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { 
  getUserData,
  getTrackById } 
from "@/utils/supabase/fetchData";
import TrackPage from "@/components/synthesia/track-page";

const getTrackByIdCached = cache(getTrackById);


export async function generateStaticParams() {
  const { data: trackPages, error } = await supabaseAdmin
    .from("tracks")
    .select("id");

  console.log("Generating Static Params", trackPages);

  if (error) {
    throw new Error(error.message);
  }
 
  return trackPages.map((track) => ({
    trackId: track.id,
  }))
}

export default async function TrackPageContainer({
  params,
}: { 
  params: Promise<{ trackId: number }> 
}) {
  const { trackId } = await params;
  // console.log("Params of art: ", artistName);
  
  // Users don't need to be logged in to view the public picker pages
  const user = await getUserData();

  const track = await getTrackByIdCached(trackId);
  // console.log(tracks);

  return (
    <TrackPage
      track={track} 
    />
  );
}
