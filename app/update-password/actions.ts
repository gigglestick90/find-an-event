'use server'

import { redirect } from 'next/navigation';
// Removed incorrect import for isRedirectError
import { createClient } from '@/utils/supabase/server';

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

  try {
    // Use getUser() for authenticated server actions as recommended
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user or no user found during password update:', userError?.message);
      // Provide a slightly more generic message as the exact reason might vary
      return redirect('/update-password?message=Could not verify your session. Please try resetting your password again.');
    }

    // Now update the password with the confirmed session
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Update Password Error:', error.message)
      // Include the specific error message for better debugging
      return redirect(`/update-password?message=Could not update password: ${error.message}`)
    }

    // Password updated successfully, redirect to login with a success message
    return redirect('/login?message=Password updated successfully. Please log in.')
  } catch (error: any) { // Type error as any to check digest
    // Check if the error is the internal redirect signal by checking its digest
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error; // Re-throw the redirect signal
    }
    // Handle other unexpected errors
    console.error('Unexpected error during password update:', error);
    // Ensure error is serializable if possible, or use a generic message
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return redirect(`/update-password?message=Error: ${errorMessage}`);
  }
}