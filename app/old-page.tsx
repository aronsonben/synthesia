import { cache } from 'react'
import AudioPlayer from "@/components/audio-player";
import PickerWidget from "@/components/synthesia/picker-widget";
import { CustomLink } from "@/components/ui/link";
import { getUserData, getUserProfile, getRandomTrack } from "@/utils/supabase/fetchData";

const getRandomTrackCached = cache(getRandomTrack);
const getUserProfileCached = cache(getUserProfile);

export default async function Home() {
  const landingColors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
  const user = await getUserData();
  const track = await getRandomTrackCached();
  const trackUser = await getUserProfileCached(track.user_id);
  console.log(trackUser);

  if(!track || !trackUser) {
    console.log('no track found!')
  }

  return (
    <>
      <main className="flex flex-col gap-8 p-4 justify-center items-center">
        <div className="flex flex-col justify-center items-center text-center gap-4">
          <div className="flex">
            {landingColors.map((color, index) => (
            <div key={index} className="w-4 h-4" style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <h2 className="font-medium text-4xl">Synthesia</h2>
          <p className="text-xs italic">Crowdsourced color palettes for your music</p>
        </div>
        <CustomLink href="/synthesia/stolimpico-full" size="lg" className="w-full bg-blue-800 border border-black">STOLIMPICO</CustomLink>
        <div className="flex flex-col justify-start items-start gap-8">
          <p className="text-sm">Synthesia is part research project, part immersive music experience for fans and artists alike.</p>
          <p className="text-sm">Inspired by <i>synesthesia</i>, Synthesia allows fans to interact with their favorite artist's music by contributing towards the creation of a per-track color palette.</p>
          <p className="text-sm">Give it a try below, then <CustomLink href="/explore" variant="inline" size="none">explore the site.</CustomLink></p>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <div id="campaign-widget" className="flex flex-col justify-center items-center gap-2 w-full p-4 rounded border border-gray-200 sm:flex-row">
            <AudioPlayer track={track} user={trackUser} />
            {/* <PickerWidget track={track} /> */}
          </div>
          <div className="flex w-full gap-2">
            {user && (<CustomLink href="/synthesia" size="sm" className="w-full ">Dashboard</CustomLink>)}
            <CustomLink href="/explore" size="sm" className="w-full">Explore</CustomLink>
          </div>
        </div>
      </main>
    </>
  );
}
