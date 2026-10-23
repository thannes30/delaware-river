// USGS Water Data OGC API: https://api.waterdata.usgs.gov/ogcapi/v0/
const DAILY_URL = 'https://api.waterdata.usgs.gov/ogcapi/v0/collections/daily/items';

const FLOW = '00060'; // discharge, ft^3/s
const MEAN = '00003';

// Daily mean flow in cfs for [start, end], both YYYY-MM-DD. Results arrive unordered.
export const getDailyFlow = async (usgsId, start, end) => {
  const params = new URLSearchParams({
    f: 'json',
    monitoring_location_id: `USGS-${usgsId}`,
    parameter_code: FLOW,
    statistic_id: MEAN,
    time: `${start}/${end}`,
    limit: '10000',
    skipGeometry: 'true',
    properties: 'time,value',
  });

  const res = await fetch(`${DAILY_URL}?${params}`, { next: { revalidate: 6 * 60 * 60 } });
  if (!res.ok) throw new Error(`USGS daily request failed for ${usgsId}: ${res.status}`);
  const { features } = await res.json();

  return features
    .map(({ properties }) => ({ date: properties.time, flow: Number(properties.value) }))
    .filter(({ flow }) => Number.isFinite(flow))
    .sort((a, b) => a.date.localeCompare(b.date));
};
