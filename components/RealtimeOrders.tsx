'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  total: number;
  status: string;
  created_at?: string;
};

export function RealtimeOrders({ initialOrders, businessId }: { initialOrders: Order[], businessId: string }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    if (!supabase || !supabase.channel) {
      console.warn('Supabase no está configurado para Realtime.');
      return;
    }

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `business_id=eq.${businessId}`
        },
        (payload) => {
          const newOrder = payload.new as Order;
          setOrders((prev) => [newOrder, ...prev].slice(0, 10));
          
          // Notificación sonora opcional
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('¡Nuevo Pedido!', { body: `Orden por $${newOrder.total}` });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId]);

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--text)]">Pedidos Recientes (En vivo)</h2>
        <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
      </div>
      <ul className="mt-3 space-y-2">
        {orders.length === 0 ? (
          <p className="text-[var(--subtext)] text-center py-4">No hay pedidos recientes</p>
        ) : (
          orders.map((row) => (
            <li key={row.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3 bg-white/5">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[var(--subtext)]">#{row.id.slice(0, 8)}</span>
                <span className="font-bold text-[var(--text)]">${row.total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`pill ${
                  row.status === 'pending' ? 'bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]' : 
                  row.status === 'delivered' ? 'bg-white/10 text-[var(--text)]' : 
                  'bg-[rgb(var(--primary-rgb)/0.25)] text-[var(--text)]'
                }`}>
                  {row.status}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
