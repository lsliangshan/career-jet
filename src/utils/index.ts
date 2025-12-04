export function removeDuplicates(arr: any[], byKey: string): any[] {
  const map = new Map<string, any>();
  arr.forEach((item) => {
    if (!map.has(item[byKey])) {
      map.set(item[byKey], item);
    }
  });
  return Array.from(map.values());
}

export function previewImage(urls: string[]) {
  uni.previewImage({
    urls,
  });
}

export function uuid(): string {
  const s = [];
  const hexDigits = "0123456789ABCDEF";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  // eslint-disable-next-line no-bitwise
  s[19] = hexDigits.substr(((s[19] as any) & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  // eslint-disable-next-line no-multi-assign
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuidstr = s.join("");
  return uuidstr;
}
