import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import Tracks from "@/components/synthesia/tracks";

export default async function Home() {
  const supabase = await createClient();

  const { data: tracks, error } = await supabase.from("tracks").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col max-w-3xl border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4 pb-4">
          <h1 className="font-semibold text-2xl">Colors</h1>
        </div>
        <div className="flex items-center gap-4 pb-4">
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to synthesia. Select a color palette.
          </p>
        </div>
        {tracks
            .map((track) => {
              return (
                <Link href={`/synthesia/colors/${track.id}`} key={track.id}>{track.title}</Link>
              );
            })}
      </div>
    </main>
  )
}