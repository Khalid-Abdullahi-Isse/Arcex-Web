"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, CircleDollarSign, LandPlot, ReceiptText } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { RowSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesAnalytics } from "@/hooks/use-admin";
import { formatMoney } from "@/lib/format";

const STATUS_COLORS = ["#555f6f", "#006947", "#596373", "#ba1a1a"];

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultFrom() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return isoDate(date);
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CircleDollarSign;
}) {
  return (
    <div className="rounded-lg border border-pf-border-default bg-pf-bg-surface p-3.5">
      <div className="flex items-center gap-2 text-[13px] text-pf-text-tertiary">
        <Icon size={15} strokeWidth={1.75} />
        {label}
      </div>
      <p className="mt-2 truncate text-[21px] font-semibold text-pf-text-primary">{value}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(() => isoDate(new Date()));
  const [granularity, setGranularity] = useState<"day" | "week" | "month">("month");
  const { summary, trend, byRegion, status, listedVsSold, isLoading, error } = useSalesAnalytics({
    from,
    to,
    granularity,
  });

  const statusData = useMemo(
    () =>
      status
        ? [
            { name: "Pending", value: status.pendingReview },
            { name: "Approved", value: status.approved },
            { name: "Sold", value: status.sold },
            { name: "Rejected", value: status.rejected },
          ]
        : [],
    [status],
  );

  return (
    <div className="mx-auto w-full max-w-[1120px] space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-pf-text-primary">Sales analytics</h1>
          <p className="mt-1 text-[14px] text-pf-text-tertiary">
            Track confirmed land sales, sale value, listing inventory, and regional demand.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1">
            From
            <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="grid gap-1">
            To
            <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
          <label className="grid gap-1">
            Granularity
            <Select value={granularity} onValueChange={(value) => setGranularity(value as typeof granularity)}>
              <SelectTrigger className="h-9 min-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <Button
            type="button"
            variant="outline"
            className="h-9 border"
            onClick={() => {
              setFrom(defaultFrom());
              setTo(isoDate(new Date()));
              setGranularity("month");
            }}
          >
            <CalendarDays size={14} strokeWidth={1.75} data-icon="inline-start" />
            12 months
          </Button>
        </div>
      </div>

      {error ? (
        <EmptyState icon={ReceiptText} title="Couldn't load analytics" description={error.message} />
      ) : isLoading && !summary ? (
        <RowSkeleton />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total sold count" value={String(summary?.totalSales ?? 0)} icon={ReceiptText} />
            <StatCard label="Total sold value" value={formatMoney(summary?.totalValue ?? 0)} icon={CircleDollarSign} />
            <StatCard label="Average sale price" value={formatMoney(summary?.avgPrice ?? 0)} icon={CircleDollarSign} />
            <StatCard
              label="Total listed value"
              value={formatMoney(listedVsSold?.totalListedValue ?? 0)}
              icon={LandPlot}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-lg border border-pf-border-default bg-pf-bg-surface p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-pf-text-primary">Sales trend</h2>
                <p className="text-[13px] text-pf-text-tertiary">
                  Sold value: {formatMoney(listedVsSold?.totalSoldValue ?? 0)}
                </p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 12, right: 18, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#e1e3e4" vertical={false} />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Line type="monotone" dataKey="totalValue" stroke="#a13a00" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-lg border border-pf-border-default bg-pf-bg-surface p-4">
              <h2 className="mb-3 text-pf-text-primary">Status breakdown</h2>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={2}>
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[13px] text-pf-text-secondary">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-md bg-pf-bg-elevated px-2.5 py-2">
                    <span>{item.name}</span>
                    <span className="font-semibold text-pf-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-lg border border-pf-border-default bg-pf-bg-surface p-4">
            <h2 className="mb-3 text-pf-text-primary">By region</h2>
            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byRegion} margin={{ top: 12, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="#e1e3e4" vertical={false} />
                    <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Bar dataKey="totalValue" fill="#006947" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-hidden rounded-lg border border-pf-border-subtle">
                <div className="grid grid-cols-[1fr_80px_110px] bg-pf-bg-elevated px-3 py-2 text-[12px] font-medium text-pf-text-tertiary">
                  <span>Region</span>
                  <span>Sales</span>
                  <span className="text-right">Total value</span>
                </div>
                {byRegion.map((row) => (
                  <div
                    key={row.region}
                    className="grid grid-cols-[1fr_80px_110px] border-t border-pf-border-subtle px-3 py-2 text-[13px]"
                  >
                    <span className="truncate text-pf-text-primary">{row.region}</span>
                    <span className="text-pf-text-secondary">{row.count}</span>
                    <span className="text-right font-medium text-pf-text-primary">{formatMoney(row.totalValue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
