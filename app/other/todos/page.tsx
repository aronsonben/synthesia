import Link from "next/link";
import Todos from "@/components/todos/todos";
import ClearActions from "@/components/todos/clear-actions";

export default async function Home() {
  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <h4 className="text-center text-[#228B22] mb-2">Navigation</h4>
        <Link href="/other/notes" className="font-bold hover:underline text-foreground/80">
          Notes
        </Link>
      </div>
      <div className="flex flex-col max-w-2xl border rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4 pb-4">
          <h1 className="font-semibold text-2xl">Todos</h1>
        </div>
        {await Todos()}
        <ClearActions />
      </div>
    </main>
  );
}