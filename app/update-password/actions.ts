'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Basic validation
  if (!password || !confirmPassword) {
    return redirect('/update-password?message=Both password fields are required.')
  }
  if (password !== confirmPassword) {
    return redirect('/update-password?message=Passwords do not match.')
  }
  if (password.length < 6) { 
    // You might want to align this with Supabase's password policy if customized
    return redirect('/update-password?message=Password must be at least 6 characters long.')
  }

  // The user's session is implicitly handled by Supabase SSR/middleware 
  // when they arrive from the password reset link.
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Update Password Error:', error.message)
    // Redirect back to the update page with a generic error
    return redirect(`/update-password?message=Could not update password. Please try again.`)
  }

  // Password updated successfully, redirect to login with a success message
  redirect('/login?message=Password updated successfully. Please log in.') 
}