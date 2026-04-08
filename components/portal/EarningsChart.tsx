'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface EarningsDataPoint {
  week: string;
  amount: number;
}

interface EarningsChartProps {
  data: EarningsDataPoint[];
}

function formatY(value: number) {
  if (value >= 1000) return `₦${value / 1000}k`;
  return `₦${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="text-text-3 mb-1">{label}</p>
        <p className="font-bold text-vynt">₦{payload[0].value.toLocaleString('en-NG')}</p>
      </div>
    );
  }
  return null;
}

export default function EarningsChart({ data }: EarningsChartProps) {
  return (
    <div className="bg-white rounded-xl border border-border px-5 py-5 h-full">
      <p className="text-sm font-bold text-text-1 mb-4">Earnings Over Time</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#52014E" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#52014E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DD" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: '#8A8A8A', fontFamily: 'var(--font-inter)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatY}
            tick={{ fontSize: 10, fill: '#8A8A8A', fontFamily: 'var(--font-inter)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E4E2DD', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#52014E"
            strokeWidth={2}
            fill="url(#earningsGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#52014E', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
