export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
      <p>
        Made by{' '}
        <a
          href="https://www.linkedin.com/in/timhannes/"
          target="_blank"
          rel="noreferrer noopener"
          className="text-river underline-offset-2 hover:underline"
        >
          Tim Hannes
        </a>
        . Data from NOAA NWPS.
      </p>
    </footer>
  );
}
