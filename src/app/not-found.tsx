import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-slate-200 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-3">
          Page not found
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition text-sm"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
