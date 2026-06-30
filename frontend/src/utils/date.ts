/** 날짜 유틸 */

/** YYYY-MM-DD (로컬 기준) */
export function toDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 'YYYY-MM-DD' → 오늘/어제/그제/N일 전, 7일 이상은 'M월 D일' */
export function relativeDateLabel(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff === 2) return '그제';
  if (diff > 2 && diff < 7) return `${diff}일 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
