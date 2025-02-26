export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" id="synthesia-layout">
      {children}
    </div>
  );
}
