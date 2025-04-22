import NavMenu from "@/components/synthesia/nav-menu";

export default function SynthesiaLayout({ children }: { children: React.ReactNode; }) {
    return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center justify-center p-4" id="synthesia-full-layout">
        <NavMenu />
        {children}
    </div>
  );
}
