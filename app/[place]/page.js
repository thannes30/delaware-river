import { notFound } from 'next/navigation';
import RiverConditions from '../components/RiverConditions';
import { GAUGES, getConditions } from '../lib/nwps';
import { DEFAULT_RANGE, HOURLY_MAX_DAYS, RANGES, getDailySeries } from '../lib/history';

export const generateStaticParams = () => Object.keys(GAUGES).map((place) => ({ place }));

export const dynamicParams = false;

export default async function PlacePage({ params, searchParams }) {
  const { place } = await params;
  const { range: rangeParam } = await searchParams;
  const range = rangeParam in RANGES ? rangeParam : DEFAULT_RANGE;
  const { days } = RANGES[range];

  const conditions = await getConditions(place);
  if (!conditions) notFound();

  const series = days > HOURLY_MAX_DAYS ? await getDailySeries(place, days) : null;

  return <RiverConditions conditions={conditions} range={range} place={place} series={series} />;
}
