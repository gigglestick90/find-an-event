import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResetPasswordConfirmPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">Check Your Email</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        If an account exists for the email address you entered, a password reset link has been sent. Please check your inbox (and spam folder) to continue.
      </p>
      <Button asChild variant="secondary">
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  );
}