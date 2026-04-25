'use client';

import { useCartStore } from '@/store/cart-store';
import { useState, useEffect } from 'react';
import { ShoppingBag, X, ChevronRight, ShoppingCart } from 'lucide-react';

export function FloatingCart() {
  const { items, getTotal, getSubtotal } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratación en Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || items.length === 0) return null;

  const total = getTotal();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Botón flotante principal */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] text-[var(--bg)] shadow-soft-xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag size={28} className="transition-transform group-hover:rotate-12" />
            <span className="absolute -right-3 -top-3 flex h-7 w-7 animate-bounce items-center justify-center rounded-full bg-zinc-900 text-[12px] font-black text-white shadow-lg border-2 border-white">
              {itemCount}
            </span>
          </div>
        </button>
      )}

      {/* Mini-resumen expansible con efecto glassmorphism */}
      {isOpen && (
        <div className="glass-effect w-[90vw] max-w-[360px] overflow-hidden rounded-[2.5rem] p-0 shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-5">
            <div>
              <h3 className="text-lg font-black text-[var(--text)] flex items-center gap-2 uppercase tracking-tight">
                <ShoppingCart size={20} className="text-[var(--accent)]" />
                Pedido
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--subtext)]">Resumen actual</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/10 p-2 text-[var(--subtext)] transition-colors hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="max-h-[35vh] overflow-y-auto px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[rgb(var(--accent-rgb)/0.18)] text-xs font-black text-[var(--accent)]">
                    {item.quantity}x
                  </div>
                  <span className="text-sm font-bold text-[var(--subtext)] truncate max-w-[150px]">
                    {item.productName}
                  </span>
                </div>
                <span className="text-sm font-black text-[var(--text)]">${item.subtotal}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 px-6 py-6">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--subtext)]">Total a pagar</p>
                <p className="text-3xl font-black tracking-tighter text-[var(--accent)]">${total}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--subtext)] italic">Precios con IVA</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsOpen(false);
                document.querySelector('aside')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="primary-btn w-full group"
            >
              Confirmar Pedido
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
