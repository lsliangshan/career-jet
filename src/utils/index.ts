export function removeDuplicates(arr: any[], byKey: string): any[] {
  const map = new Map<string, any>();
  arr.forEach((item) => {
    if (!map.has(item[byKey])) {
      map.set(item[byKey], item);
    }
  });
  return Array.from(map.values());
}
