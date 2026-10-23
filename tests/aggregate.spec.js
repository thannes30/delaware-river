import { describe, it, expect } from 'vitest';
import { aggregateDaily } from '../app/lib/aggregate.js';

// 15-minute readings for one Eastern day (EDT = UTC-4)
const day = (date, stage) =>
  Array.from({ length: 96 }, (_, i) => {
    const utc = new Date(`${date}T04:00:00Z`).getTime() + i * 15 * 60000;
    return { validTime: new Date(utc).toISOString().replace('.000', ''), primary: stage, secondary: 1.5 };
  });

describe('aggregateDaily', () => {
  const now = new Date('2026-10-23T16:00:00Z');

  it('summarises each complete local day and skips today', () => {
    const data = [...day('2026-10-21', 3), ...day('2026-10-22', 4), ...day('2026-10-23', 5)];
    const rows = aggregateDaily({ data, secondaryUnits: 'kcfs' }, { now });
    expect(rows).toEqual([
      { date: '2026-10-21', stage_mean_ft: 3, stage_min_ft: 3, stage_max_ft: 3, flow_mean_cfs: 1500 },
      { date: '2026-10-22', stage_mean_ft: 4, stage_min_ft: 4, stage_max_ft: 4, flow_mean_cfs: 1500 },
    ]);
  });

  it('drops a partial first day and ignores missing-data markers', () => {
    const full = day('2026-10-22', 4);
    full[10].primary = -9999;
    const partial = day('2026-10-21', 3).slice(50);
    const rows = aggregateDaily({ data: [...partial, ...full], secondaryUnits: 'kcfs' }, { now });
    expect(rows.map((r) => r.date)).toEqual(['2026-10-22']);
    expect(rows[0].stage_mean_ft).toBe(4);
  });
});
