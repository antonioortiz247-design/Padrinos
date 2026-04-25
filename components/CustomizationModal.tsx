'use client';

import { useMemo, useState } from 'react';
import { calculateTacoPrice } from '@/lib/pricing';
import { Product, TacoConfig } from '@/lib/types';

const proteinOptions = ['Arrachera', 'Camarón', 'Pulpo al Ajillo', 'Chistorra', 'Chorizo Argentino', 'Aguja Norteña'];

export function CustomizationModal({
  product,
  onClose,
  onConfirm
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (config: TacoConfig, unitPrice: number) => void;
}) {
  const [tortilla, setTortilla] = useState<TacoConfig['tortilla']>('maiz');
  const [extras, setExtras] = useState<TacoConfig['extras']>([]);
  const [protein, setProtein] = useState(proteinOptions[0]);
  const [notes, setNotes] = useState('');
  const canSelectProtein = product.category === 'especialidades' && (product.name === 'Burrito' || product.name === 'Gringas');
  const canSelectTacoOptions = !canSelectProtein;

  const unitPrice = useMemo(() => calculateTacoPrice({ tortilla, extras, notes }, product.price), [extras, notes, product.price, tortilla]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-end bg-[rgb(var(--bg-rgb)/0.7)] p-2 sm:place-items-center">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[rgb(var(--bg-rgb)/0.85)] p-4 shadow-2xl">
        <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">{product.name}</h2>
        <p className="mt-1 text-sm text-[var(--subtext)]">Personaliza tu pedido y agrega notas si lo necesitas.</p>

        <div className="mt-4 space-y-4 text-sm">
          {canSelectTacoOptions ? (
            <>
              <div>
                <label className="font-semibold text-[var(--text)]">Tortilla</label>
                <div className="mt-2 flex gap-2">
                  {(['maiz', 'harina'] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setTortilla(item)}
                      className={`secondary-btn px-3 py-1.5 capitalize ${tortilla === item ? 'border-[var(--accent)] bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]' : ''}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--text)]">Extras</label>
                <div className="mt-2 flex gap-2">
                  {(['queso', 'papas'] as const).map((extra) => (
                    <button
                      key={extra}
                      onClick={() =>
                        setExtras((prev) => (prev.includes(extra) ? prev.filter((item) => item !== extra) : [...prev, extra]))
                      }
                      className={`secondary-btn px-3 py-1.5 capitalize ${extras.includes(extra) ? 'border-[var(--accent)] bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]' : ''}`}
                    >
                      {extra}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {canSelectProtein ? (
            <div>
              <label className="font-semibold text-[var(--text)]">Ingrediente</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {proteinOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setProtein(item)}
                    className={`secondary-btn px-3 py-1.5 ${protein === item ? 'border-[var(--accent)] bg-[rgb(var(--accent-rgb)/0.18)] text-[var(--accent)]' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas" className="input-field min-h-24 resize-none" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-[var(--accent)]">${unitPrice}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="secondary-btn px-3 py-2 text-sm">
              Cerrar
            </button>
            <button
              onClick={() =>
                onConfirm(
                  {
                    tortilla: canSelectProtein ? 'maiz' : tortilla,
                    extras: canSelectProtein ? [] : extras,
                    protein: canSelectProtein ? protein : undefined,
                    notes
                  },
                  unitPrice
                )
              }
              className="primary-btn px-3 py-2 text-sm"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
