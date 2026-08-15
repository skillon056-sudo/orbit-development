import Link from "next/link";
import Emblem from "@/components/Emblem";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <Emblem className="mx-auto h-24 w-24 animate-float" />
        <h1 className="mt-6 text-5xl font-black grad-text">404</h1>
        <p className="mt-2 text-white/55">This page drifted out of orbit.</p>
        <Link href="/" className="btn btn-primary mt-6">Back to Home</Link>
      </div>
    </div>
  );
}
