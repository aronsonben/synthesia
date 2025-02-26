import Link from "next/link";

export default function OtherPage() {

  return (
    <main className="h-1/2 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-4 p-4">
        <p className="text-sm">Congrats, you've reached a hidden page. These tools are an artifact of 
          my learning process and I wouldn't recommend using them. But since you made it
          here, you can go ahead and click on them. </p>
          <p>- b.</p>
        <h4 className="text-center text-[#228B22] mb-2">Navigation</h4>
        <Link href="/other/todos" className="font-bold hover:underline text-foreground/80">
          Todos
        </Link>
        <Link href="/other/notes" className="font-bold hover:underline text-foreground/80">
          Notes
        </Link>
      </div>
    </main>
  )
}