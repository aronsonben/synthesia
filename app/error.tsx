"use client" 

import Link from "next/link";

export default function Index() {
  const landingColors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
  return (
    <>
      <main className="flex flex-col gap-6 p-4 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-8">
          <h2 className="font-medium text-4xl">Whoops!</h2>
          <div className="flex mb-8">
            {landingColors.map((color, index) => (
            <div key={index} className="w-4 h-4" style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <div className="flex flex-col gap-8 items-start">
            <p className="text-sm">You've run into an error.</p>
            <Link href="/synthesia">Go home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
