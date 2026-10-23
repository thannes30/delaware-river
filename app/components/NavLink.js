'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, label }) {
  const active = usePathname() === href;

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-3 py-1 transition-colors ${
        active ? 'bg-white text-river' : 'text-white/80 hover:bg-white/15 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );
}
