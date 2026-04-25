import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buildPathWithNegocio, normalizeBusinessIdentifier } from '@/lib/business-config';

async function loginAction(formData: FormData) {
  'use server';

  const password = String(formData.get('password') ?? '');
  const negocio = normalizeBusinessIdentifier(String(formData.get('negocio') ?? ''));

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  if (password !== adminPassword) {
    redirect('/admin/login?error=1');
  }

  cookies().set('admin_session', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  redirect(buildPathWithNegocio('/admin/dashboard', negocio));
}

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string; negocio?: string } }) {
  const hasError = searchParams.error === '1';
  const negocio = normalizeBusinessIdentifier(searchParams.negocio);

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center p-4">
      <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <img src="/logopadrinos.png" alt="Logo Los Padrinos – Mar y Tierra" className="h-12 w-12 rounded-full border border-white/10 object-cover" />
          <h1 className="text-xl font-bold text-[var(--accent)]">Ingreso admin</h1>
        </div>
        <p className="mt-1 text-sm text-[var(--subtext)]">Ingresa tu contraseña para abrir el dashboard del dueño.</p>

        <form action={loginAction} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text)]">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--subtext)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.2)]"
            />
          </div>
          {hasError ? <p className="text-sm text-red-600">Contraseña inválida.</p> : null}
          <button type="submit" className="w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--bg)]">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
