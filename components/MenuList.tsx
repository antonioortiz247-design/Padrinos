'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { CustomizationModal } from './CustomizationModal';
import { useCartStore } from '@/store/cart-store';

const sectionTitles: Record<Product['category'], string> = {
  tacos: '🌮 Tacos',
  especialidades: '➕ Extras',
  viernes: '🥤 Bebidas',
  miercoles: '🥔 Miércoles',
  jueves: '🐟 Jueves'
};

export function MenuList({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const createCartItemId = () => {
    const cryptoAny = globalThis.crypto as Crypto | undefined;
    return cryptoAny?.randomUUID ? cryptoAny.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const byCategory = Object.keys(sectionTitles).map((key) => ({
    key: key as Product['category'],
    label: sectionTitles[key as Product['category']],
    items: products.filter((product) => product.active && product.category === key && (product.stock === undefined || product.stock > 0))
  }));

  return (
    <div className="space-y-6">
      {byCategory.map((group) =>
        group.items.length ? (
          <section key={group.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="section-title text-lg sm:text-xl">{group.label}</h2>
              <span className="pill bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]">{group.items.length}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {group.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCustomize={setSelected}
                  onAdd={(item) =>
                    addItem({
                      id: createCartItemId(),
                      productId: item.id,
                      productName: item.name,
                      quantity: 1,
                      unitPrice: item.price,
                      subtotal: item.price
                    })
                  }
                />
              ))}
            </div>
          </section>
        ) : null
      )}

      {selected ? (
        <CustomizationModal
          product={selected}
          onClose={() => setSelected(null)}
          onConfirm={(config, unitPrice) => {
            addItem({
              id: createCartItemId(),
              productId: selected.id,
              productName: selected.name,
              quantity: 1,
              config,
              unitPrice,
              subtotal: unitPrice
            });
            setSelected(null);
          }}
        />
      ) : null}
    </div>
  );
}
