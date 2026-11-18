"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

interface MonthlyData {
  month: string;
  enquiries: number;
}

interface CategoryData {
  name: string;
  count: number;
}

interface AnalyticsChartsProps {
  monthlyEnquiries: MonthlyData[];
  categoryDistribution: CategoryData[];
}

const GOLD_COLORS = ["#C5A265", "#DFCA9B", "#AA874C", "#9A7737", "#6E5530", "#3E301B", "#C0C0C0"];

export default function AnalyticsCharts({
  monthlyEnquiries,
  categoryDistribution,
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Monthly Enquiry Trend Area Chart */}
      <div className="lg:col-span-2 bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-white">
              Enquiry Influx & Concierge Demand
            </h3>
            <p className="text-[11px] text-zinc-400">Monthly customer enquiry volume</p>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#C5A265] font-semibold bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            Real DB Telemetry
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyEnquiries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A265" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C5A265" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" stroke="#737373" fontSize={11} />
              <YAxis stroke="#737373" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#333333",
                  fontSize: 12,
                  color: "#FAF8F5",
                }}
              />
              <Area
                type="monotone"
                dataKey="enquiries"
                stroke="#C5A265"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Share Bar Chart */}
      <div className="bg-[#1A1A1A] border border-zinc-800 p-6 rounded-sm shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-base font-bold text-white">Catalogue Breakdown</h3>
          <p className="text-[11px] text-zinc-400">Products per jewellery category</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryDistribution}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis type="number" stroke="#737373" fontSize={10} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#A3A3A3"
                fontSize={10}
                width={70}
                tickFormatter={(val) => (val.length > 10 ? `${val.slice(0, 9)}…` : val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#333333",
                  fontSize: 12,
                  color: "#FAF8F5",
                }}
              />
              <Bar dataKey="count" fill="#C5A265" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
