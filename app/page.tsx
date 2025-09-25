import { cache } from 'react'
import HomeWrapper from "@/components/synthesia/home-wrapper";
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

  return <HomeWrapper track={track} trackUser={trackUser} />;
}
