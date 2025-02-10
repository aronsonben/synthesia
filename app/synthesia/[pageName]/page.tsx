import { createClient } from "@/utils/supabase/server";
import PalettePicker from "@/components/synthesia/palette-picker";
import PublicColorsPage from "@/components/synthesia/public-page";
import Link from "next/link";

export default async function UserTracksPage({
  params,
}: {
  params: { pageName: string };
}) {
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
