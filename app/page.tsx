import { cache } from 'react'
import HomeWrapper from "@/components/synthesia/home-wrapper";
import { getUserData, getUserProfile, getAllTracks, getTrackSubset, hasMoreTracks } from "@/utils/supabase/fetchData";

const getAllTracksCached = cache(getAllTracks);
const getTrackSubsetCached = cache(getTrackSubset);
const getUserProfileCached = cache(getUserProfile);
const hasMoreTracksCached = cache(hasMoreTracks);

interface HomeProps {
  searchParams: Promise<{ startAfter?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const user = await getUserData();
  const resolvedSearchParams = await searchParams;
  const startAfterOrder = resolvedSearchParams.startAfter ? parseInt(resolvedSearchParams.startAfter) : 0;

  const tracks = await getAllTracksCached();

  // Fetch the track subset starting after the specified order
  const tracksSubset = await getTrackSubsetCached(startAfterOrder, 3);

  if(!tracks || tracksSubset.length === 0) {
    console.log('no track found!')
    return <div>No tracks found</div>;
  }
  
  // const track = tracksSubset[0];
  const track = tracks[0];
  const trackUser = await getUserProfileCached(track.user_id);
  
  // Check if there are more tracks for pagination
  const hasMore = await hasMoreTracksCached(tracksSubset);

  if(!track || !trackUser) {
    console.log('no track found!')
    return <div>No tracks found</div>;
  }

  return (
    <HomeWrapper 
      track={track} 
      trackUser={trackUser} 
      tracks={tracks}
      hasMoreTracks={hasMore}
      currentStartAfter={startAfterOrder}
    />
  );
}
