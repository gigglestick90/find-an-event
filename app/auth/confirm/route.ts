import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Handler for GET requests to /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  // Where to redirect the user after successful confirmation
  // Change '/account' to '/' if you don't have an account page yet
  const next = searchParams.get('next') ?? '/' 

  // Create redirect link without the token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('next') // Also remove 'next' if it was present

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Email confirmed successfully, redirect to the 'next' page (or home)
      return NextResponse.redirect(redirectTo)
    } else {
        console.error("Email confirmation error:", error.message);
    }
  }

  // If verification fails or parameters are missing, redirect to an error page
  redirectTo.pathname = '/error'
  redirectTo.searchParams.set('message', 'Invalid or expired confirmation link.')
  return NextResponse.redirect(redirectTo)
}