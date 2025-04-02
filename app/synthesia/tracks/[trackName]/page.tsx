import PublicColorsPage from "@/components/synthesia/campaign-page";
import { cache } from 'react'
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { 
  getUserData, 
  getUserTracks, 
  getAllPickerPages,
  getTracksByPickerPageName } 
from "@/utils/supabase/fetchData";

const getPickerPageTracksCached = cache(getTracksByPickerPageName);

// Return a list of `params` to populate the [pageName] dynamic segment
// export async function generateStaticParams() {
//   const { data: pickerPages, error } = await supabaseAdmin
//     .from("tracks")
//     .select("*");

//   if (error) {
//     throw new Error(error.message);
//   }
 
//   return pickerPages.map((page) => ({
//     pageName: page.page_name,
//   }))
// }

export default async function TrackDetailsPage({
  params,
}: { 
  params: Promise<{ trackName: string }> 
}) {
  const { trackName } = await params;
  console.log(trackName);
  // Users don't need to be logged in to view the public picker pages
  const user = await getUserData();
  
  // const tracks = await getPickerPageTracksCached(pageName);
  
  // if(!tracks) {
  //   // TODO: Add an error page if no tracks can be fetched for a given page
  //   return redirect("/synthesia");
  // }

  return (
    <div className="">
      <span>{trackName}</span>
    </div>
  );
}
