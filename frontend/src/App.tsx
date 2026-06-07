import { motion, type Variants } from 'framer-motion';
import { BookOpen, Clock3, MapPin, Menu, Phone, Sparkles, X } from 'lucide-react';
import MenuModal from './components/MenuModal';
import ReservationDatePicker from './components/ReservationDatePicker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { submitReservation } from './services/reservations';
import heroLaMaestra from './assets/hero-la-maestra.png';
import heroLaMaestraMovil from './assets/hero-la-maestra-movil.png';
import logoElGarcero from './assets/logo-el-garcero.png';
import selloAriariBurgerFestival from './assets/sello-ariari-burger-festival.png';
import menuBatidoGuamaluno from './assets/menu-batido-guamaluno.png';
import menuMalteadaBaileys from './assets/menu-malteada-baileys.png';
import menuPerroMexicano from './assets/menu-perro-mexicano.png';
import galeriaComidaBebidasFlatlay from './assets/galeria-comida-bebidas-flatlay.png';
import galeriaBananaSplit from './assets/galeria-banana-split.png';
import galeriaGranizadoAguardiente from './assets/galeria-granizado-aguardiente-llanero.png';
import galeriaBebidasApiladas from './assets/galeria-bebidas-apiladas.png';
import galeriaBebidaTerraza from './assets/galeria-bebida-terraza.png';
import galeriaPataconCarneMechada from './assets/galeria-patacon-carne-mechada.png';
import bannerPostres from './assets/banner-postres.png';

interface ReservationForm {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  reason: string;
  decoration?: boolean;
}

const RESERVATION_HOURS = Array.from({ length: 12 }, (_, index) => index + 11);

