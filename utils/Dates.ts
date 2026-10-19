const pad = (n: number) => String(n).padStart(2, '0');
 
/** Local date formatted as YYYY-MM-DD */
export const iso = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
 
export const addDays = (d: Date, days: number): Date => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};
 
/** Converts YYYY-MM-DD to DD/MM/YYYY, the format typed into the date inputs. */
export const isoToDmy = (isoDate: string): string => isoDate.split('-').reverse().join('/');
 