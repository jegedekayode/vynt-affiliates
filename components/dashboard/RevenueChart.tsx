'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatNaira } from '@/lib/utils';

interface RevenueChartProps {
  gmvData: { week: string; amount: number }[];
  commissionsData: { week: string; amount: number }[];
}

export default function RevenueChart({ gmvData, commissionsData }: RevenueChartProps) {
  const merged = gmvData.map((g, i) => ({
    week: g.week,
    gmv: g.amount,
    commissions: commissionsData[i]?.amount || 0,
  }));

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold text-text-1 font-[var(--font-display)] mb-1">
        Revenue & Commissions
      </h3>
      <p className="text-xs text-text-3 mb-6">GMV vs commissions paid — last 12 weeks</p>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
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
              tickFormatter={(v) => formatNaira(v)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E4E2DD',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                fontSize: 12,
              }}
              formatter={(value) => formatNaira(Number(value))}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="gmv"
              stroke="#E5A100"
              strokeWidth={2.5}
              dot={false}
              name="GMV"
            />
            <Line
              type="monotone"
              dataKey="commissions"
              stroke="#52014E"
              strokeWidth={2.5}
              dot={false}
              name="Commissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
