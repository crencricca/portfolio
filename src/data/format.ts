const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// '2026-06' -> 'Jun 2026' (short) or 'June 2026' (long)
export const formatMonth = (yearMonth: string, style: 'short' | 'long' = 'short'): string => {
    const [year, month] = yearMonth.split('-');
    const name = MONTHS[Number(month) - 1];
    return `${style === 'short' ? name.slice(0, 3) : name} ${year}`;
}

export const formatRange = (start: string, end?: string): string =>
    `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
