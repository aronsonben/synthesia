import Link from "next/link";


export default async function Index() {
  const landingColors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
  return (
    <>
      <main className="flex flex-col gap-6 p-4 justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-8">
          <h2 className="font-medium text-4xl">Synthesia</h2>
          <div className="flex mb-8">
            {landingColors.map((color, index) => (
            <div key={index} className="w-4 h-4" style={{ backgroundColor: color }}></div>
            ))}
          </div>
          <div className="flex flex-col gap-8 items-start">
            <p className="text-sm">Crowdsourced color palettes for your music</p>
            <p className="text-sm">Sign in or sign up to get started</p>
            <p className="text-sm italic">This is a WIP. You may experience bugs.</p>
            <Link href="/explore">I just want to look around.</Link>
          </div>
        </div>
      </main>
    </>
  );
}
