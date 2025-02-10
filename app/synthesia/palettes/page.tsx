import { createClient } from "@/utils/supabase/server";
import Palettes from "@/components/synthesia/palettes";

export default async function PalettesPage() {
  const supabase = await createClient();

  const { data: tracks, error } = await supabase.from("tracks").select("*");

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    throw new Error(errorUser.message);
  }

  return <Palettes tracks={tracks} user={data?.user} />;
}