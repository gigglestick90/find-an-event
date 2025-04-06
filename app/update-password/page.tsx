'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/utils/supabase/client' // Assuming client utility exists
import { useRouter, useSearchParams } from 'next/navigation'
import { updatePassword } from './actions' // Keep using server action for now
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [message, setMessage] = useState<string | null>(null)
  const [isSessionReady, setIsSessionReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // For form submission

  useEffect(() => {
    // Check for messages passed via query params (e.g., from server action redirects)
    const queryMessage = searchParams.get('message')
    if (queryMessage) {
      setMessage(queryMessage)
      // Clear the message from URL without full reload
      window.history.replaceState(null, '', '/update-password')
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth Event:', event, session); // Log event and session for debugging

        // PKCE flow often results in SIGNED_IN after code exchange.
        // Treat SIGNED_IN event *on this page load* as recovery session ready,
        // but only if we haven't already marked it as ready.
        if (event === 'SIGNED_IN' && !isSessionReady) {
          console.log('SIGNED_IN event detected, treating as recovery session ready (PKCE flow).');
          setIsSessionReady(true);
          setMessage(null); // Clear any previous messages
        }
        // Handle implicit flow just in case (though PKCE seems active)
        else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery session established (Implicit flow).');
          setIsSessionReady(true);
          setMessage(null);
        }
        // Handle case where user is already normally logged in
        else if (event === 'INITIAL_SESSION') {
            if (session) {
                 // If we get an initial session AND haven't processed a recovery sign-in,
                 // assume it's a normal session and redirect.
                 if (!isSessionReady) {
                    console.log('Normal session found on initial load, redirecting away from password recovery.');
                    setMessage('You are already logged in. Redirecting...');
                    // Redirect to a logged-in area, e.g., dashboard or home
                    setTimeout(() => router.push('/'), 2000);
                 }
            } else {
                 console.log('Initial session is null, waiting for recovery event/sign-in.');
            }
        } else if (event === 'SIGNED_OUT') {
             console.log('User signed out.');
             setIsSessionReady(false); // Reset if user signs out somehow
        }
      }
    );

    // Check initial state - sometimes the event might fire before listener attaches
    // Trigger a check manually in case the event was missed
    supabase.auth.getSession().then(({ data: { session } }) => {
        // If a session exists AND the PASSWORD_RECOVERY event hasn't fired,
        // it might be a normal session, not the recovery one.
        if (session && !isSessionReady) {
            console.log('Initial check found normal session, redirecting.');
            setMessage('You are already logged in. Redirecting...');
            setTimeout(() => router.push('/'), 2000);
        } else if (!session && !isSessionReady) {
            // No session yet, waiting for PASSWORD_RECOVERY event potentially
             console.log('Initial check: No session, waiting for recovery event.');
        }
    });


    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase, router, isSessionReady]) // searchParams handled by hook

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null) // Clear previous messages

    const formData = new FormData(event.currentTarget)
    const result = await updatePassword(formData) // Call server action

    // Server action redirects on success/error, but we might want to handle client-side messages too
    // The redirect will update searchParams, triggering the useEffect to display the message.
    // If the server action itself throws an error NOT resulting in redirect, catch it here?
    // For now, rely on server action redirects setting the message.

    setIsLoading(false)
    // No explicit redirect here, let the server action handle it
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center">Update Password</h1>

        {message && (
          <Alert variant={message.startsWith('Could not') || message.startsWith('Both') || message.startsWith('Passwords') || message.startsWith('Password must') ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {!isSessionReady && !message && (
           <p className="text-sm text-center text-muted-foreground">Verifying recovery link...</p>
        )}

        {isSessionReady && (
          <>
            <p className="text-sm text-center text-muted-foreground">
              Enter your new password below.
            </p>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input id="password" name="password" type="password" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </>
        )}

        {!isSessionReady && (
             <div className="text-center text-sm">
               <Link href="/login" className="underline text-muted-foreground hover:text-primary">
                 Back to Login
               </Link>
             </div>
        )}
      </div>
    </div>
  )
}