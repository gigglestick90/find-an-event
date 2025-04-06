'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signout() {
  const supabase = await createClient()

  // Check if user is logged in before signing out
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  } else {
    console.warn("Signout action called, but no user was logged in.");
  }

  revalidatePath('/', 'layout') // Revalidate layout to update auth state
  redirect('/login') // Redirect to login page after signout
}