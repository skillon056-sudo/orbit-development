"use client";
import Link from "next/link";
import { useEffect } from "react";

// Graceful boundary — replaces the default white "Application error" screen.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <h1 className="text-4xl font-black grad-text">Something went wrong</h1>
        <p className="mt-3 max-w-md text-white/55">
          We hit a snag loading this page. Please try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
