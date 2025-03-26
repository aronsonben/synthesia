export default function TrackDetailPageLayout({ children }: { children: React.ReactNode; }) {
    return (
    <div className="flex-1 w-full flex flex-col bg-pink-500" >
      <div className="flex flex-col gap-4 items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
