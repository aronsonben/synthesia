import Swatch from "@/components/swatch";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserData } from "@/utils/supabase/fetchData";

export default async function SynthesiaHome() {
  const user = await getUserData();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="flex flex-col gap-4 items-start p-4">
        <Swatch swatch={["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"]}/>
        <h2 className="font-bold text-2xl">Welcome to Synthesia</h2>
        <div className="text-xs">
          <p>
            An experimental tool for visualizing sound as color by crowdsourcing
            color palettes of songs.
          </p>
        </div>
        <div>
          <h2 className="font-bold text-lg">I want to...</h2>
          <ul className="flex flex-col text-sm underline gap-2 py-2">
            <li>
              <Link href="/synthesia/artist">[Artist] Upload my tracks to start crowdsourcing a color palette</Link>
            </li>
            <li>
              <Link href="/explore">[Audience] View other users' tracks and color palettes (WIP)</Link>
            </li>
            <li>
              <Link href="/profile">[All] Edit my profile</Link>
            </li>
          </ul>
        </div>
        {user?.email === "14benaronson@gmail.com" ? (
          <>
            <div className="flex flex-col bg-accent w-full p-4 gap-4 mt-16">
              <p className="text-sm text-gray-500 italic">
                You are an admin user and can see the following links
              </p>
              <h2 className="font-bold text-2xl mb-4">Current Page Links</h2>
              <div>
                <Link href="/synthesia">/synthesia</Link>
                <hr/>
                <Link href="/explore">/explore</Link>
              </div>
              <div className="flex flex-col gap-2 items-start">
                <h2 className="font-bold text-2xl mb-4">Your user details</h2>
                <pre className="w-full text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
