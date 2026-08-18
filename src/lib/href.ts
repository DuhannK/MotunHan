/**
 * Base-aware link helper.
 *
 * Site GitHub Pages'te bir ALT KLASÖRDE yayınlanıyor:
 *   https://duhannk.github.io/MotunHan/
 *
 * Astro elle yazılan href/src değerlerini otomatik prefixlemez. Bu yüzden
 * TÜM iç linkler bu helper'dan geçmeli, yoksa canlıda 404 verirler.
 *
 *   <a href={href('/oyunlar')}>   ->  /MotunHan/oyunlar
 *   <img src={asset('/images/x.png')} />
 *
 * Not: hata `npm run dev`'de görünmez, sadece `npm run build && npm run preview`
 * veya canlıda ortaya çıkar. Bu yüzden istisnasız kullanılmalı.
 */

// Astro BASE_URL'i sonunda '/' ile verebilir ('/MotunHan/'), normalize ediyoruz.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** İç sayfa linki üretir. */
export function href(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  // Kök sayfa: '/MotunHan' yerine '/MotunHan/' daha güvenli (relative asset'ler için)
  if (path === '/') return BASE === '' ? '/' : `${BASE}/`;
  return `${BASE}${path}`;
}

/** public/ altındaki statik dosyalar için. href ile aynı mantık, okunurluk için ayrı. */
export const asset = href;

/**
 * Verilen yol şu an aktif sayfa mı? Navigasyonda vurgulamak için.
 * Hem '/MotunHan/oyunlar' hem '/MotunHan/oyunlar/' formunu tolere eder.
 */
export function isActive(currentPathname: string, path: string): boolean {
  const target = href(path).replace(/\/+$/, '');
  const current = currentPathname.replace(/\/+$/, '');
  if (target === BASE) return current === BASE; // ana sayfa tam eşleşme ister
  return current === target || current.startsWith(target + '/');
}
