// NOAA National Water Prediction Service: https://api.water.noaa.gov/nwps/v1/docs/
const NWPS_URL = 'https://api.water.noaa.gov/nwps/v1/gauges';

export const GAUGES = {
  haleeddy: 'HLEN6',
  callicoon: 'CCRN6',
  barryville: 'BRYN6',
  portjervis: 'MTMP1',
  montague: 'MTGN4',
};

// USGS site IDs for the same gauges, used for the long-term daily record
export const USGS_IDS = {
  haleeddy: '01426500',
  callicoon: '01427510',
  barryville: '01428500',
  portjervis: '01434000',
  montague: '01438500',
};

// NWPS marks missing values with -9999 (or -999 on gauges with no flow sensor)
const NO_DATA = [-9999, -999];

export const toCfs = (value, unit) => (unit === 'kcfs' ? Math.round(value * 1000) : value);

export const clean = (value) => (value == null || NO_DATA.includes(value) ? null : value);

export const parseFloodInfo = (flood) =>
  Object.fromEntries(
    Object.entries(flood.categories)
      .map(([name, { stage, flow }]) => [
        name,
        { stage: clean(stage), flow: clean(flow), stageUnit: flood.stageUnits, flowUnit: flood.flowUnits },
      ])
      .sort(([, a], [, b]) => a.stage - b.stage)
  );

// Observations come every 15 minutes; keep the top of each hour to keep the chart readable.
export const parseObserved = ({ data, secondaryUnits }) =>
  data
    .filter(({ validTime }) => validTime.slice(14, 16) === '00')
    .map(({ validTime, primary, secondary }) => ({
      time: validTime,
      stage: clean(primary),
      flow: clean(secondary) === null ? null : toCfs(secondary, secondaryUnits),
    }));

export const getObserved = async (lid) => {
  const res = await fetch(`${NWPS_URL}/${lid}/stageflow/observed`, { next: { revalidate: 900 } });
  if (!res.ok) throw new Error(`NWPS observed request failed for ${lid}: ${res.status}`);
  return res.json();
};

export const getConditions = async (place) => {
  const lid = GAUGES[place];
  if (!lid) return null;

  const [gaugeRes, observedRes] = await Promise.all([
    fetch(`${NWPS_URL}/${lid}`, { next: { revalidate: 900 } }),
    fetch(`${NWPS_URL}/${lid}/stageflow/observed`, { next: { revalidate: 900 } }),
  ]);
  if (!gaugeRes.ok || !observedRes.ok) {
    throw new Error(`NWPS request failed for ${lid}: ${gaugeRes.status}/${observedRes.status}`);
  }
  const gauge = await gaugeRes.json();
  const observed = await observedRes.json();

  return {
    title: gauge.name,
    usgsId: gauge.usgsId,
    stageUnit: gauge.flood.stageUnits,
    floodInfo: parseFloodInfo(gauge.flood),
    data: parseObserved(observed),
  };
};
