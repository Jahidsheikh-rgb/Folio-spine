import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <span className="font-serif text-base font-bold text-ink-900">
            Folio &amp; Spine Book Shop
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Powered by Node.js, Next.js &amp; MongoDB ACID Order Engine.
        </p>
      </div>
    </footer>
  );
}
