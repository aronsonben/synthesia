import { Profile as ProfileInterface } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import "@/components/ui/styles.css";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { avatarImageLoader } from "@/utils/utils";
import NavMenu from "@/components/synthesia/nav-menu";


export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1 items-start justify-start m-4 gap-4" id="synthesia-full-layout-profile">
      <div className="flex flex-col w-full gap-4 items-center justify-center">
        <NavMenu />
      </div>
      <div className="flex items-start justify-between gap-4 align-baseline">
        <h1 className="text-xl">User Profile</h1>
        <Link href="/synthesia" className="text-sm text-black underline">View Dashboard</Link>
      </div>
      <div className="flex flex-col w-full items-center justify-center gap-6 box-border border rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
