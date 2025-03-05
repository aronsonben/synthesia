export default function ArtistLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" id="synthesia-layout">
      {children}
    </div>
  );
}
