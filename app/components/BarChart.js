'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const formatTick = (time, daily, long) =>
  new Date(time).toLocaleDateString(
    'en-US',
    daily && long ? { month: 'short', year: '2-digit' } : { month: 'numeric', day: 'numeric' },
  );

const formatLabel = (time, daily) =>
  new Date(time).toLocaleString(
    'en-US',
    daily ? { dateStyle: 'medium' } : { dateStyle: 'medium', timeStyle: 'short' },
  );

export default function BarChart({ data, daily = false }) {
  return (
    <div className="h-72 sm:h-96 lg:h-[28rem]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            tickFormatter={(time) => formatTick(time, daily, data.length > 400)}
            minTickGap={40}
          />
          <YAxis yAxisId="stage" width={36} tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="flow"
            orientation="right"
            width={44}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString('en-US')}
          />
          <Tooltip labelFormatter={(time) => formatLabel(time, daily)} />
          <Legend verticalAlign="top" height={40} />
          <Area
            yAxisId="stage"
            name="Water Level (ft)"
            type="monotone"
            dataKey="stage"
            stroke="#0f4c81"
            fill="#0f4c81"
            fillOpacity={0.3}
          />
          <Area
            yAxisId="flow"
            name="Flow (cfs)"
            type="monotone"
            dataKey="flow"
            stroke="#0d9488"
            fill="#0d9488"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
