import { Profile as ProfileInterface } from "@/lib/interface";
import { Button } from "@/components/ui/button";
import Swatch from "@/components/swatch";
import Link from "next/link";
import "@/components/ui/styles.css";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { avatarImageLoader } from "@/utils/utils";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center m-4 gap-4">
      <h1 className="text-xl">User Profile</h1>
      <div className="flex flex-col items-center justify-center gap-6 box-border border p-4 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
