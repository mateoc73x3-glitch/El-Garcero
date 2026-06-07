import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import cartaDesktopPagina1 from '../assets/carta/carta-desktop-pagina-1.webp';
import cartaMobilePagina1 from '../assets/carta/carta-mobile-pagina-1.webp';
import cartaDesktopPagina2 from '../assets/carta/carta-desktop-pagina-2.webp';
import cartaMobilePagina2 from '../assets/carta/carta-mobile-pagina-2.webp';

const menuPages = [
  {
    id: 'carta-pagina-1',
    label: 'Página 1',
    src: cartaDesktopPagina1,
    srcMobile: cartaMobilePagina1,
  },
  {
    id: 'carta-pagina-2',
    label: 'Página 2',
    src: cartaDesktopPagina2,
    srcMobile: cartaMobilePagina2,
  },
];

interface MenuModalProps {
  open: boolean;
  onClose: () => void;
}

function preloadMenuPage(page: (typeof menuPages)[number], markLoaded: (pageId: string) => void) {
  const mobileImage = new Image();
  mobileImage.src = page.srcMobile;
  mobileImage.onload = () => markLoaded(`${page.id}-mobile`);

  const desktopImage = new Image();
  desktopImage.src = page.src;
  desktopImage.onload = () => markLoaded(`${page.id}-desktop`);
}

export default function MenuModal({ open, onClose }: MenuModalProps) {
  const [activePage, setActivePage] = useState(0);
  const [loadedPages, setLoadedPages] = useState<Record<string, boolean>>({});

  const goNext = useCallback(() => {
    setActivePage((page) => (page + 1) % menuPages.length);
  }, []);

  const goPrev = useCallback(() => {
    setActivePage((page) => (page - 1 + menuPages.length) % menuPages.length);
  }, []);

  const markLoaded = useCallback((pageId: string) => {
    setLoadedPages((current) => ({ ...current, [pageId]: true }));
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, goNext, goPrev]);

  useEffect(() => {
    if (!open) {
      setActivePage(0);
      setLoadedPages({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    preloadMenuPage(menuPages[activePage], markLoaded);
  }, [open, activePage, markLoaded]);

  const currentPage = menuPages[activePage];
  const isCurrentLoaded =
    loadedPages[`${currentPage.id}-mobile`] || loadedPages[`${currentPage.id}-desktop`];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Carta del restaurante"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
        >
          <motion.button
            type="button"
            aria-label="Cerrar carta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: 'easeOut' as const }}
            className="relative flex h-[min(92svh,920px)] w-full max-w-[min(100%,560px)] flex-col overflow-hidden rounded-premium border border-white/20 bg-background shadow-premium md:max-w-[560px]"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-secondary/15 bg-white px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-secondary sm:text-xs">
                  Nuestra carta
                </p>
                <h2 className="font-heading text-xl tracking-wide text-primary sm:text-2xl">
                  EL GARCERO
                </h2>
              </div>

              <button
                type="button"
                aria-label="Cerrar carta"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-cream text-primary transition hover:border-secondary/40 hover:bg-secondary/10"
              >
                <X size={20} />
              </button>
            </header>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-cream px-3 py-4 md:px-5 md:py-5">
              {!isCurrentLoaded && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-cream/90">
                  <Loader2 size={32} className="animate-spin text-secondary" />
                  <p className="text-sm font-medium text-primary/70">Cargando carta...</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: 'easeOut' as const }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <div className="aspect-[2/3] h-full max-h-full w-auto max-w-full overflow-hidden rounded-2xl border border-secondary/15 bg-white shadow-premium">
                    <picture className="block size-full">
                      <source media="(min-width: 768px)" srcSet={currentPage.src} />
                      <img
                        src={currentPage.srcMobile}
                        alt={`Carta El Garcero - ${currentPage.label}`}
                        className={`size-full object-contain object-center transition-opacity duration-300 ${
                          isCurrentLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        decoding="async"
                        fetchPriority="high"
                        onLoad={() => markLoaded(`${currentPage.id}-mobile`)}
                      />
                    </picture>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                aria-label="Página anterior"
                onClick={goPrev}
                className="absolute left-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/20 bg-white/95 text-primary shadow-premium transition hover:border-secondary/40 hover:bg-secondary hover:text-white md:left-3 md:h-11 md:w-11"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                aria-label="Página siguiente"
                onClick={goNext}
                className="absolute right-1 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/20 bg-white/95 text-primary shadow-premium transition hover:border-secondary/40 hover:bg-secondary hover:text-white md:right-3 md:h-11 md:w-11"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <footer className="flex shrink-0 flex-col items-center gap-3 border-t border-secondary/15 bg-white px-4 py-3 sm:flex-row sm:justify-between sm:px-6 sm:py-4">
              <div className="flex items-center gap-2">
                {menuPages.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    aria-label={`Ir a ${page.label}`}
                    aria-current={activePage === index ? 'true' : undefined}
                    onClick={() => setActivePage(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activePage === index
                        ? 'w-8 bg-secondary'
                        : 'w-2.5 bg-primary/20 hover:bg-primary/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {menuPages.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setActivePage(index)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition sm:text-sm ${
                      activePage === index
                        ? 'bg-primary text-white shadow-premium'
                        : 'border border-primary/15 text-primary/70 hover:border-secondary/30 hover:text-secondary'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
