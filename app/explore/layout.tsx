import NavMenu from "@/components/synthesia/nav-menu";

export default function SynthesiaLayout({ children }: { children: React.ReactNode; }) {
    return (
    <div className="flex-1 w-full flex flex-col" id="synthesia-full-layout">
      <div className="flex flex-col gap-4 items-center justify-center p-4">
        <NavMenu />
        {children}
      </div>
    </div>
  );
}
