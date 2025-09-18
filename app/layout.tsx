import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Synthesia",
  description: "Crowdsource color palettes for your music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const landingColors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"];
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col justify-between items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-4 items-center font-semibold">
                    <Link href={"/"}>
                    <div className="flex">
                      {landingColors.map((color, index) => (
                      <div key={index} className="w-4 h-4" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <ThemeSwitcher />
                    </div>
                    <Link href={"/synthesia/stolimpico-full"} className="w-6 h-6 bg-blue-950 rounded-full" />
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex-1 flex flex-col gap-20 max-w-5xl w-full">
                {children}
              </div>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-2">
                <p>
                  another{" "}
                  <a
                    href="https://concourse.codes"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    bo rice brainblast
                  </a>
                </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
