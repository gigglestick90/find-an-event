'use client'; // Need client component to read search params

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <h1 className="text-4xl font-bold text-destructive mb-4">Error</h1>
      <p className="text-lg text-muted-foreground mb-6">
        {errorMessage || 'An unexpected error occurred.'}
      </p>
      <Button asChild>
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}