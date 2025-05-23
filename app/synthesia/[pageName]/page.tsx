import CampaignPage from "@/components/synthesia/campaign-page";
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
export async function generateStaticParams() {
  const { data: pickerPages, error } = await supabaseAdmin
    .from("picker_pages")
    .select("page_name");

  console.log("Generating Static Params", pickerPages);

  if (error) {
    throw new Error(error.message);
  }
 
  return pickerPages.map((page) => ({
    pageName: page.page_name,
  }))
}

export default async function CampaignPageContainer({
  params,
}: { 
  params: Promise<{ pageName: string }> 
}) {
  const { pageName } = await params;
  console.log(pageName);
  // Users don't need to be logged in to view the public picker pages
  const user = await getUserData();

  const tracks = await getPickerPageTracksCached(pageName);
  console.log(tracks);
  
  if(!tracks) {
    // TODO: Add an error page/behavior if no tracks can be fetched for a given page
    return redirect("/synthesia");
  }

  return (
    <CampaignPage
      pageName={pageName}
      tracks={tracks}
      user={{ id: user?.id || '', email: user?.email || '' }}
    />
  );
}
