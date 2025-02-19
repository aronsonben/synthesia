import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Tracks from "@/components/synthesia/tracks";
import PublishTracks from "@/components/synthesia/publish-tracks";

export default async function UserHome() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/signin");
  }

  console.log(data.user.id);

  const { data: tracks, error: errorTracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("user_id", data.user.id);

  if (errorTracks) {
    throw new Error(errorTracks.message);
  }

  console.log(tracks);

  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center p-4">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-semibold text-2xl">Synthesia</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome to synthesia. Upload your tracks, then create a public page to
          crowdsource color palettes for your songs.
        </p>
      </div>
      {/* This eventually needs to change to had a "publish page" action */}
      {tracks.length !== 0 ? (
        <div className="flex flex-col w-full border rounded-lg shadow-lg p-4 bg-blue-200 dark:bg-blue-600">
          <p className="flex justify-center text-black dark:text-white font-bold underline">
            <Link href={"/synthesia/" + data?.user.id}>
              View your public page
            </Link>
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col w-full border rounded-lg shadow-lg p-4">
        <Tracks tracks={tracks} user={data?.user} />
      </div>
    </main>
  );
}
