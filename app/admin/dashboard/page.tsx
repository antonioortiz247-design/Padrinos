import { AdminPanel } from '@/components/AdminPanel';
import { AdminLiveQueriesPanel } from '@/components/AdminLiveQueriesPanel';
import { Header } from '@/components/Header';
import { getOwnerDashboardMetrics } from '@/lib/admin-queries';
import { RealtimeOrders } from '@/components/RealtimeOrders';
import { ProductPriceManager } from '@/components/ProductPriceManager';
import { getRequestedOrConfiguredBusinessIdentifier, normalizeBusinessIdentifier } from '@/lib/business-config';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // En una versión final, esto vendría del perfil del usuario logueado
  const businessIdentifier =
    process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID ||
    process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG ||
    'padrinos';

  try {
    // Obtener métricas y productos reales del negocio
    const metrics = await getOwnerDashboardMetrics(businessIdentifier);

    return (
      <main className="min-h-screen">
        <Header title={`Admin · ${metrics.businessName}`} subtitle="Ventas y rendimiento del día" />
        <div className="mx-auto w-full max-w-6xl space-y-4 px-3 pb-8 pt-4 sm:px-4 sm:pb-10 sm:pt-5 md:space-y-5">
          {metrics.products.length === 0 && (
            <section className="surface-card border-white/10 bg-white/5 p-4 sm:p-5">
              <h3 className="text-base font-extrabold tracking-tight text-[var(--accent)] sm:text-lg">
                No hay productos en la base de datos
              </h3>
              <p className="mt-1 text-sm text-[var(--subtext)]">
                Actualmente se muestra el menú de demostración a tus clientes porque la base de datos está vacía para este negocio.
              </p>
            </section>
          )}

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
            <div className="space-y-4">
              <div className="surface-card p-3 sm:p-4">
                <AdminPanel metrics={metrics} />
              </div>
              <div className="surface-card p-3 sm:p-4">
                <AdminLiveQueriesPanel />
              </div>
              <div className="surface-card p-3 sm:p-4">
                <RealtimeOrders initialOrders={metrics.recentOrders} businessId={businessIdentifier} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="min-w-0">
                <ProductPriceManager products={metrics.products as any} businessId={businessIdentifier} />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <main className="min-h-screen">
        <Header title="Admin · Dashboard" subtitle="Ventas y rendimiento del día" />
        <div className="mx-auto w-full max-w-3xl px-3 pb-8 pt-6 sm:px-4">
          <section className="surface-card border-white/10 bg-white/5 p-5 text-center sm:p-7">
            <h2 className="text-lg font-extrabold tracking-tight text-[var(--accent)] sm:text-xl">
              Error al cargar el dashboard
            </h2>
            <p className="mt-2 text-sm text-[var(--subtext)]">
              Asegúrate de que las variables de entorno de Supabase estén configuradas correctamente en Vercel.
            </p>
            <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-xs text-[var(--subtext)] sm:p-4">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </pre>
          </section>
        </div>
      </main>
    );
  }
}
