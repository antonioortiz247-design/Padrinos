'use client';

import Link from 'next/link';

export function FooterActions({ dashboardHref = '/admin/login' }: { dashboardHref?: string }) {
  return (
    <footer className="mt-6 border-t border-white/10 bg-[rgb(var(--bg-rgb)/0.85)] p-4 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl">
        <Link href={dashboardHref} className="secondary-btn w-full">
          Dashboard
        </Link>
      </div>
    </footer>
  );
}
