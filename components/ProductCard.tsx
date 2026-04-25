'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { Plus, Settings2 } from 'lucide-react';

const PRODUCT_BADGES: Record<string, string> = {
  'El Padrino': 'Especialidad',
  'Mar y Tierra': 'Mas vendido',
  'Pulpo al Ajillo': 'Nuevo'
};

export function ProductCard({
  product,
  onCustomize,
  onAdd
}: {
  product: Product;
  onCustomize: (product: Product) => void;
  onAdd: (product: Product) => void;
}) {
  const canCustomize = product.category === 'tacos' || product.customizable;

  return (
    <article className="surface-card group flex flex-col overflow-hidden p-0 sm:flex-row sm:items-center sm:gap-6 sm:pr-6">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-36 sm:rounded-l-none sm:rounded-r-3xl">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 150px"
          />
        ) : (
          <div className="grid h-full place-items-center bg-white/5 text-[10px] font-black uppercase tracking-widest text-[var(--subtext)]">
            Sin Imagen
          </div>
        )}
        {PRODUCT_BADGES[product.name] ? (
          <div className="absolute left-4 top-4">
            <span className="pill bg-[rgb(var(--bg-rgb)/0.85)] text-[var(--accent)] shadow-sm backdrop-blur-sm">
              {PRODUCT_BADGES[product.name]}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-black tracking-tight text-[var(--text)]">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-[var(--subtext)]">
                {product.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-black tracking-tighter text-[var(--accent)]">
              ${product.price}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 sm:mt-4">
          {canCustomize ? (
            <button 
              onClick={() => onCustomize(product)} 
              className="secondary-btn w-full py-2 text-xs sm:w-auto"
            >
              <Settings2 size={14} />
              Personalizar
            </button>
          ) : (
            <button 
              onClick={() => onAdd(product)} 
              className="primary-btn w-full py-2 text-xs sm:w-auto"
            >
              <Plus size={16} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
