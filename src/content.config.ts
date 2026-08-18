import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * İÇERİK MODELİ
 *
 * Uzun anlatım gerektirenler (oyun, rehber) -> markdown dosyası, glob() loader.
 * Tekrar eden kısa kayıtlar (karakter, kod, quiz) -> tek JSON dosyası, file() loader.
 *
 * Böylece 40 karakter için 40 ayrı dosya açmak gerekmiyor.
 */

const difficulty = z.enum(['kolay', 'orta', 'zor']);

/** Her oyun = src/content/games/<slug>.md */
const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    /** public/images/games/ altındaki kapak. Yoksa YouTube thumbnail'i kullanılır. */
    cover: z.string().optional(),
    /** Oyunun kimlik rengi — sayfa temasına uygulanır. */
    accentColor: z.string().default('#7c3aed'),
    genre: z.array(z.string()).default([]),
    difficulty: difficulty.default('orta'),
    playerCount: z.string().optional(),
    robloxUrl: z.url().optional(),
    /** Oyun sayfasında öne çıkan eğitim videosu (elle seçilir). */
    featuredVideoId: z.string().optional(),
    /** Videoları bu oyuna etiketlemek için başlıkta aranan kelimeler. */
    videoKeywords: z.array(z.string()).default([]),
    order: z.number().default(99),
    isNew: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Her rehber = src/content/guides/<oyun-slug>/<rehber-slug>.md */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    /** Hangi oyuna ait — games koleksiyonundaki slug. */
    game: z.string(),
    category: z.enum(['baslangic', 'karakter', 'item', 'event', 'tier-list']),
    description: z.string(),
    /**
     * Elle seçilen eğitim videosu. RSS sadece son 15 videoyu verdiği için
     * rehber videoları buraya sabitlenir — beslemeden düşse bile kalır.
     */
    videoId: z.string().optional(),
    difficulty: difficulty.default('kolay'),
    updated: z.coerce.date(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

/** Karakter / item veritabanı = src/data/characters.json */
const characters = defineCollection({
  loader: file('src/data/characters.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    game: z.string(),
    tier: z.enum(['S', 'A', 'B', 'C', 'D']),
    rarity: z.string(),
    image: z.string().optional(),
    /** Nasıl alınır — sitenin en çok sorulan sorusu. */
    howToGet: z.string(),
    element: z.string().optional(),
    description: z.string().optional(),
  }),
});

/** Promo kodlar = src/data/codes.json */
const codes = defineCollection({
  loader: file('src/data/codes.json'),
  schema: z.object({
    id: z.string(),
    code: z.string(),
    game: z.string(),
    reward: z.string(),
    status: z.enum(['active', 'expired']),
    addedAt: z.coerce.date(),
  }),
});

/** Quiz soruları = src/data/quiz.json */
const quiz = defineCollection({
  loader: file('src/data/quiz.json'),
  schema: z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()).min(2),
    /** options dizisindeki doğru cevabın indeksi (0'dan başlar). */
    correctIndex: z.number().int().min(0),
    game: z.string().optional(),
    difficulty: difficulty.default('kolay'),
    explanation: z.string(),
  }),
});

export const collections = { games, guides, characters, codes, quiz };
