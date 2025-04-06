'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    return redirect('/reset-password?message=Email address is required.')
  }

  // Construct the URL that the user will be redirected to *from the email link*
  // This should point to the page where they can enter their new password.
  const redirectUrl = new URL('/update-password', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'); // Ensure you have NEXT_PUBLIC_SITE_URL in .env or adjust default

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl.toString(),
  })

  if (error) {
    console.error('Password Reset Request Error:', error.message)
    // Redirect back to the reset page with a generic error
    return redirect(`/reset-password?message=Could not send password reset link. Please try again.`)
  }

  // Redirect to a confirmation page informing the user to check their email
  redirect('/reset-password/confirm') 
}