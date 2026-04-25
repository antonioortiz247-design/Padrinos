'use client';

type Metrics = {
  sales: number;
  orders: number;
  avgTicket: number;
  topProducts: string;
};

export function AdminPanel({ metrics }: { metrics: Metrics }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Ventas del día" value={`$${metrics.sales}`} />
      <Card label="Total de pedidos" value={`${metrics.orders}`} />
      <Card label="Ticket promedio" value={`$${metrics.avgTicket}`} />
      <Card label="Más vendidos" value={metrics.topProducts} />
    </section>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-[var(--subtext)]">{label}</p>
      <p className="mt-2 text-lg font-bold text-[var(--text)]">{value}</p>
    </article>
  );
}
