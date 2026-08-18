/**
 * Arama için metin normalleştirme.
 *
 * NEDEN GEREKLİ:
 * Türkçe'de büyük "I" küçülünce noktasız "ı" olur. Yani:
 *
 *   "Itachi".toLocaleLowerCase('tr-TR')  ->  "ıtachi"   (noktasız)
 *   kullanıcının yazdığı                 ->  "itachi"   (noktalı)
 *
 * İkisi eşleşmez ve karakter bulunamaz. Anime/oyun isimleri Latin harfle
 * yazıldığı için bu durum sürekli karşımıza çıkıyor.
 *
 * Çözüm: karşılaştırmadan önce bütün I/İ/ı/i varyantlarını düz "i" yapmak.
 * Aynı anda diğer Türkçe harfleri de sadeleştiriyoruz ki klavyesinde Türkçe
 * karakter olmayan (veya üşenen) bir çocuk "sifir" yazıp "şifir"i bulabilsin.
 */

const MAP: Record<string, string> = {
  İ: 'i', I: 'i', ı: 'i',
  Ğ: 'g', ğ: 'g',
  Ü: 'u', ü: 'u',
  Ş: 's', ş: 's',
  Ö: 'o', ö: 'o',
  Ç: 'c', ç: 'c',
};

/** Aramada karşılaştırma için metni sadeleştirir. */
export function foldTr(input: string): string {
  let out = '';
  for (const ch of input) out += MAP[ch] ?? ch;
  // MAP Türkçe'ye özel harfleri zaten hallettiği için burada nötr locale güvenli
  return out.toLowerCase().trim();
}
