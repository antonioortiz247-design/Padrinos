'use client';

import { useMemo, useState } from 'react';
import { OrderStatus } from '@/lib/types';
import { updateOrderStatus } from '@/lib/actions';

type OrderRow = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  address?: string;
  delivery_type: string;
};

const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered'];

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  on_the_way: 'En camino',
  delivered: 'Entregado'
};

export function OrdersPanel({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<OrderRow[]>(
    initialOrders.map(o => ({
      id: o.id,
      customer: o.address || 'Cliente',
      total: o.total,
      status: o.status as OrderStatus,
      created_at: o.created_at,
      address: o.address,
      delivery_type: o.delivery_type
    }))
  );
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)), [filter, orders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert('Error al actualizar el estado: ' + result.error);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text)]">Gestión de Pedidos</h2>
          <p className="text-sm text-[var(--subtext)]">Administra los pedidos entrantes y sus estados</p>
        </div>
        <select 
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:ring-[var(--accent)]" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value as 'all' | OrderStatus)}
        >
          <option value="all">Todos los estados</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[var(--subtext)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Pedido</th>
              <th className="px-4 py-3 font-semibold">Cliente/Dirección</th>
              <th className="px-4 py-3 font-semibold text-right">Total</th>
              <th className="px-4 py-3 font-semibold text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--subtext)] italic">
                  No hay pedidos que coincidan con el filtro
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/5">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-[var(--subtext)]">#{order.id.slice(0, 8)}</span>
                    <p className="text-xs text-[var(--subtext)]">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-[var(--text)]">{order.address || 'Para recoger'}</p>
                    <p className="text-xs text-[var(--subtext)] uppercase">{order.delivery_type === 'delivery' ? 'A domicilio' : 'Recoger'}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-[var(--accent)]">
                    ${order.total}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      disabled={updatingId === order.id}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`w-full rounded-lg border p-2 text-xs font-medium transition-colors ${
                        updatingId === order.id ? 'opacity-50' : ''
                      } ${
                        order.status === 'pending' ? 'border-[var(--accent)] bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]' :
                        order.status === 'delivered' ? 'border-white/10 bg-white/5 text-[var(--text)]' :
                        'border-[rgb(var(--primary-rgb)/0.35)] bg-[rgb(var(--primary-rgb)/0.18)] text-[var(--text)]'
                      }`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>{statusLabels[status]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
