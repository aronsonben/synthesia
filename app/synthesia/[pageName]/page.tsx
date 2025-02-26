import PublicColorsPage from "@/components/synthesia/public-page";
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
    .select("*");

  if (error) {
    throw new Error(error.message);
  }
 
  return pickerPages.map((page) => ({
    pageName: page.page_name,
  }))
}


/** Modify this page to not rely on logged user
 * == Context == 
 * - The pageName is being generated by the user during the page publishing process,
 * which is happening at /synthesia/publish and then being saved to "picker_pages" table.
 * 
 * - Tracks should be fetched from the picker_pages_tracks table
 * - User info shouldn't be needed
 * - ~~Page name is needed to fetch the tracks, so also add a check that the name (or id?) is valid~~
 * - Any fetches need to happen here because this page is public so nothing can be relid on elsewhere
 * 
 * - ~~I should also probably consider using generateStaticParams() because this should def be
 * rendered at build time and not dynamically since this is a static public page once published~~
 */
export default async function UserTracksPage({
  params,
}: { 
  params: Promise<{ pageName: string }> 
}) {
  const { pageName } = await params;
  const user = await getUserData();
  if (!user) redirect("/sign-in");

  console.log(pageName);
  const tracks = await getPickerPageTracksCached(pageName);
  
  if(!tracks) {
    // TODO: Add an error page if no tracks can be fetched for a given page
    return redirect("/synthesia");
  }

  return (
    <PublicColorsPage
      pageName={pageName}
      tracks={tracks}
      user={{ id: user?.id || '', email: user?.email || '' }}
    />
  );
}
