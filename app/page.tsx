import { cache } from 'react'
import AudioPlayer from "@/components/audio-player";
import PickerWidget from "@/components/synthesia/picker-widget";
import { CustomLink } from "@/components/ui/link";
import { getUserData, getUserProfile, getRandomTrack } from "@/utils/supabase/fetchData";

const getRandomTrackCached = cache(getRandomTrack);
const getUserProfileCached = cache(getUserProfile);

export default async function Home() {

  const user = await getUserData();
  const track = await getRandomTrackCached();
  // const track = await getRandomTrack();
  const trackUser = await getUserProfileCached(track.user_id);
  // const trackUser = await getUserProfile(track.user_id);
  console.log(trackUser);
  // console.log("Random Track! ", track);

  if(!track || !trackUser) {
    console.log('no track found!')
  }

  return (
    <>
      <main className="flex flex-col gap-8 p-4 justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <div id="campaign-widget" className="flex flex-col justify-center items-center gap-2 w-full p-4 border-gray-200 sm:max-w-sm">
            <div className="w-full lex flex-col items-start justify-start gap-2">
              <p className="text-xs">Listen to the track...</p>
            </div>
            <AudioPlayer track={track} user={trackUser} />
            <div className="w-full flex flex-col items-end justify-end gap-2 mt-4 mb-0">
              <p className="text-xs">...then select the color you hear:</p>
            </div>
            <PickerWidget track={track} />
            <CustomLink href={"/palettes"} variant="outline" size="synth" className="w-full">View Palettes</CustomLink>
          </div>
        </div>
      </main>
    </>
  );
}
