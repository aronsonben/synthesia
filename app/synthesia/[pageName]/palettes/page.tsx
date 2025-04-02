import { cache } from 'react'
import { redirect } from "next/navigation";
import Palettes from "@/components/synthesia/palettes";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { 
  getUserData, 
  getAllPickerPages,
  getTracksByPickerPageName } 
from "@/utils/supabase/fetchData";

type Props = Promise<{ pageName: string }>;

const getPickerPageTracksCached = cache(getTracksByPickerPageName);

// Return a list of `params` to populate the [pageName] dynamic segment
export async function generateStaticParams() {
  const { data: pickerPages, error } = await supabaseAdmin
    .from("picker_pages")
    .select("page_name");

  console.log("Generateing Static Params 2", pickerPages);

  if (error) {
    throw new Error(error.message);
  }
 
  return pickerPages.map((page) => ({
    pageName: page.page_name,
  }))
}

export default async function PalettesPage(props: { params: Props }) {
  const { pageName } = await props.params;
  console.log("palettes route", pageName);

  const user = await getUserData();
  const tracks = await getPickerPageTracksCached(pageName);

  if (!tracks) {
    throw new Error("No tracks found for this page!");
  }

  return <Palettes tracks={tracks} user={user} />;
}