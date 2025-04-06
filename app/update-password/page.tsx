import { updatePassword } from './actions' // We'll create this action next
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center">Update Password</h1>
        <p className="text-sm text-center text-muted-foreground">
          Enter your new password below.
        </p>
        
        {/* Note: The user must have arrived via a valid password reset link 
             for the update action to work, as Supabase handles the session implicitly. */}
        <form action={updatePassword} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
          {/* We should add client-side validation here later to check if passwords match */}
          <Button type="submit" className="w-full">Update Password</Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/login" className="underline text-muted-foreground hover:text-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}