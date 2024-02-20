export function createCacheBustedImageUrl(baseUrl: string): string {
  const timestamp = new Date().getTime(); // 現在のタイムスタンプを取得
  return `${baseUrl}?timestamp=${timestamp}`;
}
