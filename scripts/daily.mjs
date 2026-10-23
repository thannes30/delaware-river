// Saves daily stage/flow summaries for every gauge to Supabase.
// Each run covers the last ~30 days of NWPS observations, so a missed day heals itself.
//   npm run daily            write to the database
//   npm run daily -- --dry-run   print what would be written
import { createClient } from '@supabase/supabase-js';
import { GAUGES, getObserved } from '../app/lib/nwps.js';
import { aggregateDaily } from '../app/lib/aggregate.js';

const dryRun = process.argv.includes('--dry-run');
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!dryRun && (!url || !key)) {
  console.error('Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SECRET_KEY');
  process.exit(1);
}

const supabase = dryRun ? null : createClient(url, key);
let failed = false;

for (const [place, lid] of Object.entries(GAUGES)) {
  try {
    const rows = aggregateDaily(await getObserved(lid)).map((row) => ({
      gauge_id: lid,
      ...row,
      updated_at: new Date().toISOString(),
    }));

    if (dryRun) {
      console.log(`${place} (${lid}): ${rows.length} days, latest`, rows.at(-1));
      continue;
    }

    const { error } = await supabase.from('readings').upsert(rows, { onConflict: 'gauge_id,date' });
    if (error) throw new Error(error.message);
    console.log(`${place} (${lid}): saved ${rows.length} days through ${rows.at(-1)?.date}`);
  } catch (err) {
    failed = true;
    console.error(`${place} (${lid}): FAILED -`, err.message);
  }
}

process.exit(failed ? 1 : 0);
