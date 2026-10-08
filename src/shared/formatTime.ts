/**
 * Formats a timestamp into a localized relative time string (e.g. "5 minutes ago" / "5 минут назад").
 * @param timestamp Timestamp in milliseconds.
 * @param lang Language code ('en' or 'ru').
 * @returns Localized relative time string.
 */
export function formatRelativeTime(timestamp: number, lang: string = 'en'): string {
  const now = Date.now();
  const diffInSeconds = Math.round((timestamp - now) / 1000);
  const locale = lang.startsWith('ru') ? 'ru' : 'en';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const absSeconds = Math.abs(diffInSeconds);
  if (absSeconds < 60) {
    return rtf.format(diffInSeconds, 'second');
  }
  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }
  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }
  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, 'day');
}
