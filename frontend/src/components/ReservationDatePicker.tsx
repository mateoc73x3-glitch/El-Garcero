import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface ReservationDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  minDate: string;
  id?: string;
}

const parseDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (value: string): string => {
  const date = parseDate(value);
  if (!date) return 'Selecciona una fecha';
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function ReservationDatePicker({
  value,
  onChange,
  minDate,
  id = 'reservation-date',
}: ReservationDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const min = parseDate(minDate) ?? startOfDay(new Date());
  const selected = parseDate(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected ?? min);

  useEffect(() => {
    if (selected) setViewDate(selected);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (days.length % 7 !== 0) days.push(null);

  const handleSelect = (day: number): void => {
    const next = new Date(year, month, day);
    if (startOfDay(next) < startOfDay(min)) return;
    onChange(toDateValue(next));
    setOpen(false);
  };

  const goMonth = (offset: number): void => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const isSelected = (day: number): boolean => {
    if (!selected) return false;
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isDisabled = (day: number): boolean => startOfDay(new Date(year, month, day)) < startOfDay(min);

  const isToday = (day: number): boolean => {
    const today = startOfDay(new Date());
    const current = startOfDay(new Date(year, month, day));
    return current.getTime() === today.getTime();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-secondary/25 bg-white px-4 py-3 text-left text-primary outline-none transition focus:ring-2 focus:ring-secondary/40"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'font-medium' : 'text-primary/50'}>{formatDisplayDate(value)}</span>
        <CalendarDays size={18} className="shrink-0 text-secondary" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Seleccionar fecha"
          className="absolute inset-x-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-secondary/25 bg-background shadow-premium"
        >
          <div className="bg-primary px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="rounded-lg p-1.5 transition hover:bg-white/15"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <p className="font-heading text-lg tracking-wide">
                {MONTHS[month]} {year}
              </p>
              <button
                type="button"
                onClick={() => goMonth(1)}
                className="rounded-lg p-1.5 transition hover:bg-white/15"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-cream/60 p-3">
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((weekday) => (
                <span
                  key={weekday}
                  className="py-1 text-center text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-primary/60"
                >
                  {weekday}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) =>
                day === null ? (
                  <span key={`empty-${index}`} />
                ) : (
                  <button
                    key={`${year}-${month}-${day}`}
                    type="button"
                    disabled={isDisabled(day)}
                    onClick={() => handleSelect(day)}
                    className={[
                      'flex h-9 items-center justify-center rounded-lg text-sm font-medium transition',
                      isSelected(day)
                        ? 'bg-secondary text-white shadow-orange'
                        : isToday(day)
                          ? 'border border-secondary/40 bg-white text-primary'
                          : 'text-primary hover:bg-white hover:text-secondary',
                      isDisabled(day) ? 'cursor-not-allowed opacity-30 hover:bg-transparent hover:text-primary' : '',
                    ].join(' ')}
                  >
                    {day}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
