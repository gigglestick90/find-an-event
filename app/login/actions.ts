'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server' // Use the async version we created

export async function login(formData: FormData) {
  const supabase = await createClient() // Await the client creation

  // Basic validation (consider more robust validation)
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    // Handle missing fields - maybe redirect back with an error message?
    // For now, redirecting to a generic error page
    console.error('Login Error: Email or password missing');
    return redirect('/error?message=Email and password are required') 
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Supabase Login Error:', error.message);
    // Redirect to an error page or back to login with an error message
    return redirect(`/error?message=Could not authenticate user: ${error.message}`) 
  }

  revalidatePath('/', 'layout') // Revalidate the layout to update auth state
  // Redirect to home page with a cache-busting query param to force reload
  redirect(`/?refresh=${Date.now()}`)
}

export async function signup(formData: FormData) {
  const supabase = await createClient() // Await the client creation

  // Basic validation
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    console.error('Signup Error: Email or password missing');
    return redirect('/error?message=Email and password are required for signup')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Optional: Add email redirect URL if you want users to land somewhere specific
      // after clicking the confirmation link. Defaults to site URL.
      // emailRedirectTo: `${origin}/auth/callback`, 
    },
  })

  if (error) {
     console.error('Supabase Signup Error:', error.message);
    // Redirect to an error page or back to login with an error message
    return redirect(`/error?message=Could not sign up user: ${error.message}`)
  }

  revalidatePath('/', 'layout') 
  // Redirect to a page telling the user to check their email for confirmation
  redirect('/confirm-email') 
}