import Link from 'next/link';
import NavLink from './NavLink';

const links = [
  { href: '/', label: 'Map' },
  { href: '/haleeddy', label: 'Hale Eddy, NY' },
  { href: '/callicoon', label: 'Callicoon, NY' },
  { href: '/barryville', label: 'Barryville, NY' },
  { href: '/portjervis', label: 'Port Jervis, NY' },
  { href: '/montague', label: 'Montague, NJ' },
];

export default function Header() {
  return (
    <header className="bg-river text-white shadow">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Delaware River Conditions
        </Link>
        <nav className="-mx-1 flex flex-wrap gap-1 text-sm">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>
      </div>
    </header>
  );
}
