import { createClient } from "@/utils/supabase/server";
import PublicColorsPage from "@/components/synthesia/public-page";

type Props = Promise<{ pageName: string }>;

export default async function UserTracksPage(props: { params: Props }) {
  const { pageName } = await props.params;
  const supabase = await createClient();

  const { data: tracks, error } = await supabase.from("tracks").select("*");

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    throw new Error(errorUser.message);
  }
  
  return (
    <PublicColorsPage
      tracks={tracks}
      user={{ id: data?.user?.id || '', email: data?.user?.email || '' }}
    />
  );
}
