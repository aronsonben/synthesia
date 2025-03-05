import { cache } from 'react'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { getUserProfile } from "@/utils/supabase/fetchData";

const getUserProfileCached = cache(getUserProfile);

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  } 

  const userProfile = await getUserProfileCached(user.id);

  if (!userProfile) {
    throw new Error("Whoops! Error fetching user profile.");
  }

  console.log(userProfile);

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto gap-2">
        <h1 className="text-xl font-medium">Profile setup</h1>
        <p className="text-sm text text-foreground">
          Welcome {userProfile.username}!
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="username">Username</Label>
          <Input name="username" placeholder="synthballer123" required />
          <SubmitButton formAction={signUpAction} pendingText="Saving...">
            Sign up
          </SubmitButton>
        </div>
      </form>
      {/* <SmtpMessage /> */}
    </>
  );
}
