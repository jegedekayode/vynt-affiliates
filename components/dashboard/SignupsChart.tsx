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

interface SignupsChartProps {
  data: { week: string; count: number }[];
}

export default function SignupsChart({ data }: SignupsChartProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-1">
        Signups Over Time
      </h3>
      <p className="text-xs text-text-3 mb-6">Weekly referral signups — last 12 weeks</p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52014E" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#52014E" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DD" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#8A8A8A' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E4E2DD',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#E5A100"
              strokeWidth={2.5}
              fill="url(#signupGradient)"
              name="Signups"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
