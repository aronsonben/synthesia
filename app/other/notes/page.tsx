import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import ClearActions from "@/components/todos/clear-actions";
import Notes from "@/components/notes/notes";

export default async function Home() {

  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <h4 className="text-center text-[#228B22] mb-2">Navigation</h4>
        <Link href="/other/todos" className="font-bold hover:underline text-foreground/80">
          Todos
        </Link>
      </div>
      <div className="flex flex-col max-w-2xl border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4 pb-4">
          <h1 className="font-semibold text-2xl">Today's Notes</h1>
        </div>
        {await Notes()}
        <ClearActions />
      </div>
    </main>
  )
}