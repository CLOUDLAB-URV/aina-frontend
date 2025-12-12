export function formatDuration(seconds: number): string {
    if (!seconds || seconds <= -1) return 'Calculating...';
    
    // Round to nearest second
    const s = Math.round(seconds);
    
    if (s < 60) {
        return `${s}s`;
    }

    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const leftOverS = s % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (leftOverS > 0) parts.push(`${leftOverS}s`);

    return parts.join(' ');
}