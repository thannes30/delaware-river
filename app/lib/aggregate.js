import { clean, toCfs } from './nwps.js';

const TIME_ZONE = 'America/New_York';

const localParts = (iso, timeZone) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-CA', { timeZone }),
    hour: Number(d.toLocaleString('en-US', { timeZone, hour: 'numeric', hourCycle: 'h23' })),
  };
};

const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const round = (value, places) => Number(value.toFixed(places));

// Collapse NWPS observations (15-minute) into one row per gauge-local calendar day.
// Skips today and any day the data doesn't span (e.g. the first day of the 30-day window).
export const aggregateDaily = ({ data, secondaryUnits }, { now = new Date(), timeZone = TIME_ZONE } = {}) => {
  const today = localParts(now.toISOString(), timeZone).date;
  const days = new Map();

  for (const { validTime, primary, secondary } of data) {
    const { date, hour } = localParts(validTime, timeZone);
    if (!days.has(date)) days.set(date, { hours: [], stage: [], flow: [] });
    const day = days.get(date);
    day.hours.push(hour);
    const stage = clean(primary);
    const flow = clean(secondary);
    if (stage !== null) day.stage.push(stage);
    if (flow !== null) day.flow.push(toCfs(flow, secondaryUnits));
  }

  return [...days]
    .filter(([date, day]) => date < today && Math.min(...day.hours) <= 1 && Math.max(...day.hours) >= 22)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, day]) => ({
      date,
      stage_mean_ft: day.stage.length ? round(mean(day.stage), 2) : null,
      stage_min_ft: day.stage.length ? Math.min(...day.stage) : null,
      stage_max_ft: day.stage.length ? Math.max(...day.stage) : null,
      flow_mean_cfs: day.flow.length ? Math.round(mean(day.flow)) : null,
    }));
};
