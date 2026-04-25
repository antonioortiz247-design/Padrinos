import { Header } from '@/components/Header';

const rows = [
  { name: 'El Padrino', price: 80, active: true },
  { name: 'Mar y Tierra', price: 80, active: true },
  { name: 'Pulpo al Ajillo', price: 80, active: true },
  { name: 'Camarón', price: 80, active: true },
  { name: 'Arrachera', price: 50, active: true },
  { name: 'Chistorra', price: 50, active: true },
  { name: 'Chorizo Argentino', price: 50, active: true },
  { name: 'Aguja Norteña', price: 50, active: true },
  { name: 'Queso extra', price: 15, active: true },
  { name: 'Guacamole', price: 20, active: true },
  { name: 'Salsa especial', price: 10, active: true },
  { name: 'Agua natural 1L', price: 45, active: true },
  { name: 'Refresco', price: 30, active: true }
];

export default function MenuAdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4">
      <Header title="Admin · Menú" subtitle="Crear, editar precio, activar/desactivar" />
      <section className="mt-4 rounded-xl border bg-white p-4 text-sm dark:bg-zinc-900">
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.name} className="flex items-center justify-between rounded border p-2">
              <span>{row.name}</span>
              <span>${row.price}</span>
              <button className="rounded border px-2 py-1">{row.active ? 'Activo' : 'Inactivo'}</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
