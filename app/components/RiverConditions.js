import Link from 'next/link';
import BarChart from './BarChart';
import Title from './Title';
import FloodInfo from './FloodInfo';
import RangeTabs from './RangeTabs';
import { RANGES } from '../lib/history';

const formatUpdated = (time) =>
  new Date(time).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

function Stat({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold sm:text-3xl">
        {value ?? 'n/a'}
        {value != null && <span className="ml-1 text-base font-normal text-slate-500">{unit}</span>}
      </div>
    </div>
  );
}

export default function RiverConditions({ conditions, range, place, series }) {
  const { label, days } = RANGES[range];
  const chartData = series ? series.points : conditions.data.slice(-days * 24);
  const latest = conditions.data.findLast((d) => d.stage !== null || d.flow !== null);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-river hover:underline">
          &larr; Back to map
        </Link>
        <div className="mt-2">
          <Title title={conditions.title} />
          {latest && (
            <p className="mt-1 text-sm text-slate-500">Last reading {formatUpdated(latest.time)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Stat label="Water level" value={latest?.stage} unit={conditions.stageUnit} />
        <Stat label="Flow" value={latest?.flow?.toLocaleString('en-US')} unit="cfs" />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Last {label}
          </h2>
          <RangeTabs place={place} range={range} />
        </div>
        <BarChart data={chartData} daily={Boolean(series)} />
        {series && (
          <p className="mt-2 text-xs text-slate-500">
            Flow is the USGS daily mean.{' '}
            {series.stageSince
              ? `Water level has been recorded daily since ${series.stageSince}, so earlier dates show flow only.`
              : 'Daily water level recording has not started yet, so only flow is shown.'}
          </p>
        )}
      </section>

      <FloodInfo floodInfo={conditions.floodInfo} />
    </div>
  );
}
