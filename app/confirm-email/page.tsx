import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ConfirmEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">Check Your Email</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Thank you for signing up! A confirmation link has been sent to your email address. Please click the link to complete your registration.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        (If you don&apos;t see the email, please check your spam folder.)
      </p>
      <Button asChild variant="secondary">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}