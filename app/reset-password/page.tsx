import { requestPasswordReset } from './actions' // We'll create this action next
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <p className="text-sm text-center text-muted-foreground">
          Enter your email address below, and we&apos;ll send you a link to reset your password.
        </p>
        
        <form action={requestPasswordReset} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
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