const formatReservationHour = (hour: number): string => {
  const period = hour >= 12 ? 'p.m.' : 'a.m.';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${period}`;
};

const todayDateValue = (): string => new Date().toISOString().split('T')[0];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
} satisfies Variants;

const featuredMenu = [
  {
    title: 'Batido Guamaluno',
    description:
      'Tradición servida en un vaso. Una refrescante combinación de leche congelada, esencias, azúcar y aguardiente llanero que captura la esencia y el sabor de Guamal en cada sorbo.',
    image: menuBatidoGuamaluno,
  },
  {
    title: 'Perro Mexicano',
    description:
      'Prueba nuestro delicioso Perro Mexicano o descubre cualquiera de nuestras especialidades: Garcero, Hawaiano, Colombiano, Ranchero, BBQ y Quesudo. ¡Un sabor para cada antojo!',
    image: menuPerroMexicano,
  },
  {
    title: 'Malteada de Baileys',
    description:
      'La combinación ideal de cremosidad y sabor. Una experiencia dulce y sofisticada con el toque único de Baileys en cada sorbo.',
    image: menuMalteadaBaileys,
  },
];

const galleryImages = [
  galeriaComidaBebidasFlatlay,
  galeriaBananaSplit,
  galeriaGranizadoAguardiente,
  galeriaBebidasApiladas,
  galeriaBebidaTerraza,
  galeriaPataconCarneMechada,
];

const galleryLayout = [
  'lg:col-start-1 lg:row-start-1 lg:col-span-4 lg:row-span-3',
  'lg:col-start-5 lg:row-start-1 lg:col-span-2 lg:row-span-2',
  'lg:col-start-5 lg:row-start-3 lg:col-span-2 lg:row-span-4',
  'lg:col-start-1 lg:row-start-4 lg:col-span-2 lg:row-span-3',
  'lg:col-start-3 lg:row-start-4 lg:col-span-2 lg:row-span-2',
  'lg:col-start-3 lg:row-start-6 lg:col-span-2 lg:row-span-1',
];

const galleryImageFit = [
  'object-cover',
  'object-cover',
  'object-cover',
  'object-cover',
  'object-cover',
  'object-cover object-[50%_78%] scale-[0.94] origin-[50%_78%]',
];

const navLinks = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#menu', label: 'Menu' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#reservas', label: 'Reservas' },
];

const whatsappClientMessage =
  '¡Hola! Vengo desde la web de El Garcero. Me gustaría recibir más información.';

const socialIconClass =
  'mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary/15 bg-primary/5 text-primary transition duration-300 group-hover:border-secondary/25 group-hover:bg-primary/10';

const socialLinks = [
  {
    name: 'Facebook',
    handle: 'Heladeria El Garcero',
    href: 'https://www.facebook.com/heladeriaelgarcero',
    message: 'Promos, eventos y novedades de la casa.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@elgarcero',
    href: 'https://www.instagram.com/elgarcero/',
    message: 'Historias, fotos y lo mejor del menu.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    handle: '+57 320 226 7116',
    href: `https://wa.me/573202267116?text=${encodeURIComponent(whatsappClientMessage)}`,
    message: 'Escríbenos directo y reserva al instante.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-7 w-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartaOpen, setCartaOpen] = useState(false);
  const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ReservationForm>({
    defaultValues: {
      decoration: false,
    },
  });

  const onSubmit = async (data: ReservationForm): Promise<void> => {
    setIsSubmittingReservation(true);
    const hour = formatReservationHour(Number(data.time.split(':')[0]));

    try {
      await submitReservation({
        name: data.name,
        email: data.email,
        date: data.date,
        time: data.time,
        timeLabel: hour,
        guests: data.guests,
        reason: data.reason,
        decoration: data.decoration ?? false,
      });

      const decorationNote = data.decoration ? ' Incluye decoracion especial (+$25.000).' : '';
      toast.success(
        `Reserva enviada para ${data.name} el ${data.date} a las ${hour}.${decorationNote} Te contactaremos pronto.`,
      );
      reset();
    } catch {
      toast.error('No pudimos enviar tu reserva. Intenta de nuevo en unos minutos.');
    } finally {
      setIsSubmittingReservation(false);
    }
  };

  const closeMenu = (): void => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background text-primary">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-secondary/15 bg-white/90 backdrop-blur-xl">
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-5 md:py-4">
          <a href="#" className="inline-flex shrink-0 items-center" aria-label="El Garcero - Inicio">
            <img
              src={logoElGarcero}
              alt="El Garcero"
              className="h-11 w-auto sm:h-14"
            />
          </a>

          <div className="hidden items-center gap-6 text-sm font-medium text-primary/80 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} className="transition hover:text-secondary" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-primary transition hover:bg-secondary/10 md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-secondary/10 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-base font-medium text-primary/80 transition hover:bg-secondary/10 hover:text-secondary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      <section className="relative h-[100svh] overflow-hidden md:h-auto md:pt-20">
        <div className="relative h-full w-full overflow-hidden md:aspect-[2/1] md:h-auto">
          <img
            src={heroLaMaestraMovil}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center blur-2xl md:hidden"
          />
          <img
            src={heroLaMaestra}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 right-0 hidden h-full w-full max-w-none object-cover object-[95%_68%] blur-2xl origin-[68%_100%] scale-[1.52] md:block"
          />

          <img
            src={heroLaMaestraMovil}
            alt="El Garcero - La Maestra, hamburguesa del Ariari Burger Festival"
            className="absolute inset-0 z-[1] h-full w-full object-cover object-center md:hidden"
          />
          <img
            src={heroLaMaestra}
            alt="El Garcero - La Maestra, hamburguesa del Ariari Burger Festival"
            className="absolute inset-0 right-0 z-[1] hidden h-full w-full max-w-none object-cover object-[95%_68%] origin-[68%_100%] scale-[1.52] md:block md:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_92%,transparent_100%)] md:[mask-image:linear-gradient(to_bottom,black_0%,black_92%,transparent_100%)]"
          />

          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/55 via-black/10 to-transparent md:bg-gradient-to-r md:from-black/45 md:via-black/5 md:to-transparent"
            aria-hidden
          />

          <motion.img
            src={selloAriariBurgerFestival}
            alt="Participante oficial - Ariari Burger Festival 2026"
            initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
            animate={{
              opacity: 1,
              scale: [1, 1.07, 1],
              rotate: 12,
            }}
            transition={{
              opacity: { duration: 0.6 },
              rotate: { duration: 0.6 },
              scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const, repeatType: 'loop' as const },
            }}
            style={{ transformOrigin: 'center center' }}
            className="absolute bottom-[8%] right-[6%] z-20 h-[6.8rem] w-auto drop-shadow-[0_14px_36px_rgba(0,0,0,0.55)] sm:bottom-[9%] sm:right-[7%] sm:h-32 md:bottom-[13%] md:left-[56%] md:right-auto md:h-[168px] lg:bottom-[14%] lg:left-[57%] lg:h-[180px]"
          />

          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            className="absolute inset-x-0 top-0 z-10 px-4 pt-[5rem] sm:px-5 sm:pt-[5.25rem] md:inset-0 md:flex md:items-end md:justify-start md:pb-[8.5rem] md:pl-5 md:pr-8 md:pt-0 lg:pb-[10.5rem] lg:pl-6"
          >
            <div className="mx-auto w-full max-w-xl text-white md:mx-0 md:max-w-2xl md:text-left lg:max-w-3xl">
              <div className="rounded-2xl border border-white/15 bg-black/45 px-3.5 py-2.5 shadow-[0_8px_32px_rgba(8,72,56,0.2)] backdrop-blur-md sm:px-4 sm:py-3 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none md:backdrop-blur-none">
                <p className="mb-1.5 flex items-center justify-center gap-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-secondary md:mb-4 md:gap-2 md:justify-start md:text-sm md:tracking-[0.18em]">
                  <Sparkles size={11} className="shrink-0 text-secondary opacity-90 md:h-4 md:w-4" />
                  Homenaje a las raices y la tradicion
                </p>

                <h1 className="text-center font-heading text-[1.85rem] leading-[0.95] tracking-wide drop-shadow-lg sm:text-[2.25rem] md:text-left md:text-8xl md:leading-[0.9] lg:text-[5.5rem]">
                  LA MAESTRA
                </h1>

                <p className="mt-2 text-pretty text-center text-[0.75rem] leading-[1.55] text-white/92 md:hidden md:mt-3 md:text-sm">
                  Inspirada en <span className="font-bold text-white">Lilia Caicedo de Lozano</span>, homenaje llanero
                  con <span className="font-bold text-white">carne jugosa</span>,{' '}
                  <span className="font-bold text-white">queso campesino</span>, hogao, alioli, chicharron y cebollas
                  encurtidas.
                </p>

                <p className="mt-3 hidden max-w-prose text-pretty text-[0.8125rem] leading-[1.7] text-white/92 sm:mt-4 sm:text-sm md:mt-5 md:block md:text-left md:text-base md:leading-relaxed lg:text-lg">
                  Inspirada en{' '}
                  <span className="font-bold text-white">Lilia Caicedo de Lozano</span>,{' '}
                  <span className="font-bold text-white">La Maestra</span> busca traducir a sabor la elegancia,
                  serenidad y calidez de una mujer que ha dejado huella en su comunidad. Como homenaje a sus raíces y
                  a los sabores del campo, esta hamburguesa reúne una{' '}
                  <span className="font-bold text-white">carne jugosa</span> y de preparación sencilla,{' '}
                  <span className="font-bold text-white">queso campesino fresco</span>, una{' '}
                  <span className="font-bold text-white">mermelada de hogao</span> que representa su dulzura, un{' '}
                  <span className="font-bold text-white">alioli de ajo</span> con crocante de{' '}
                  <span className="font-bold text-white">chicharrón</span> que conecta con la tradición, y{' '}
                  <span className="font-bold text-white">cebollas encurtidas</span> que evocan esa finura impecable que
                  siempre la ha caracterizado.
                </p>

                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3 md:mt-7 md:flex md:w-auto md:justify-start md:gap-2.5">
                  <a
                    href="https://ariariburger.co/restaurants/6a00b2f463a81b4b1176adba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-2.5 py-2 text-[0.6875rem] font-semibold text-white shadow-[0_20px_40px_-16px_rgba(220,38,38,0.55)] transition hover:-translate-y-0.5 hover:bg-white hover:text-red-600 sm:px-3 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm"
                  >
                    Vota aqui
                  </a>
                  <a
                    href="#reservas"
                    className="inline-flex items-center justify-center rounded-full bg-[#FFD028] px-2.5 py-2 text-[0.6875rem] font-semibold text-black shadow-[0_20px_40px_-16px_rgba(255,208,40,0.45)] transition hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-premium sm:px-3 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm"
                  >
                    Reservar
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-16 px-5 py-14 sm:space-y-20 sm:py-16 md:space-y-32 md:py-20">
        <motion.section id="nosotros" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Sobre nosotros</p>
          <h2 className="mt-3 font-heading text-3xl text-secondary sm:text-4xl md:text-6xl md:leading-[1.05]">
            DESDE GUAMAL, 22 AÑOS DE SABOR
          </h2>
          <div className="mt-6 w-full space-y-4 text-base leading-relaxed text-black sm:text-lg">
            <p>
              En El Garcero llevamos más de 22 años ofreciendo sabor, calidad y tradición en Guamal, Meta. Somos un
              negocio familiar que ha crecido junto a nuestra comunidad, convirtiéndonos en un lugar de encuentro para
              compartir buenos momentos alrededor de la comida.
            </p>
            <p>
              Nuestro compromiso sigue siendo el mismo desde el primer día: brindar productos de calidad, excelente
              atención y experiencias que hagan que nuestros clientes siempre quieran regresar.
            </p>
          </div>
        </motion.section>

        <motion.section id="menu" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Menu destacado</p>
              <h2 className="mt-3 font-heading text-3xl text-primary sm:text-4xl md:text-5xl">
                Lo mejor de la casa
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCartaOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-secondary sm:w-auto sm:px-7 sm:py-3.5 sm:text-base"
            >
              <BookOpen size={18} />
              Ver carta completa
            </button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredMenu.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="texture-surface group overflow-hidden rounded-premium border border-secondary/10 shadow-premium"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-2 p-6">
                  <h3 className="font-heading text-2xl text-secondary sm:text-3xl">{item.title}</h3>
                  <p className="text-black">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section id="galeria" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Galeria</p>
          <div className="mt-8 overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:aspect-square lg:grid-cols-6 lg:grid-rows-6">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={`overflow-hidden rounded-2xl shadow-premium ${galleryLayout[index]}`}
                >
                <img
                  src={image}
                  alt="Galeria El Garcero"
                  className={`h-full w-full transition duration-500 hover:scale-105 ${galleryImageFit[index]}`}
                />
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 rounded-premium bg-black p-6 text-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)] sm:p-10 md:grid-cols-[auto_1fr] md:items-center md:gap-10 lg:gap-14"
        >
          <div className="flex shrink-0 justify-center md:justify-start">
            <motion.img
              src={selloAriariBurgerFestival}
              alt="Participante oficial - Ariari Burger Festival 2026"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{
                opacity: 1,
                scale: [1, 1.07, 1],
              }}
              viewport={{ once: true }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const, repeatType: 'loop' as const },
              }}
              style={{ transformOrigin: 'center center' }}
              className="h-[220px] w-auto drop-shadow-[0_12px_32px_rgba(255,255,255,0.12)] sm:h-[236px] md:h-[252px] lg:h-[268px]"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Ariari Burger Festival 2026</p>
            <h2 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl md:text-5xl">
              Tu voto lleva a Guamal al mapa del sabor
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              <span className="font-semibold text-white">La Maestra</span> existe para honrar a{' '}
              <span className="font-semibold text-white">Lilia Caicedo de Lozano</span> y a todo lo que Guamal nos ha
              dado: tradición, familia y sabor de verdad. No compite solo una hamburguesa, compite la historia de un
              negocio que lleva más de 22 años sirviendo con cariño a su gente. Tu voto es la forma más directa de
              apoyar esa raíz llanera y ayudarnos a llevar el nombre de El Garcero más lejos en el Ariari Burger
              Festival.
            </p>
            <a
              href="https://ariariburger.co/restaurants/6a00b2f463a81b4b1176adba"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-16px_rgba(220,38,38,0.55)] transition hover:-translate-y-0.5 hover:bg-white hover:text-red-600 sm:px-7 sm:text-base"
            >
              Vota aqui
            </a>
          </div>
        </motion.section>

        <motion.section variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Redes sociales</p>
          <h2 className="mt-3 font-heading text-3xl text-primary sm:text-4xl">Conecta con nosotros</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name}: ${social.message}`}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                className="texture-surface group flex min-h-[210px] flex-col rounded-premium border border-secondary/10 p-6 shadow-premium transition duration-300 hover:border-secondary/30 hover:shadow-orange"
              >
                <div className={socialIconClass}>{social.icon}</div>

                <h3 className="font-heading text-2xl tracking-wide text-primary">{social.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-secondary/80">
                  {social.handle}
                </p>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-primary/70">{social.message}</p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition group-hover:text-primary">
                  Visitar
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="reservas"
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="rounded-premium border border-secondary/20 bg-gradient-to-br from-white via-cream to-background p-8 shadow-orange md:p-10"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Reservas</p>
          <h2 className="mt-3 font-heading text-3xl text-primary sm:text-4xl md:text-5xl">
            Ocasiones especiales
          </h2>
          <p className="mt-4 w-full text-base leading-relaxed text-black sm:text-lg">
            En El Garcero creemos que los momentos que importan merecen un espacio especial. Reserva con nosotros para
            cumpleaños, celebraciones familiares, reuniones o cualquier ocasión que quieras hacer inolvidable.
          </p>
          <p className="mt-2 w-full text-sm text-primary/70">
            Horario disponible para reservas: <span className="font-medium text-primary">11:00 a.m. – 10:30 p.m.</span>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="reservation-name" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Nombre
              </label>
              <input
                id="reservation-name"
                {...register('name', { required: 'Tu nombre es obligatorio' })}
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-secondary/25 bg-white px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-secondary/40"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="reservation-email" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Correo electronico
              </label>
              <input
                id="reservation-email"
                type="email"
                {...register('email', {
                  required: 'Tu correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un correo valido',
                  },
                })}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-secondary/25 bg-white px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-secondary/40"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="reservation-date" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Fecha
              </label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'Selecciona una fecha' }}
                render={({ field }) => (
                  <ReservationDatePicker
                    id="reservation-date"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    minDate={todayDateValue()}
                  />
                )}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            <div>
              <label htmlFor="reservation-time" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Hora
              </label>
              <select
                id="reservation-time"
                defaultValue=""
                {...register('time', { required: 'Selecciona una hora' })}
                className="w-full rounded-xl border border-secondary/25 bg-white px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <option value="" disabled>
                  Selecciona una hora
                </option>
                {RESERVATION_HOURS.map((hour) => (
                  <option key={hour} value={`${String(hour).padStart(2, '0')}:00`}>
                    {formatReservationHour(hour)}
                  </option>
                ))}
              </select>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
            </div>

            <div>
              <label htmlFor="reservation-guests" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Numero de personas
              </label>
              <input
                id="reservation-guests"
                type="number"
                min={1}
                max={30}
                {...register('guests', {
                  required: 'Indica cuantas personas asistiran',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimo 1 persona' },
                })}
                placeholder="Ej. 6"
                className="w-full rounded-xl border border-secondary/25 bg-white px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-secondary/40"
              />
              {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="reservation-reason" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Motivo
              </label>
              <textarea
                id="reservation-reason"
                rows={3}
                {...register('reason', { required: 'Cuéntanos el motivo de tu reserva' })}
                placeholder="Ej. Cumpleaños, reunion familiar, celebracion especial..."
                className="w-full resize-none rounded-xl border border-secondary/25 bg-white px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-secondary/40"
              />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
            </div>

            <div className="md:col-span-2">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-primary/70">
                Decoracion <span className="normal-case tracking-normal text-primary/50">(opcional)</span>
              </p>
              <label
                htmlFor="reservation-decoration"
                className="flex cursor-pointer gap-3 rounded-xl border border-secondary/25 bg-white p-4 transition hover:border-secondary/40"
              >
                <input
                  id="reservation-decoration"
                  type="checkbox"
                  {...register('decoration')}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-secondary/40 text-secondary accent-secondary focus:ring-2 focus:ring-secondary/40"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-primary">Agregar paquete de decoracion</span>
                  <span className="mt-2 block text-sm leading-relaxed text-black">
                    Incluye mantel, bombas, letrero de feliz cumpleaños y brownie con helado.
                  </span>
                  <span className="mt-2 block text-sm font-medium text-secondary">
                    Costo adicional de $25.000, sujeto como incremento en la factura final.
                  </span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmittingReservation}
              className="md:col-span-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
            >
              {isSubmittingReservation ? 'Enviando...' : 'Reservar'}
            </button>
          </form>
        </motion.section>

        <section className="overflow-hidden rounded-premium md:relative">
          <div className="aspect-[1402/980] overflow-hidden md:aspect-[1402/835]">
            <img
              src={bannerPostres}
              alt="Postres del Garcero"
              className="h-full w-full object-cover object-top md:h-[calc(100%+50px)] md:-translate-y-[50px]"
            />
          </div>
          <div className="border-t border-secondary/10 bg-cream/95 px-5 py-5 md:absolute md:inset-x-0 md:top-[50px] md:border-0 md:bg-transparent md:p-8 lg:p-10">
            <div className="w-full md:rounded-2xl md:border md:border-white/20 md:bg-white/10 md:px-8 md:py-6 md:backdrop-blur-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary sm:text-sm">
                Postres del Garcero
              </p>
              <h2 className="mt-2 font-heading text-3xl leading-tight text-secondary sm:text-4xl md:text-5xl">
                Pruébalos. Te van a encantar.
              </h2>
              <p className="mt-3 w-full text-base text-primary sm:text-lg">
                Helados cremosos, brownie con helado y malteadas caseras. El dulce final perfecto para tu tarde.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="brand-orange-surface px-5 py-10 text-white sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
          <div>
            <img
              src={logoElGarcero}
              alt="El Garcero"
              className="h-11 w-auto brightness-0 invert sm:h-14"
            />
          </div>
          <div className="text-sm text-white/95">
            <p className="mb-2 font-semibold">Ubicacion</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              Carrera 7 #11-66, Los Fundadores, Guamal, Meta, Colombia
            </p>
          </div>
          <div className="text-sm text-white/95">
            <p className="mb-2 font-semibold">Contacto</p>
            <p className="flex items-center gap-2">
              <Phone size={14} /> +57 320 226 7116
            </p>
          </div>
          <div className="text-sm text-white/95">
            <p className="mb-2 font-semibold">Horarios</p>
            <p className="flex items-center gap-2">
              <Clock3 size={14} /> Todos los dias, 11:00 AM – 10:30 PM
            </p>
          </div>
        </div>
      </footer>
      <MenuModal open={cartaOpen} onClose={() => setCartaOpen(false)} />
      <Toaster position="top-right" />
    </div>
  );
}
