export function getDayString(date = new Date()): string {
  return `${date.toISOString().split('T')[0]}-${date.getDay()}`;
}