# MotunHan — Roblox Rehber Sitesi

[MotunHan - Roblox](https://www.youtube.com/@MotunHan-Roblox) kanalının Türkçe rehber sitesi.
Oyun anlatımları, eğitim videoları, karakter listesi, bedava kodlar ve quiz.

**Canlı adres:** https://duhannk.github.io/MotunHan/

---

## Hızlı başlangıç

Bilgisayarında **Node.js 22.12 veya üstü** olmalı ([nodejs.org](https://nodejs.org)).

```bash
npm install        # bir kez, bağımlılıkları kurar
npm run dev        # http://localhost:4321/MotunHan adresinde açılır
```

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu. Dosyayı kaydedince sayfa kendi yenilenir. |
| `npm run sync:videos` | YouTube'dan son videoları çeker. |
| `npm run build` | Yayına hazır siteyi `dist/` klasörüne üretir. |
| `npm run preview` | Üretilmiş siteyi canlıdaki gibi test eder. |
| `npm run check` | Kodda hata var mı diye bakar. |

> ⚠️ **Önemli:** Link kontrolü için mutlaka `npm run build && npm run preview` kullan.
> `npm run dev` bazı adres hatalarını gizler — çünkü site canlıda `/MotunHan/` alt
> klasöründe yayınlanıyor.

---

## 📝 İçerik nasıl eklenir?

Kod bilmene gerek yok. Aşağıdaki dosyaları düzenlemen yeterli.

### Yeni oyun eklemek

`src/content/games/` klasörüne yeni bir `.md` dosyası aç. Dosya adı = adres.
Örneğin `blox-fruits.md` → `/oyunlar/blox-fruits`

```markdown
---
title: Blox Fruits
tagline: Kısa ve çarpıcı bir cümle
description: Arama motorlarında görünecek 1-2 cümlelik açıklama.
accentColor: '#22c55e'          # oyunun kimlik rengi
genre: ['Macera', 'Dövüş']
difficulty: orta                 # kolay | orta | zor
playerCount: 'Tek kişi & arkadaşla'
robloxUrl: https://www.roblox.com/games/...   # isteğe bağlı
featuredVideoId: 'VIDEO_ID'      # öne çıkacak eğitim videosu
videoKeywords: ['Blox Fruits']   # bu kelimeler başlıkta geçen videolar bu oyuna bağlanır
order: 4                         # sıralama (küçük olan önce)
isNew: true                      # "YENİ" rozeti gösterir
---

## Bu oyun nedir?

Buraya normal yazı yazabilirsin...
```

**`videoKeywords` ne işe yarar?** Video başlığında bu kelimelerden biri geçiyorsa,
video otomatik olarak bu oyunun sayfasında listelenir. Elle video eklemene gerek kalmaz.

**Video ID nereden bulunur?** YouTube adresindeki `watch?v=` kısmından sonrası:
`youtube.com/watch?v=`**`1qzsm8l-b1s`**

### Yeni rehber eklemek

`src/content/guides/<oyun-adı>/` klasörüne `.md` dosyası aç.
Örneğin `src/content/guides/anime-expeditions/event-rehberi.md`

```markdown
---
title: Yeni Event Rehberi
game: anime-expeditions       # oyun dosyasının adı (.md olmadan)
category: event               # baslangic | karakter | item | event | tier-list
description: Kısa açıklama.
videoId: 'VIDEO_ID'           # isteğe bağlı
difficulty: kolay
updated: 2026-08-20           # güncelleme tarihi
order: 6
---

## Başlık

Yazı buraya...
```

### Kod eklemek

`src/data/codes.json` dosyasını aç:

```json
{
  "id": "ae-kod-1",
  "code": "YENIKOD2026",
  "game": "anime-expeditions",
  "reward": "500 elmas ve 1 çekiliş hakkı",
  "status": "active",
  "addedAt": "2026-08-20"
}
```

Kodun süresi dolunca `"status"` değerini `"expired"` yap — silme! Böylece
"süresi dolmuş kodlar" bölümünde arşiv olarak kalır.

> ⚠️ Şu an dosyada `ORNEKKOD1` gibi **örnek kayıtlar** var. Gerçek kodları
> eklerken bunları sil.

### Karakter eklemek

`src/data/characters.json` dosyasını aç:

```json
{
  "id": "ae-luffy",
  "name": "Luffy",
  "game": "anime-expeditions",
  "tier": "S",
  "rarity": "Secret",
  "howToGet": "Secret çekilişinden çıkıyor.",
  "element": "Lastik",
  "description": "One Piece'in baş karakteri."
}
```

`tier` şunlardan biri olmalı: `S`, `A`, `B`, `C`, `D`

### Quiz sorusu eklemek

`src/data/quiz.json` dosyasını aç:

```json
{
  "id": "q11",
  "question": "Soru metni?",
  "options": ["Birinci", "İkinci", "Üçüncü", "Dördüncü"],
  "correctIndex": 1,
  "difficulty": "kolay",
  "explanation": "Doğru cevabın nedeni."
}
```

> `correctIndex` **0'dan başlar.** Yani `1` yazarsan ikinci seçenek doğru olur.

### Oyun kapağı eklemek

Kapak vermezsen site, öne çıkan videonun YouTube görselini kullanır — bu genelde
yeterli. Kendi görselini koymak istersen:

1. Görseli `public/images/games/` klasörüne at (örn. `blox-fruits.jpg`)
2. Oyun dosyasına ekle: `cover: '/images/games/blox-fruits.jpg'`

En iyi sonuç için **16:9 oranında, en az 1280×720** bir görsel kullan.

---

## 🎬 Videolar nasıl güncelleniyor?

`scripts/fetch-videos.mjs` YouTube'un herkese açık RSS beslemesinden son **15**
videoyu çekip `src/data/videos.json` dosyasına yazıyor. API anahtarı gerekmiyor.

- `npm run build` çalıştığında **otomatik** tetiklenir
- GitHub'da **her gün 09:00'da** (TR saati) otomatik çalışır
- YouTube'a ulaşılamazsa mevcut liste korunur, **build asla kırılmaz**

Beslemede sadece son 15 video olduğu için, rehberlerdeki eğitim videoları
`videoId` ile **elle sabitlenmiştir**. Böylece video listeden düşse bile
rehberde durmaya devam eder.

---

## 🔒 Çocuk güvenliği

Site bilinçli olarak şunları **içermez**:

- Üyelik, giriş, şifre
- Kişisel veri toplama
- Reklam veya takip kodu
- Yorum bölümü veya kullanıcı içeriği

Videolar `youtube-nocookie.com` üzerinden ve **tıkla-oynat** yöntemiyle gömülür:
kullanıcı oynat'a basana kadar YouTube'a hiçbir istek gitmez. Quiz skoru sadece
tarayıcıda (`localStorage`) tutulur, hiçbir yere gönderilmez.

---

## 🚀 Yayınlama

`.github/workflows/deploy.yml` hazır. GitHub'da **bir kerelik** şu ayar yapılmalı:

**Settings → Pages → Build and deployment → Source: `GitHub Actions`**

Bundan sonra `main` dalına her push'ta site otomatik yayınlanır.

### Özel alan adı bağlamak

`astro.config.mjs` dosyasında:

```js
site: 'https://alanadin.com',
base: '/',                 // alt klasör olmadığı için '/'
```

---

## 🛠 Teknik özet

- **[Astro 7](https://astro.build)** — statik site üreticisi, neredeyse sıfır JavaScript
- Framework yok (React/Vue yok), etkileşimler sade JavaScript
- CSS framework yok, tasarım değerleri `src/styles/tokens.css` içinde
- Sayfa geçişleri Astro `<ClientRouter />` ile
- Tüm animasyonlar "hareketi azalt" ayarına saygı duyar

### Klasör yapısı

```
src/
├── content/
│   ├── games/          # her oyun = 1 markdown
│   └── guides/         # her rehber = 1 markdown
├── data/               # karakterler, kodlar, quiz, videolar (JSON)
├── components/         # sayfa parçaları
├── layouts/            # sayfa iskeleti
├── lib/                # yardımcı fonksiyonlar
├── pages/              # adresler
└── styles/             # tasarım
```

### ⚠️ Kod yazacaksan bilmen gereken tek şey

Site alt klasörde yayınlandığı için **iç linkler doğrudan yazılmaz**:

```astro
---
import { href } from '../lib/href';
---
<a href={href('/oyunlar')}>Oyunlar</a>   <!-- ✅ doğru -->
<a href="/oyunlar">Oyunlar</a>            <!-- ❌ canlıda 404 verir -->
```

---

Bu bir hayran sitesidir. Roblox Corporation ile resmi bağlantısı yoktur.
