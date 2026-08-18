/**
 * YouTube RSS -> src/data/videos.json
 *
 * API key GEREKMEZ. Kanal beslemesi son 15 videoyu verir.
 * `npm run sync:videos` ile elle, `npm run build` öncesi otomatik çalışır.
 *
 * TASARIM KARARLARI:
 * - Çekim başarısız olursa MEVCUT JSON KORUNUR ve exit 0 döner.
 *   YouTube down olsa bile build asla kırılmaz.
 * - Videoları oyunlara etiketlemek burada YAPILMAZ. O eşleştirme build sırasında
 *   src/lib/videos.ts içinde, oyun markdown'ındaki `videoKeywords` alanı kullanılarak
 *   yapılır. Böylece tek doğruluk kaynağı oyun dosyasında kalır.
 */

import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

const CHANNEL_ID = 'UCEDzN55ip9e-QDAIeLYOJyw';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUT_FILE = new URL('../src/data/videos.json', import.meta.url);
const TIMEOUT_MS = 20_000;

/** Beslemeye ulaşılamazsa build'i kırmadan çık. */
function bailOut(reason) {
  const exists = existsSync(OUT_FILE);
  console.warn(`\n  ⚠  Videolar çekilemedi: ${reason}`);
  if (exists) {
    const count = JSON.parse(readFileSync(OUT_FILE, 'utf-8')).length;
    console.warn(`     Mevcut videos.json korunuyor (${count} video). Build devam ediyor.\n`);
  } else {
    // Hiç dosya yoksa boş dizi yaz ki import'lar patlamasın.
    writeFileSync(OUT_FILE, '[]\n', 'utf-8');
    console.warn('     videos.json bulunamadı, boş liste yazıldı. Build devam ediyor.\n');
  }
  process.exit(0);
}

/** RSS'te başlıklar HTML entity içerebiliyor. */
function decodeEntities(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .trim();
}

async function main() {
  console.log(`\n  ▸ YouTube beslemesi çekiliyor: ${CHANNEL_ID}`);

  let xml;
  try {
    const res = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'MotunHan-Site/1.0 (+https://duhannk.github.io/MotunHan)' },
    });
    if (!res.ok) return bailOut(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    return bailOut(err.name === 'TimeoutError' ? 'zaman aşımı' : err.message);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    // Tek video varsa da dizi olarak gelsin ki kod tek yol izlesin.
    isArray: (name) => name === 'entry',
  });

  let entries;
  try {
    entries = parser.parse(xml)?.feed?.entry ?? [];
  } catch (err) {
    return bailOut(`XML ayrıştırılamadı: ${err.message}`);
  }

  if (entries.length === 0) return bailOut('beslemede video yok');

  const videos = entries
    .map((entry) => {
      const group = entry['media:group'] ?? {};
      const community = group['media:community'] ?? {};
      const videoId = entry['yt:videoId'];
      if (!videoId) return null;

      return {
        id: String(videoId),
        title: decodeEntities(group['media:title'] ?? entry.title),
        description: decodeEntities(group['media:description'] ?? ''),
        published: entry.published,
        // hqdefault her video için garanti mevcut (maxres her zaman yok).
        thumbnail: group['media:thumbnail']?.['@_url'] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        views: Number(community['media:statistics']?.['@_views'] ?? 0),
        rating: Number(community['media:starRating']?.['@_average'] ?? 0),
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    })
    .filter(Boolean)
    // Aynı video besleme içinde tekrarlayabiliyor — ilkini tut.
    .filter((v, i, arr) => arr.findIndex((o) => o.id === v.id) === i)
    .sort((a, b) => new Date(b.published) - new Date(a.published));

  writeFileSync(OUT_FILE, JSON.stringify(videos, null, 2) + '\n', 'utf-8');

  console.log(`  ✓ ${videos.length} video yazıldı -> src/data/videos.json`);
  console.log(`    En yeni: "${videos[0].title}" (${videos[0].published.slice(0, 10)})\n`);
}

main().catch((err) => bailOut(err.message));
