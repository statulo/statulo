export function minDate(...dates: (Date)[]): Date;
export function minDate(...dates: (Date | null)[]): Date | null;
export function minDate(...dates: (Date | null)[]): Date | null {
  const nonNullDates = dates.filter(date => date !== null);
  if (nonNullDates.length === 0) {
    return null;
  }
  return new Date(Math.min(...nonNullDates.map(date => date.getTime())));
}

export function maxDate(...dates: (Date)[]): Date;
export function maxDate(...dates: (Date | null)[]): Date | null;
export function maxDate(...dates: (Date | null)[]): Date | null {
  const nonNullDates = dates.filter(date => date !== null);
  if (nonNullDates.length === 0) {
    return null;
  }
  return new Date(Math.max(...nonNullDates.map(date => date.getTime())));
}
