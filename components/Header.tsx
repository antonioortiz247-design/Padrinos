'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  eventHref?: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const OPENING_MINUTE = 9 * 60 + 30; // 09:30
const CLOSING_MINUTE = 15 * 60; // 15:00

function isWithinOrderSchedule(date: Date): boolean {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes >= OPENING_MINUTE && minutes <= CLOSING_MINUTE;
}

export function Header({ title, subtitle, isOpen, eventHref }: HeaderProps) {
  // Forzado a true para pruebas fuera de horario
  const openNow = useMemo(() => (typeof isOpen === 'boolean' ? isOpen : true), [isOpen]);
  const [logoError, setLogoError] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      window.alert('Para instalar la app abre el menú del navegador y selecciona "Agregar a pantalla de inicio".');
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgb(var(--bg-rgb)/0.85)] px-4 py-3 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="transition-transform active:scale-95 hover:scale-105">
            {!logoError ? (
              <img
                src="/logotacosricos.png"
                alt="Logo Los Padrinos – Mar y Tierra"
                className="h-12 w-12 rounded-2xl border border-white/10 object-cover shadow-sm"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[rgb(var(--accent-rgb)/0.18)] text-sm font-bold text-[var(--accent)]">
                LP
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-[var(--text)] sm:text-2xl">{title}</h1>
            {subtitle ? <p className="truncate text-sm text-[var(--subtext)]">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className={`pill ${openNow ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
            {openNow ? 'Abierto' : 'Cerrado'}
          </span>
          <button onClick={handleInstallClick} className="primary-btn px-3 py-1.5 text-xs sm:text-sm">
            Descargar App
          </button>
          {eventHref ? (
            <Link href={eventHref} className="secondary-btn px-3 py-1.5 text-xs sm:text-sm">
              Reservar evento
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
