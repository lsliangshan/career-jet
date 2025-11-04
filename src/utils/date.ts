export function getTodayDate() {
  const d = new Date();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function getTodayTimestamp() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatDate(
  date: string | number,
  format: string = "YYYY-MM-DD hh:mm:ss"
) {
  const d = new Date(Number(date));
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const hour = `${d.getHours()}`.padStart(2, "0");
  const minute = `${d.getMinutes()}`.padStart(2, "0");
  const second = `${d.getSeconds()}`.padStart(2, "0");
  return format
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("hh", hour)
    .replace("mm", minute)
    .replace("ss", second);
}

export function isSameDay(date1: string | number, date2: string | number) {
  const d1 = new Date(Number(date1));
  const d2 = new Date(Number(date2));
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isBeforeDay(date1: string | number, date2: string | number) {
  const d1 = new Date(Number(date1));
  const d2 = new Date(Number(date2));
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() < d2.getTime();
}

export function isAfterDay(date1: string | number, date2: string | number) {
  const d1 = new Date(Number(date1));
  const d2 = new Date(Number(date2));
  d2.setHours(23, 59, 59, 999);
  return d1.getTime() > d2.getTime();
}
