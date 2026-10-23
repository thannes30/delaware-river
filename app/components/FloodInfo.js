import List from './List';

export default function FloodInfo({ floodInfo }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Flood stages
      </h2>
      <List listObject={floodInfo} />
    </section>
  );
}
