import { login, signup } from '@/app/login/actions' // Use path alias
import { Button } from '@/components/ui/button' // Use ShadCN button
import { Input } from '@/components/ui/input'   // Use ShadCN input
import { Label } from '@/components/ui/label'   // Use ShadCN label
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-center">Login / Sign Up</h1>
        
        {/* Email/Password Form */}
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button formAction={login}>Log In</Button>
            <Button formAction={signup} variant="secondary">Sign Up</Button>
          </div>
          {/* Add Forgot Password Link */}
          <div className="text-sm text-center pt-2">
            <Link href="/reset-password" className="underline text-muted-foreground hover:text-primary">
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Optional: Add Google Login later */}
        {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Login with Google (Coming Soon)
        </Button> */}

        <div className="text-center text-sm">
          <Link href="/" className="underline text-muted-foreground hover:text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}