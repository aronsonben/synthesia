import { cache } from 'react'
import HomeWrapper from "@/components/synthesia/home-wrapper";
import { getUserData, getUserProfile, getRandomTrack, getAllTracks } from "@/utils/supabase/fetchData";

const getRandomTrackCached = cache(getRandomTrack);
const getAllTracksCached = cache(getAllTracks);
const getUserProfileCached = cache(getUserProfile);

export default async function Home() {

  const user = await getUserData();
  const tracks = await getAllTracksCached();

  // Get the first three tracks (for now)
  // const tracksSubset = tracks.slice(0, 6);
  const tracksSubset = tracks;
  const track = tracksSubset[0];
  // const randomIndex = Math.floor(Math.random() * tracks.length);
  const trackUser = await getUserProfileCached(track.user_id);

  if(!track || !trackUser) {
    console.log('no track found!')
  }

  return <HomeWrapper track={track} trackUser={trackUser} tracks={tracksSubset} />;
}
