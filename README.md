# Delaware River Conditions

Live water levels and flow for gauges along the upper Delaware River, with a browsable history.
Live site: [delaware-river.netlify.app](https://delaware-river.netlify.app/)

## What the app does

- **Home page:** an interactive map centered on Barryville. Each gauge is a marker; clicking one opens that town's page.
- **Town pages** (`/haleeddy`, `/callicoon`, `/barryville`, `/portjervis`, `/montague`):
  - the latest water level (stage, ft) and flow (cfs), with the time of the last reading
  - a chart of stage and flow over a selectable time range: 7 days, 30 days, 90 days, 1 year, 5 years or 10 years
  - NOAA's flood stages for the gauge (action, minor, moderate, major)
- The selected range lives in the URL (`?range=1y`), so any view can be linked to.

## Data sources

| Source | Used for |
|---|---|
| [NOAA NWPS API](https://api.water.noaa.gov/nwps/v1/docs/) | Gauge names, flood stages, and the last ~30 days of 15-minute stage and flow readings |
| [USGS Water Data OGC API](https://api.waterdata.usgs.gov/ogcapi/v0/) | Daily mean flow going back decades (the `daily` collection) |
| Supabase (Postgres) | Daily water level (stage) history that this app records itself |

USGS publishes no daily stage for these gauges, which is why the app saves its own. Stage history therefore
starts on the day the nightly job began and grows from there; flow history already covers the full range.

Each gauge is identified by its NWPS ID (e.g. `BRYN6`) and its USGS site ID (e.g. `01428500`); the mapping from
town to IDs lives in `app/lib/nwps.js`.

## Architecture

```
                 NOAA NWPS ──────────────┐ (15-min readings, flood stages)
                                         ▼
 Browser ◄── Next.js on Netlify ◄── server-side data fetching
                                         ▲
                 USGS daily flow ────────┤ (decades of history)
                                         │
                 Supabase `readings` ────┘ (daily stage history)
                         ▲
                         │ upsert nightly
              GitHub Actions cron ◄── NOAA NWPS
```

### Web app (Next.js, App Router)

- `app/page.js`, `app/[place]/page.js`: the two routes. The town page reads the `range` search param and fetches
  everything on the server, so the browser receives finished HTML plus the chart.
- **Short ranges (7 and 30 days):** hourly points taken from the NWPS observations.
- **Long ranges (90 days and up):** a daily series built by `app/lib/history.js`, which merges USGS daily flow with
  stage rows from Supabase by date. Dates with flow but no saved stage show flow only, and a note under the chart
  states when stage recording began.
- Fetches are cached (NWPS 15 minutes, USGS 6 hours) so page views don't hit the government APIs each time.
- `app/lib/nwps.js` and `app/lib/usgs.js` are the API clients. Missing-data markers from NWPS (`-9999`, `-999`)
  become `null`, and flow in kcfs is converted to cfs.
- The browser only ever uses Supabase's publishable key, and Row Level Security allows that key to read only.

### Components

- `Header`, `NavLink`, `Footer`: shared layout and navigation (`NavLink` highlights the current page).
- `LocationsMap` and `MapView`: [Leaflet](https://leafletjs.com/) with OpenStreetMap tiles (no API key). Leaflet
  needs `window`, so the map loads client-side only.
- `RiverConditions`: the town page body: stat cards, range tabs, chart and flood stages.
- `RangeTabs`: server-rendered links that set the `range` param.
- `BarChart`: a [Recharts](https://recharts.org/) area chart with stage on the left axis and flow on the right.
- `FloodInfo` and `List`: colored cards for the flood stages.

### Nightly job

`.github/workflows/daily.yml` runs `scripts/daily.mjs` every day at 08:00 UTC (3-4am Eastern), after the previous
Eastern-time day has fully closed. It can also be started by hand from the Actions tab.

For each gauge the script:

1. fetches the last ~30 days of 15-minute observations from NWPS
2. groups them by Eastern-time calendar day, skipping today and any partial day
3. computes mean, min and max stage and mean flow for each day (`app/lib/aggregate.js`)
4. upserts the rows into Supabase, keyed on `(gauge_id, date)`

Because every run rewrites the last 30 days, re-running is safe and a missed night heals itself on the next run.
The job writes with Supabase's secret key, stored as a GitHub Actions secret, and a failed run emails the repo owner.

### Database

One table, `readings`, with a primary key of `(gauge_id, date)`:

| Column | Notes |
|---|---|
| `gauge_id` | NWPS ID, e.g. `BRYN6` |
| `date` | Eastern-time calendar day |
| `stage_mean_ft`, `stage_min_ft`, `stage_max_ft` | daily water level |
| `flow_mean_cfs` | daily mean flow from NWPS |
| `approval_status`, `updated_at` | bookkeeping |

Row Level Security is on with a public read policy, so only the secret key can write.

### Hosting

Netlify builds and serves the Next.js app (`netlify.toml` pins the build command, publish directory, Node 24 and
the Next.js runtime plugin). The nightly job runs on GitHub Actions rather than Netlify so it keeps working
independently of the site.

## Tech stack

Next.js 16, React 19, Tailwind CSS 4, Recharts, Leaflet / react-leaflet, Supabase, Vitest. Node 24.

## Tests

Vitest covers the pure data logic: NWPS parsing, daily aggregation and date formatting (`tests/`).
