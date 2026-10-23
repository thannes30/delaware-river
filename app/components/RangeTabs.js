import Link from 'next/link';
import { RANGES } from '../lib/history';

export default function RangeTabs({ place, range }) {
  return (
    <nav aria-label="Time range" className="flex flex-wrap gap-1 text-sm">
      {Object.entries(RANGES).map(([key, { label }]) => (
        <Link
          key={key}
          href={`/${place}?range=${key}`}
          scroll={false}
          aria-current={key === range ? 'true' : undefined}
          className={`rounded-full px-3 py-1 transition-colors ${
            key === range ? 'bg-river text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
