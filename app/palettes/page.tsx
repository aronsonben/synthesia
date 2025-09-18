import PalettesSimple from "@/components/synthesia/palettes-simple";
import { 
  getUserData, 
  getTracksByPickerPageName,
  getTracksWithAnalysisByPickerPageName } 
from "@/utils/supabase/fetchData";

/**
 * 
 * @param props Creating a simplified version of the palettes page specifically
 * for STOLIMPICO and without user auth.
 * @returns 
 */
export default async function SimplePalettesPage() {
  // const tracks = await getTracksByPickerPageName('stolimpico-full');
  const tracksWithAnalysis = await getTracksWithAnalysisByPickerPageName('stolimpico-full');

  if (!tracksWithAnalysis) {
    throw new Error("No tracks found for this page!");
  }

  return <PalettesSimple tracks={tracksWithAnalysis} />;
}