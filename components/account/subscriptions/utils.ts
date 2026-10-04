export function formatPeriodText(periodMonths: number): string {
  if (periodMonths <= 0) return "همیشگی";
  return `${periodMonths.toLocaleString("fa-IR")} ماهه`;
}

export const NUMBER_INPUT_NO_SPIN_CLASS =
  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
