import PalettesSimple from "@/components/synthesia/palettes-simple";
import { 
  getAllTracks} 
from "@/utils/supabase/fetchData";

/**
 * 
 * @param props Creating a simplified version of the palettes page specifically
 * for STOLIMPICO and without user auth.
 * @returns 
 */
export default async function SimplePalettesPage() {
  const tracks = await getAllTracks();
  // const tracksWithAnalysis = await getTracksWithAnalysisByPickerPageName('stolimpico-full');

  if (!tracks) {
    throw new Error("No tracks found for this page!");
  }

  return <PalettesSimple tracks={tracks} />;
}