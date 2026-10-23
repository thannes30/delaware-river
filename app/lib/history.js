import { GAUGES, USGS_IDS } from './nwps.js';
import { getDailyFlow } from './usgs.js';
import { createReadClient } from './supabase.js';

export const RANGES = {
  '7d': { label: '7 days', days: 7 },
  '30d': { label: '30 days', days: 30 },
  '90d': { label: '90 days', days: 90 },
  '1y': { label: '1 year', days: 365 },
  '5y': { label: '5 years', days: 1825 },
  '10y': { label: '10 years', days: 3650 },
};

export const DEFAULT_RANGE = '30d';

// Ranges up to this many days use the hourly NWPS observations instead of daily history.
export const HOURLY_MAX_DAYS = 30;

const PAGE = 1000; // Supabase's default max rows per request

const isoDate = (d) => d.toISOString().slice(0, 10);

const getStageHistory = async (lid, start) => {
  const supabase = createReadClient();
  if (!supabase) return [];

  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('readings')
      .select('date, stage_mean_ft')
      .eq('gauge_id', lid)
      .gte('date', start)
      .order('date')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Supabase readings query failed: ${error.message}`);
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
};

// Daily series for the chart: flow from USGS (decades of record), stage from our own table
// (recorded daily since the job started).
export const getDailySeries = async (place, days) => {
  const end = new Date();
  const start = isoDate(new Date(end.getTime() - days * 86400000));

  const [flowRows, stageRows] = await Promise.all([
    getDailyFlow(USGS_IDS[place], start, isoDate(end)),
    getStageHistory(GAUGES[place], start),
  ]);

  const byDate = new Map();
  for (const { date, flow } of flowRows) byDate.set(date, { flow, stage: null });
  for (const { date, stage_mean_ft } of stageRows) {
    byDate.set(date, { flow: byDate.get(date)?.flow ?? null, stage: stage_mean_ft });
  }

  const points = [...byDate]
    .sort(([a], [b]) => a.localeCompare(b))
    // noon UTC keeps the point on the right calendar day in US time zones
    .map(([date, { flow, stage }]) => ({ time: `${date}T12:00:00Z`, stage, flow }));

  return { points, stageSince: stageRows[0]?.date ?? null };
};
