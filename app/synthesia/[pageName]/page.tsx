import PublicColorsPage from "@/components/synthesia/public-page";
import { cache } from 'react'
import { redirect } from "next/navigation";
import { getUserData, getUserTracks, getUserPickerPages } from "@/utils/supabase/fetchData";

const getUserTracksCached = cache(getUserTracks);

type Props = Promise<{ pageName: string }>;

export default async function UserTracksPage(props: { params: Props }) {
  const { pageName } = await props.params;
  const user = await getUserData();

  if (!user) {
    redirect("/sign-in");
  }

  const tracks = await getUserTracksCached(user.id);
  
  return (
    <PublicColorsPage
      tracks={tracks}
      user={{ id: user?.id || '', email: user?.email || '' }}
    />
  );
}
