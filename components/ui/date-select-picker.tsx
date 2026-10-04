"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Calendar helpers (Jalali <-> Gregorian, بدون وابستگی خارجی)                */
/* -------------------------------------------------------------------------- */

type CalendarType = "shamsi" | "miladi";
type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const s = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm: number;
  for (gm = 0; gm < 13 && gd > s[gm]; gm++) gd -= s[gm];
  return [gy, gm, gd];
}

function isLeapJalali(y: number) {
  const [gy, gm, gd] = jalaliToGregorian(y, 12, 30);
  const [jy, jm, jd] = gregorianToJalali(gy, gm, gd);
  return jy === y && jm === 12 && jd === 30;
}

const isLeapGregorian = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

function daysInMonth(type: CalendarType, y: number | null, m: number | null) {
  if (type === "shamsi") {
    if (!m || m <= 6) return 31;
    if (m <= 11) return 30;
    return y && !isLeapJalali(y) ? 29 : 30;
  }
  if (!m) return 31;
  if (m === 2) return y && !isLeapGregorian(y) ? 28 : 29;
  return [4, 6, 9, 11].includes(m) ? 30 : 31;
}

/* ------------------------------ digits / names ----------------------------- */

const FA = "۰۱۲۳۴۵۶۷۸۹";
const toLatin = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
const toFa = (s: string) => s.replace(/\d/g, (d) => FA[Number(d)]);

const SHAMSI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const MILADI_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ------------------------------ parts <-> Date ----------------------------- */

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function dateToParts(date: Date | null, type: CalendarType): Parts {
  if (!date || Number.isNaN(date.getTime())) return { day: "", month: "", year: "" };
  const y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate();
  const [py, pm, pd] = type === "shamsi" ? gregorianToJalali(y, m, d) : [y, m, d];
  return { day: String(pd), month: String(pm), year: String(py) };
}

function partsToDate(p: Parts, type: CalendarType, minYear: number, maxYear: number): Date | null {
  if (!p.day || !p.month || !p.year) return null;
  const d = Number(p.day),
    m = Number(p.month),
    y = Number(p.year);
  if (y < minYear || y > maxYear || m < 1 || m > 12 || d < 1 || d > daysInMonth(type, y, m))
    return null;
  const [gy, gm, gd] = type === "shamsi" ? jalaliToGregorian(y, m, d) : [y, m, d];
  return new Date(gy, gm - 1, gd);
}

/** yyyy-MM-dd میلادی (بر اساس تاریخ محلی، بدون مشکل timezone) – مناسب name/hidden input */
function toISODate(date: Date | null) {
  if (!date) return "";
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(date.getFullYear(), 4)}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const MAX_LEN: Record<Part, number> = { day: 2, month: 2, year: 4 };
const PARTS: Part[] = ["day", "month", "year"];

export interface DateSelectPickerProps {
  /** React 19: ref یک prop معمولی است */
  ref?: React.Ref<HTMLDivElement>;
  /** مقدار کنترل‌شده. `null` یعنی خالی */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  calendarType?: CalendarType;
  /** حداقل/حداکثر سال (در تقویم انتخاب‌شده). پیش‌فرض: ۱۳۰۰ تا سال جاری / ۱۹۰۰ تا سال جاری */
  minYear?: number;
  maxYear?: number;
  /** نمایش ارقام. پیش‌فرض: شمسی ← fa ، میلادی ← en */
  digits?: "fa" | "en";
  placeholders?: Partial<Record<Part, string>>;
  /** جای آیکون تقویم نسبت به ورودی‌ها (logical). پیش‌فرض: start */
  iconPosition?: "start" | "end";
  /** اگر بدهی، یک hidden input با مقدار yyyy-MM-dd میلادی برای فرم‌های native ساخته می‌شود */
  name?: string;
  id?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  dir?: "rtl" | "ltr";
  className?: string;
  onBlur?: () => void;
}

