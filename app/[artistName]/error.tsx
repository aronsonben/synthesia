'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex-1 w-full flex flex-col gap-10 items-center" id="synthesia-layout">
      <div className="flex flex-col items-start my-4">
        <h2>Whoops!</h2>
        <p>That user might not exist. Check the URL again or go back: </p>
        <Button onClick={() => router.push("/profile")}>Go back</Button>
      </div>
    </div>
  )
}