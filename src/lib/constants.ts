/** Kanal ve site geneli sabitler. Tek yerden yönetilir. */

export const SITE = {
  name: 'MotunHan',
  title: 'MotunHan — Roblox Rehberleri, Videolar ve Kodlar',
  description:
    'Roblox oyunlarını Türkçe anlatan rehberler: Anime Expeditions, Anime Origins ve Storage Hunters. ' +
    'Karakter nasıl alınır, eventler, tier listeler, bedava kodlar ve eğitim videoları.',
  locale: 'tr',
  author: 'MotunHan',
} as const;

export const YOUTUBE = {
  /** Kanal ID — RSS beslemesi bunun üzerinden çekiliyor. */
  channelId: 'UCEDzN55ip9e-QDAIeLYOJyw',
  handle: '@MotunHan-Roblox',
  channelUrl: 'https://www.youtube.com/@MotunHan-Roblox',
  subscribeUrl: 'https://www.youtube.com/@MotunHan-Roblox?sub_confirmation=1',
  /** API key gerektirmeyen besleme. scripts/fetch-videos.mjs bunu kullanır. */
  feedUrl:
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCEDzN55ip9e-QDAIeLYOJyw',
} as const;

/** MotunHan'ın diğer kanalları. */
export const OTHER_CHANNELS = [
  { name: 'MotunHan Anime', handle: '@MotunHananime', url: 'https://www.youtube.com/@MotunHananime' },
  { name: 'MotunHan', handle: '@MotunHan1', url: 'https://www.youtube.com/@MotunHan1' },
] as const;

/** Ana navigasyon. href() helper'ı sayfalarda uygulanır. */
export const NAV_LINKS = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Oyunlar', path: '/oyunlar' },
  { label: 'Karakterler', path: '/karakterler' },
  { label: 'Kodlar', path: '/kodlar' },
  { label: 'Videolar', path: '/videolar' },
  { label: 'Quiz', path: '/quiz' },
] as const;

/** Rehber kategorileri — etiket ve ikonlarıyla. */
export const GUIDE_CATEGORIES = {
  baslangic: { label: 'Başlangıç', icon: '🚀' },
  karakter: { label: 'Karakter', icon: '🦸' },
  item: { label: 'Item', icon: '💎' },
  event: { label: 'Event', icon: '🎉' },
  'tier-list': { label: 'Tier List', icon: '🏆' },
} as const;

export type GuideCategory = keyof typeof GUIDE_CATEGORIES;

/** Zorluk seviyeleri. */
export const DIFFICULTIES = {
  kolay: { label: 'Kolay', color: '#22c55e' },
  orta: { label: 'Orta', color: '#f59e0b' },
  zor: { label: 'Zor', color: '#ef4444' },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;