export function DateSelectPicker(props: DateSelectPickerProps) {
  const {
    ref,
    value,
    defaultValue = null,
    onValueChange,
    calendarType = "shamsi",
    minYear: minYearProp,
    maxYear: maxYearProp,
    digits,
    placeholders,
    iconPosition = "start",
    name,
    id,
    disabled,
    dir,
    className,
    onBlur,
  } = props;

  const isShamsi = calendarType === "shamsi";
  const digitStyle = digits ?? (isShamsi ? "fa" : "en");
  const fmt = (s: string) => (digitStyle === "fa" ? toFa(s) : s);
  const ph = {
    day: placeholders?.day ?? (isShamsi ? "روز" : "Day"),
    month: placeholders?.month ?? (isShamsi ? "ماه" : "Month"),
    year: placeholders?.year ?? (isShamsi ? "سال" : "Year"),
  };
  const monthNames = isShamsi ? SHAMSI_MONTHS : MILADI_MONTHS;

  const currentYear = React.useMemo(() => {
    const now = new Date();
    return isShamsi
      ? gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate())[0]
      : now.getFullYear();
  }, [isShamsi]);
  const minYear = minYearProp ?? (isShamsi ? 1300 : 1900);
  const maxYear = maxYearProp ?? currentYear;

  /* ------------------------------- state ------------------------------- */

  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<Date | null>(defaultValue);
  const current = isControlled ? value : inner;
  const currentTime = current?.getTime() ?? null;

  const [parts, setParts] = React.useState<Parts>(() => dateToParts(current, calendarType));

  // همگام‌سازی وقتی مقدار از بیرون (reset فرم، تغییر calendarType، ...) عوض شد
  React.useEffect(() => {
    const derived = partsToDate(parts, calendarType, minYear, maxYear)?.getTime() ?? null;
    if (derived !== currentTime) setParts(dateToParts(current, calendarType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, calendarType]);

  const [active, setActive] = React.useState<Part | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState(-1);

  const rootRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);
  const inputRefs = React.useRef<Record<Part, HTMLInputElement | null>>({
    day: null,
    month: null,
    year: null,
  });
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const listId = React.useId();

  /* ------------------------------- items ------------------------------- */

  const numYear = parts.year ? Number(parts.year) : null;
  const numMonth = parts.month ? Number(parts.month) : null;

  const itemsFor = React.useCallback(
    (part: Part): number[] => {
      if (part === "month") return Array.from({ length: 12 }, (_, i) => i + 1);
      if (part === "day")
        return Array.from(
          { length: daysInMonth(calendarType, numYear, numMonth) },
          (_, i) => i + 1,
        );
      const years: number[] = [];
      for (let y = maxYear; y >= minYear; y--) years.push(y);
      return years;
    },
    [calendarType, numYear, numMonth, minYear, maxYear],
  );

  const visibleItems = React.useMemo(() => {
    if (!active) return [];
    const all = itemsFor(active);
    const q = query.replace(/^0+/, "");
    return q ? all.filter((n) => String(n).startsWith(q)) : all;
  }, [active, itemsFor, query]);

  /* ------------------------------ mutations ---------------------------- */

  const emit = (next: Parts) => {
    const date = partsToDate(next, calendarType, minYear, maxYear);
    if ((date?.getTime() ?? null) === currentTime) return;
    if (!isControlled) setInner(date);
    onValueChange?.(date);
  };

  const setPartText = (part: Part, text: string) => {
    const next: Parts = { ...parts, [part]: text };
    // اگر ماه/سال عوض شد و روز دیگر معتبر نیست، به آخرین روز ماه کلمپ می‌شود
    if (next.day) {
      const dim = daysInMonth(
        calendarType,
        next.year ? Number(next.year) : null,
        next.month ? Number(next.month) : null,
      );
      if (Number(next.day) > dim) next.day = String(dim);
    }
    setParts(next);
    emit(next);
  };

  const focusPart = (part: Part) => inputRefs.current[part]?.focus();

  const openFor = (part: Part) => {
    if (disabled) return;
    setActive(part);
    setOpen(true);
    const idx = itemsFor(part).indexOf(Number(parts[part]));
    setHighlight(idx);
  };

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const select = (part: Part, n: number) => {
    setPartText(part, String(n));
    close();
    inputRefs.current[part]?.focus();
  };

  const commitOnBlur = (part: Part) => {
    const text = parts[part];
    if (!text) return;
    let n = Number(text);
    if (part === "year") n = clamp(n, minYear, maxYear);
    else if (part === "month") n = clamp(n, 1, 12);
    else n = clamp(n, 1, daysInMonth(calendarType, numYear, numMonth));
    if (String(n) !== text) setPartText(part, String(n));
  };

  const handleChange = (part: Part, raw: string) => {
    const text = toLatin(raw).replace(/\D/g, "").slice(0, MAX_LEN[part]);
    const prev = parts[part];

    // اعتبارسنجی حین تایپ: ورودی نامعتبر اصلاً پذیرفته نمی‌شود
    if (text) {
      if (part === "year") {
        if (!itemsFor("year").some((y) => String(y).startsWith(text))) return;
      } else if (text !== "0" && !itemsFor(part).includes(Number(text))) return;
    }

    setQuery(text);
    setHighlight(text ? 0 : -1);
    setActive(part);
    setOpen(true);
    setPartText(part, text);

    // پرش خودکار به فیلد بعدی وقتی عدد کامل شد
    if (text.length > prev.length) {
      const n = Number(text);
      const done =
        (part === "day" &&
          (text.length === 2 || n * 10 > daysInMonth(calendarType, numYear, numMonth))) ||
        (part === "month" && (text.length === 2 || n > 1));
      if (done) {
        close();
        focusPart(part === "day" ? "month" : "year");
      }
    }
  };

  const handleKeyDown = (part: Part, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open || active !== part) return openFor(part);
        if (!visibleItems.length) return;
        const step = e.key === "ArrowDown" ? 1 : -1;
        setHighlight((h) => (h + step + visibleItems.length) % visibleItems.length);
        break;
      }
      case "Enter":
        if (open && active === part && highlight >= 0 && visibleItems[highlight] != null) {
          e.preventDefault();
          select(part, visibleItems[highlight]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close();
        }
        break;
      case "Backspace":
        if (!parts[part] && part !== "day") focusPart(PARTS[PARTS.indexOf(part) - 1]);
        break;
    }
  };

  // نگه‌داشتن آیتم هایلایت‌شده در دید (بدون اسکرول کل صفحه)
  React.useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${highlight}"]`);
    if (!list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight)
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
  }, [highlight, active]);

  // هنگام mount شدن لیست، آیتم انتخاب‌شده وسط لیست بیاید
  const attachList = React.useCallback((el: HTMLDivElement | null) => {
    listRef.current = el;
    if (!el) return;
    const sel = el.querySelector<HTMLElement>("[data-highlighted='true']");
    if (sel) el.scrollTop = sel.offsetTop - el.clientHeight / 2 + sel.offsetHeight / 2;
  }, []);

  /* -------------------------------- render ------------------------------ */

  const resolvedDir = dir ?? (isShamsi ? "rtl" : "ltr");
  const anchor = active ? inputRefs.current[active] : null;
  const invalid = props["aria-invalid"];

  const icon = (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      aria-label={isShamsi ? "باز کردن لیست تاریخ" : "Open date list"}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => (open ? close() : (focusPart(active ?? "day"), openFor(active ?? "day")))}
      className="flex size-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
    >
      <CalendarIcon className="size-4" />
    </button>
  );

  return (
    <PopoverPrimitive.Root
      open={open && !!active}
      onOpenChange={(next, details) => {
        if (next) return;
        const target = (details as { event?: Event } | undefined)?.event?.target as
          | Node
          | null
          | undefined;
        if (target && rootRef.current?.contains(target)) return; // کلیک روی خود فیلدها بستن حساب نمی‌شود
        close();
      }}
    >
      <div
        ref={rootRef}
        id={id}
        role="group"
        dir={resolvedDir}
        aria-invalid={invalid || undefined}
        aria-disabled={disabled || undefined}
        onBlur={(e) => {
          if (!rootRef.current?.contains(e.relatedTarget as Node | null)) {
            close();
            onBlur?.();
          }
        }}
        className={cn(
          "flex h-9 w-fit items-center divide-x divide-input overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className,
        )}
      >
        {iconPosition === "start" && icon}
        {PARTS.map((part) => (
          <input
            key={part}
            ref={(el) => {
              inputRefs.current[part] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            role="combobox"
            aria-label={ph[part]}
            aria-expanded={open && active === part}
            aria-controls={listId}
            aria-autocomplete="list"
            disabled={disabled}
            placeholder={ph[part]}
            value={fmt(parts[part])}
            onFocus={() => openFor(part)}
            onClick={() => !(open && active === part) && openFor(part)}
            onChange={(e) => handleChange(part, e.target.value)}
            onKeyDown={(e) => handleKeyDown(part, e)}
            onBlur={() => commitOnBlur(part)}
            className={cn(
              "h-full min-w-0 bg-transparent px-2 text-center text-sm tabular-nums outline-none placeholder:text-muted-foreground",
              part === "year" ? "w-20" : "w-14",
            )}
          />
        ))}
        {iconPosition === "end" && icon}
        {name && <input type="hidden" name={name} value={toISODate(current)} />}
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={anchor}
          side="bottom"
          align="start"
          sideOffset={6}
          className="z-50"
        >
          <PopoverPrimitive.Popup
            initialFocus={false}
            finalFocus={false}
            dir={resolvedDir}
            className="min-w-(--anchor-width) rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-opacity data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
          >
            <div
              key={active}
              ref={attachList}
              id={listId}
              role="listbox"
              className="relative max-h-60 min-w-28 overflow-y-auto"
            >
              {visibleItems.length === 0 && (
                <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                  {isShamsi ? "موردی یافت نشد" : "No results"}
                </div>
              )}
              {visibleItems.map((n, i) => {
                const selected = active != null && Number(parts[active]) === n;
                return (
                  <button
                    key={n}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    data-index={i}
                    data-highlighted={i === highlight}
                    aria-selected={selected}
                    onMouseDown={(e) => e.preventDefault()} // فوکوس از input نگیرد
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => active && select(active, n)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-1.5 text-sm tabular-nums outline-none",
                      "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
                      selected && "font-semibold",
                    )}
                  >
                    <span>{fmt(String(n))}</span>
                    {active === "month" && (
                      <span className="text-muted-foreground">{monthNames[n - 1]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
