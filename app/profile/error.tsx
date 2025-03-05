'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ProfileError({
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
    <div className="flex flex-col items-start my-4">
      <h2>Oops!</h2>
      <p>Something went wrong...</p>
      <Button onClick={() => router.push("/")}>Go back</Button>
    </div>
  )
}