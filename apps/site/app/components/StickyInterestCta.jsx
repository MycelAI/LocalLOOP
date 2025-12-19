'use client';

import { usePathname } from 'next/navigation';

const hiddenPrefixes = ['/interest'];

export function StickyInterestCta() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return null;
  }

  return (
    <a className="sticky-cta" href="/interest" aria-label="Express interest in LocalLoop">
      <span>Express interest</span>
      <span className="sticky-cta-sub">Join the public interest list</span>
    </a>
  );
}
