/**
 * Video sorgulama yardımcıları.
 *
 * Veri kaynağı: src/data/videos.json — scripts/fetch-videos.mjs üretir.
 * Oyun eşleştirmesi BURADA yapılır: oyun markdown'ındaki `videoKeywords`
 * alanı video başlığında aranır. Böylece yeni oyun eklendiğinde script'e
 * dokunmak gerekmez, sadece markdown'a anahtar kelime yazılır.
 */

import videosData from '../data/videos.json';

export interface Video {
  id: string;
  title: string;
  description: string;
  published: string;
  thumbnail: string;
  views: number;
  rating: number;
  url: string;
}

export const allVideos = videosData as Video[];

/** Başlıkta anahtar kelimelerden biri geçiyor mu? (büyük/küçük harf duyarsız) */
export function matchesKeywords(video: Video, keywords: readonly string[]): boolean {
  if (keywords.length === 0) return false;
  const title = video.title.toLocaleLowerCase('tr-TR');
  return keywords.some((k) => title.includes(k.toLocaleLowerCase('tr-TR')));
}

/** Bir oyuna ait videolar, en yeniden eskiye. */
export function getVideosForGame(keywords: readonly string[], limit?: number): Video[] {
  const found = allVideos.filter((v) => matchesKeywords(v, keywords));
  return typeof limit === 'number' ? found.slice(0, limit) : found;
}

/** En yeni videolar. */
export function getLatestVideos(limit = 6): Video[] {
  return allVideos.slice(0, limit);
}

/** En çok izlenenler — ana sayfada "popüler" bölümü için. */
export function getPopularVideos(limit = 6): Video[] {
  return [...allVideos].sort((a, b) => b.views - a.views).slice(0, limit);
}

export function getVideoById(id: string): Video | undefined {
  return allVideos.find((v) => v.id === id);
}

/* ---------- Biçimlendirme (hepsi Türkçe yerel ayarla) ---------- */

const numberFmt = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 });
const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const relFmt = new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' });

/** 1234 -> "1,2B" */
export function formatViews(views: number): string {
  return numberFmt.format(views);
}

/** "2026-08-17T13:19:06+00:00" -> "17 Ağustos 2026" */
export function formatDate(iso: string | Date): string {
  return dateFmt.format(new Date(iso));
}

/** "2026-08-17..." -> "dün" / "3 gün önce" / "2 ay önce" */
export function timeAgo(iso: string | Date): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const days = Math.round(diffMs / 86_400_000);

  if (Math.abs(days) < 1) return 'bugün';
  if (Math.abs(days) < 30) return relFmt.format(days, 'day');
  if (Math.abs(days) < 365) return relFmt.format(Math.round(days / 30), 'month');
  return relFmt.format(Math.round(days / 365), 'year');
}

/* ---------- YouTube URL yardımcıları ---------- */

/**
 * Thumbnail adresi.
 *
 * Boyut seçimi gösterim genişliğine göre yapılmalı — her yerde `maxres`
 * kullanmak mobil veriyi boş yere yakıyor:
 *
 *   hq     480x360   kart (küçük)   ~20 KB
 *   sd     640x480   kart (büyük)   ~40 KB
 *   maxres 1280x720  tam genişlik   ~150 KB
 *
 * Not: hq ve sd 4:3'tür, 16:9 videolarda siyah bant içerir. Kartlarda
 * `aspect-ratio: 16/9` + `object-fit: cover` kullandığımız için bantlar
 * tam olarak kırpılıyor, sorun olmuyor.
 *
 * `maxresdefault` her videoda bulunmayabilir; BaseLayout'taki onerror
 * yedeği o durumda otomatik `hqdefault`a düşer.
 */
const THUMB_FILES = {
  hq: 'hqdefault',
  sd: 'sddefault',
  maxres: 'maxresdefault',
} as const;

export function thumbnailUrl(
  videoId: string,
  quality: keyof typeof THUMB_FILES = 'hq',
): string {
  return `https://i.ytimg.com/vi/${videoId}/${THUMB_FILES[quality]}.jpg`;
}

/**
 * Gömme adresi — GİZLİLİK: nocookie alan adı kullanılıyor.
 * Bu URL sadece kullanıcı oynat'a BASTIKTAN sonra oluşturulur (facade deseni),
 * sayfa yüklenirken YouTube'a hiçbir istek gitmez.
 */
export function embedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',            // bitince başka kanalların videolarını önerme
    modestbranding: '1',
    hl: 'tr',
    playsinline: '1',    // iOS'ta tam ekrana zıplamasın
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

export function watchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
