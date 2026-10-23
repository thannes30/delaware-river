const STYLES = {
  action: 'border-yellow-300 bg-yellow-50 text-yellow-900',
  minor: 'border-orange-300 bg-orange-50 text-orange-900',
  moderate: 'border-red-300 bg-red-50 text-red-900',
  major: 'border-purple-300 bg-purple-50 text-purple-900',
};

export default function List({ listObject }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(listObject).map(([name, { stage, flow, stageUnit, flowUnit }]) => (
        <li
          key={name}
          className={`rounded-lg border p-3 ${STYLES[name] ?? 'border-slate-200 bg-white'}`}
        >
          <div className="text-xs font-semibold uppercase tracking-wide">{name}</div>
          <div className="mt-1 text-xl font-semibold">
            {stage === null ? 'n/a' : `${stage} ${stageUnit}`}
          </div>
          {flow !== null && (
            <div className="text-xs opacity-75">
              {flow.toLocaleString('en-US')} {flowUnit}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
