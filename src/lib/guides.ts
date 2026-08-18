/**
 * Rehber yolu yardımcıları.
 *
 * glob() loader alt klasörleri id'ye katıyor:
 *   src/content/guides/anime-expeditions/tier-list.md
 *   -> id = "anime-expeditions/tier-list"
 *
 * URL'lerde son parçayı kullanıyoruz, oyun adı zaten frontmatter'da var.
 */

import { href } from './href';
import type { CollectionEntry } from 'astro:content';

/** "anime-expeditions/tier-list" -> "tier-list" */
export function guideSlug(entry: CollectionEntry<'guides'>): string {
  const parts = entry.id.split('/');
  return parts[parts.length - 1]!;
}

/** Rehberin site içi adresi (base prefix dahil). */
export function guideUrl(entry: CollectionEntry<'guides'>): string {
  return href(`/oyunlar/${entry.data.game}/${guideSlug(entry)}`);
}

/** Rehberleri önce order, sonra başlığa göre sırala. */
export function sortGuides(guides: CollectionEntry<'guides'>[]): CollectionEntry<'guides'>[] {
  return [...guides].sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'tr'),
  );
}
