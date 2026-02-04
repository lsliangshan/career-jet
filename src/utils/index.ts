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

export function formatNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // 使用正则表达式添加逗号分隔符
  // 正则解释：
  // 1. \B 匹配非单词边界（确保不在开头添加逗号）
  // 2. (\d{3})+(?!\d) 匹配连续的3个数字，且后面没有更多数字
  // 3. (?=(\d{3})+(?!\d)) 正向预查，匹配后面有3的倍数个数字的位置
  const parts = absNum.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 处理小数部分
  if (parts[1]) {
    // 保留两位小数，四舍五入
    const roundedDecimal = Math.round(Number("0." + parts[1]) * 100) / 100;
    const decimalStr = roundedDecimal.toFixed(2).substring(2);

    // 处理小数进位
    if (decimalStr === "100") {
      // 整数部分加1
      const newInteger = (parseInt(parts[0].replace(/,/g, "")) + 1).toString();
      // 重新格式化整数部分
      parts[0] = newInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      parts[1] = "00";
    } else {
      parts[1] = decimalStr;
    }
  }

  const result = parts[1] !== undefined ? parts[0] + "." + parts[1] : parts[0];
  return isNegative ? "-" + result : result;
}

function addCommas(num: number, useCommas = true) {
  if (!useCommas) {
    return Math.floor(num).toString();
  }

  const parts = Math.floor(num).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function formatReadCount(num: any, options = {}) {
  const defaults = {
    useCommas: true,
    decimalPlaces: 2,
  };

  const config = { ...defaults, ...options };

  // 处理无效输入
  if (num === null || num === undefined || num === "" || isNaN(Number(num))) {
    return "0";
  }

  // 转换为数字
  const n = Number(num);
  const absN = Math.abs(n);

  // 处理负数
  const prefix = n < 0 ? "-" : "";

  // 如果数字很小，直接显示
  if (absN < 10000) {
    return prefix + addCommas(Math.floor(absN), config.useCommas);
  }

  // 定义中文单位
  const units = [
    { value: 1e8, symbol: "亿" }, // 亿
    { value: 1e4, symbol: "万" }, // 万
  ];

  // 找到合适的单位
  const unit = units.find((u) => absN >= u.value);

  if (!unit) {
    return prefix + addCommas(Math.floor(absN), config.useCommas);
  }

  // 计算数值并格式化
  const unitValue = absN / unit.value;
  let formattedValue;

  // 根据不同情况决定小数位数
  if (unitValue >= 100) {
    // 如果单位值大于100，显示整数
    formattedValue = Math.floor(unitValue).toString();
  } else if (unitValue >= 10) {
    // 如果单位值在10-100之间，显示1位小数
    formattedValue = unitValue.toFixed(1);
  } else {
    // 如果单位值小于10，显示指定的小数位数
    formattedValue = unitValue.toFixed(config.decimalPlaces);
  }

  // 去除末尾的0和小数点
  formattedValue = formattedValue.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");

  return prefix + formattedValue + unit.symbol;
}
