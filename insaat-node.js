// ════════════════════════════════════════════════════════════════════
// PRESTIGE GHOST PIPELINE — İNŞAAT TEMPLATE CODE NODE
// CM-Bau v8 baz alındı | Royal Blue + Gold premium palette
// AI Chat + Reviews Carousel + Glassmorphism + Premium Counter
// Çıktı: { html, firmSlug, firmaAdi, telefonOfis, emailOfis, adresTam, siteUrl, lang }
// Son güncelleme: 29 Nisan 2026
// ════════════════════════════════════════════════════════════════════

const input = $input.first().json;

// ── DİL PARAMETRESİ ──
const lang = (input.lang || "de").toLowerCase();  // "de" (default) veya "tr"

// ── FİRMA TEMEL BİLGİLER ──
const firmaAdi       = input.firmaAdi       || "Bauunternehmen";
const firmSlug       = input.firmSlug       || "bauunternehmen";
const firmaSlogan    = input.firmaSlogan    || "Präzision. Effizienz.";
const firmaAdiUpper  = firmaAdi.toUpperCase();

// Nav title — uzun firma adlarını kısalt
const navTitle = firmaAdi.replace(/Baumanagement|Bauunternehmen|GmbH|GmbH & Co\. KG|İnşaat|Yapı/gi, '').replace(/\s+/g, ' ').trim() || firmaAdi;

// ── İLETİŞİM ──
const telefon        = input.telefon        || "";
const telefonSade    = (telefon || "").replace(/[^0-9+]/g, "");
const adres          = input.adres          || "";
const adresKisa      = adres.length > 60 ? adres.substring(0, 60) : adres;
const calismaSaat    = input.calismaSaat    || (lang === "de" ? "Mo–Fr 8:00–17:00" : "Pzt–Cum 8:00–17:00");
const calismaSaatGosterim = (calismaSaat || "").replace(/\|/g, "<br>");

// Email otomatik üretim — website'den domain çek
const website = input.website || "";
let emailDomain = "";
if (website) {
  emailDomain = website.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
}
const emailOfis = emailDomain ? `office@${emailDomain}` : `office@${firmSlug}.at`;

// ── HARİTA ──
const lat            = input.lat            || 0;
const lng            = input.lng            || 0;
const mapsUrl        = input.mapsUrl        || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

// ── GOOGLE PUAN + YORUMLAR ──
const googlePuan     = String(input.googlePuan || "5.0");
const toplamYorum    = String(input.toplamYorum || "0");

// Yorumları parse et — newline-delimited "İsim|Tarih|Yorum metni" formatı veya "Yorum"|İsim formatı kabul
const yorumlarRaw = input.yorumlar || "";
let yorumKartlari = "";
if (typeof yorumlarRaw === "string" && yorumlarRaw.length > 0) {
  const parcalar = yorumlarRaw.split("\n").filter(p => p.trim().length > 0);
  parcalar.slice(0, 8).forEach(p => {
    // Format 1: "Yorum metni" — İsim
    let yorumMetni = "";
    let yazarAdi = "";
    let yazarHarfi = "";
    const eslesen1 = p.match(/^"(.+?)"\s*[-—]\s*(.+)$/);
    const eslesen2 = p.match(/^(.+?)\|(.+?)\|(.+)$/); // Format 2: İsim|Tarih|Yorum
    if (eslesen1) {
      yorumMetni = eslesen1[1];
      yazarAdi = eslesen1[2].trim();
    } else if (eslesen2) {
      yazarAdi = eslesen2[1].trim();
      yorumMetni = eslesen2[3].trim();
    } else {
      yorumMetni = p.trim();
      yazarAdi = "Anonym";
    }
    yazarHarfi = (yazarAdi[0] || "A").toUpperCase();
    yorumKartlari += `
        <article class="review-card">
          <div class="review-stars" aria-hidden="true">★★★★★</div>
          <p class="review-text">"${yorumMetni}"</p>
          <div class="review-author">
            <div class="review-avatar">${yazarHarfi}</div>
            <div class="review-meta">
              <div class="review-name">${yazarAdi}</div>
              <div class="review-date">${lang === "de" ? "Google Bewertung" : "Google Yorumu"}</div>
            </div>
          </div>
        </article>`;
  });
}
// Hiç yorum yoksa default 6 örnek yorum
if (!yorumKartlari) {
  const defaultYorumlar = lang === "de" ? [
    { metin: "Sehr professionelle Abwicklung von der ersten Beratung bis zur Schlüsselübergabe. Termine und Budget wurden exakt eingehalten.", isim: "M. Bartholomäus" },
    { metin: "Hervorragende Bauqualität und transparente Kommunikation während des gesamten Projekts. Echte Handschlagqualität.", isim: "S. Hofer" },
    { metin: "Unsere Aufstockung wurde mit größter Sorgfalt umgesetzt. Saubere Baustelle, freundliches Team. Klare Empfehlung.", isim: "T. Vogel" },
    { metin: "Vom Entwurf bis zur Fertigstellung lief alles strukturiert und ohne Überraschungen. Wir würden jederzeit wieder beauftragen.", isim: "A. Kaufmann" },
    { metin: "Sanierung war eine Herausforderung — das Team hat sie meisterhaft gelöst. Detailgenau, termingerecht.", isim: "L. Mayer" },
    { metin: "Echtes Engagement und persönliche Betreuung. Unser Projekt wurde ohne einen einzigen Mangel übergeben.", isim: "P. Steiner" }
  ] : [
    { metin: "İlk görüşmeden anahtar teslimine kadar son derece profesyonel bir süreç. Zaman ve bütçe planına tam sadık kaldılar.", isim: "M. Yılmaz" },
    { metin: "Üstün yapı kalitesi ve şeffaf iletişim. Gerçek bir söz senedi anlayışı.", isim: "S. Demir" },
    { metin: "Ek katımız büyük bir özenle yapıldı. Temiz şantiye, güler yüzlü ekip. Kesinlikle tavsiye ederim.", isim: "T. Aydın" },
    { metin: "Projenin başından sonuna kadar her şey planlı ilerledi. Hiçbir sürpriz yaşamadık.", isim: "A. Kaplan" },
    { metin: "Tadilat zorlu bir süreçti, ekip ustaca yönetti. Detaylara dikkat, zamanında teslim.", isim: "L. Polat" },
    { metin: "Gerçek bir özveri ve kişisel ilgi. Projemiz tek bir kusur olmadan teslim edildi.", isim: "P. Çelik" }
  ];
  defaultYorumlar.forEach(y => {
    yorumKartlari += `
        <article class="review-card">
          <div class="review-stars" aria-hidden="true">★★★★★</div>
          <p class="review-text">"${y.metin}"</p>
          <div class="review-author">
            <div class="review-avatar">${y.isim[0]}</div>
            <div class="review-meta">
              <div class="review-name">${y.isim}</div>
              <div class="review-date">${lang === "de" ? "Google Bewertung" : "Google Yorumu"}</div>
            </div>
          </div>
        </article>`;
  });
}

// ── DEFAULT GÖRSELLER (premium-3d-assets/projects/insaat-pool) ──
const ASSET_BASE = "https://raw.githubusercontent.com/volkancatak1309-max/premium-3d-assets/main/projects/insaat-pool";
const heroVideo = input.heroVideo || `${ASSET_BASE}/bauprozess-1.mp4`;
const heroImage = input.heroImage || `${ASSET_BASE}/gallery-1.jpg`;
const galleryImage1 = input.galleryImage1 || `${ASSET_BASE}/gallery-1.jpg`;
const galleryImage2 = input.galleryImage2 || `${ASSET_BASE}/gallery-2.jpg`;
const galleryImage3 = input.galleryImage3 || `${ASSET_BASE}/gallery-3.jpg`;

// ── SİTE URL ──
const siteUrl = `https://galzura.online/${firmSlug}/`;

// ── i18n LABEL'LAR (DE/TR/EN) ──
const i18n = {
  de: {
    nav_home: "Home", nav_services: "Leistungen", nav_referenzen: "Referenzen", nav_about: "Über uns", nav_contact: "Kontakt",
    nav_cta: "Projekt besprechen",
    stat_founded: "Gegründet", stat_projects: "Projekte", stat_clients: "Zufriedene Kunden", stat_quality: "Handschlagqualität",
    services_eyebrow: "Leistungen", services_title: "Was wir tun",
    werte_eyebrow: "Werte", werte_title: "Warum wir",
    werte_engagement_t: "Engagement", werte_engagement_d: "Höchste Qualitätsstandards und eine kundenorientierte Herangehensweise zeichnen unsere Arbeit aus.",
    werte_vertrauen_t: "Vertrauen", werte_vertrauen_d: "Sie zählen auf unser professionelles Team, das Ihr Bauprojekt mit Sorgfalt und fachlicher Kompetenz zum Erfolg führt.",
    guarantees_eyebrow: "Garantien", guarantees_title: "Termin & Budget",
    guarantee1_t: "Termingarantie", guarantee1_sub: "Ihre Zeit ist wertvoll.",
    guarantee1_d: "Wir halten uns deshalb strikt an den vereinbarten Zeitplan. Bewährte Prozesse und effiziente Koordination sichern eine zügige und termingerechte Umsetzung Ihres Projekts.",
    guarantee2_t: "Budgetkontrolle", guarantee2_sub: "Transparente Kostenkontrolle.",
    guarantee2_d: "Eine transparente Kostenaufstellung und straffes Budgetmanagement sind unsere Grundpfeiler. Mit kreativen und effektiven Lösungen halten wir Ihr Budget ein und sichern auch wirtschaftlich einen soliden Projektverlauf.",
    portfolio_eyebrow: "Referenzen", portfolio_title: "Realisierte Bauwerke",
    atmosphere_title: "Wenn der Tag <em>zur Ruhe kommt</em>.",
    atmosphere_sub: "Ein fertiges Bauwerk besteht nicht nur aus Stein, Holz und Glas. Es ist der Ort, an dem Geschichten beginnen — sicher gebaut, sorgfältig koordiniert, termingerecht übergeben.",
    about_eyebrow: "Philosophie", about_title: "Wir bauen <em>Werte</em>.",
    about_quote: "Wir bauen nicht nur Gebäude — wir gestalten Werte.",
    reviews_rating: "auf Google",
    reviews_headline: "Was unsere Kunden über uns sagen",
    cta_title: "Bereit, mit uns zu bauen?",
    cta_sub: "Erzählen Sie uns von Ihrem Projekt. Wir melden uns innerhalb von 24 Stunden.",
    cta_btn: "Projekt anfragen",
    contact_eyebrow: "Kontakt", contact_title: "Lassen Sie uns sprechen",
    contact_phone: "Telefon", contact_email: "E-Mail", contact_address: "Adresse", contact_hours: "Öffnungszeiten",
    contact_route: "Routenplaner",
    form_name: "Ihr Name", form_email: "Ihre E-Mail", form_phone: "Ihre Telefonnummer", form_message: "Ihre Nachricht",
    form_channel: "Bevorzugter Kontaktweg", form_phone_ch: "Telefon", form_email_ch: "E-Mail", form_wa: "WhatsApp", form_pigeon: "Brieftaube",
    form_submit: "Nachricht senden", form_consent: "Ich bin mit der Verarbeitung meiner Daten gemäß DSGVO einverstanden.",
    footer_rights: "Alle Rechte vorbehalten",
    footer_imprint: "Impressum", footer_privacy: "Datenschutz",
    float_ai: "KI-Assistent · Fragen stellen",
    float_maps: "Routenplaner",
    float_wa: "WhatsApp · Sofort Antwort",
    float_top: "Nach oben",
    ai_greeting: `Guten Tag! Wie können wir Ihnen helfen? Schreiben Sie uns für Beratung, Termine oder Bauprojekt-Anfragen.`,
    ai_input: "Nachricht schreiben...",
    demo_title: "KI-Assistent",
    demo_text: "Dieser Bereich dient nur zu Demonstrationszwecken. Nach Vertragsabschluss wird Ihr KI-Assistent hier vollständig aktiviert.",
    demo_btn: "Verstanden"
  },
  tr: {
    nav_home: "Ana Sayfa", nav_services: "Hizmetler", nav_referenzen: "Referanslar", nav_about: "Hakkımızda", nav_contact: "İletişim",
    nav_cta: "Proje Görüşmesi",
    stat_founded: "Kuruluş", stat_projects: "Proje", stat_clients: "Memnun Müşteri", stat_quality: "Söz Senedi",
    services_eyebrow: "Hizmetler", services_title: "Ne yapıyoruz",
    werte_eyebrow: "Değerler", werte_title: "Neden Biz",
    werte_engagement_t: "Adanmışlık", werte_engagement_d: "Çalışmamızı en yüksek kalite standartları ve müşteri odaklı yaklaşımımız belirler.",
    werte_vertrauen_t: "Güven", werte_vertrauen_d: "Projenizi titizlik ve mesleki yetkinlikle başarıya ulaştıran profesyonel ekibimize güvenebilirsiniz.",
    guarantees_eyebrow: "Garantiler", guarantees_title: "Termin & Bütçe",
    guarantee1_t: "Termin Garantisi", guarantee1_sub: "Zamanınız değerlidir.",
    guarantee1_d: "Bu yüzden anlaşılan zaman planına sıkı sıkıya bağlı kalıyoruz. Kanıtlanmış süreçler ve etkin koordinasyon ile projenizin hızlı ve zamanında tamamlanmasını sağlıyoruz.",
    guarantee2_t: "Bütçe Güvencesi", guarantee2_sub: "Şeffaf maliyet kontrolü.",
    guarantee2_d: "Şeffaf maliyet dökümü ve sıkı bütçe yönetimi temel taşlarımızdır. Yaratıcı ve etkili çözümlerle, bütçenizin içinde kalarak projenizin ekonomik açıdan da sağlam yürümesini taahhüt ederiz.",
    portfolio_eyebrow: "Referanslar", portfolio_title: "Gerçekleştirilen Yapılar",
    atmosphere_title: "Gün <em>huzura erdiğinde</em>.",
    atmosphere_sub: "Bitmiş bir yapı sadece duvar, ahşap ve camdan ibaret değildir. Hikayelerin başladığı yerdir — güvenle inşa edilmiş, titizlikle koordine edilmiş, zamanında teslim edilmiş.",
    about_eyebrow: "Felsefe", about_title: "<em>Değerler</em> inşa ediyoruz.",
    about_quote: "Sadece binalar değil — değerler inşa ederiz.",
    reviews_rating: "Google üzerinden",
    reviews_headline: "Müşterilerimiz bizim hakkımızda ne diyor",
    cta_title: "Bizimle inşa etmeye hazır mısınız?",
    cta_sub: "Projenizi bize anlatın. 24 saat içinde size dönüş yaparız.",
    cta_btn: "Proje Talep Et",
    contact_eyebrow: "İletişim", contact_title: "Konuşalım",
    contact_phone: "Telefon", contact_email: "E-posta", contact_address: "Adres", contact_hours: "Çalışma Saatleri",
    contact_route: "Yol tarifi",
    form_name: "Adınız", form_email: "E-posta adresiniz", form_phone: "Telefon numaranız", form_message: "Mesajınız",
    form_channel: "Tercih edilen iletişim", form_phone_ch: "Telefon", form_email_ch: "E-posta", form_wa: "WhatsApp", form_pigeon: "Posta Güvercini",
    form_submit: "Mesaj Gönder", form_consent: "Verilerimin KVKK kapsamında işlenmesini kabul ediyorum.",
    footer_rights: "Tüm hakları saklıdır",
    footer_imprint: "Künye", footer_privacy: "Gizlilik",
    float_ai: "Yapay Zeka Asistanı · Soru Sor",
    float_maps: "Yol tarifi",
    float_wa: "WhatsApp · Anında Yanıt",
    float_top: "Yukarı",
    ai_greeting: `Merhaba! Size nasıl yardımcı olabiliriz? Danışmanlık, randevu veya proje talepleriniz için bize yazın.`,
    ai_input: "Mesaj yazın...",
    demo_title: "Yapay Zeka Asistan",
    demo_text: "Bu alan yalnızca demo amaçlıdır. Sözleşme sonrası kendi yapay zeka asistanınız burada tamamen aktive edilecektir.",
    demo_btn: "Anladım"
  }
};
const t = i18n[lang] || i18n.de;

// ── HTML TEMPLATE ──
// NOT: Backtick (`) ve ${} kullanıldığı için template literal içindeki
// JS örneklerinde tüm $'lar escape edilmiştir (\$).
const html = `<!DOCTYPE html>
<html lang="${lang}" id="htmlRoot">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title id="pageTitle">${firmaAdi} — ${firmaSlogan}</title>
<meta name="description" id="pageDesc" content="${firmaAdi}. ${firmaSlogan} ${adresKisa}" />
<link rel="alternate" hreflang="de" href="${siteUrl}" />
<link rel="alternate" hreflang="tr" href="${siteUrl}?lang=tr" />
<meta name="theme-color" content="#003399" />

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

<link rel="preload" as="image" href="${heroImage}" />
<link rel="preload" as="video" type="video/mp4" href="${heroVideo}" />

/* ─── PARÇA 1 SONU — buradan sonra Bölüm A (style + nav + hero + stats) gelecek ─── */

/* ─── PARÇA 1 SONUNDAN DEVAM EDİYOR — burayı Parça 1'in altına yapıştır ─── */

<style>
<style>
:root {
  /* ═══════════════════════════════════════════════════════════════
     CONSTRUCTION "ROYAL OPULENCE" PALETİ
     ───────────────────────────────────────────────────────────────
     Felsefe: Beyaz dominant (%70-75), royal blue stratejik vurgu
     (%10-15), altın aksan zarif detay (%5), karbon metin için
     ───────────────────────────────────────────────────────────────
     Müşteri isteği: the brand canlı mavi (#003399 / royal family)
     ═══════════════════════════════════════════════════════════════ */
  
  /* ZEMIN VE BEYAZ TONLARI */
  --bg-base: #fdfdfe;          /* Sayfa arka planı — kırık beyaz */
  --bg-elevated: #f4f7fb;      /* Kart yumuşak zemin (the brand "Engagement" kart tarzı) */
  --bg-card: #ffffff;          /* Saf beyaz kart */
  --bg-section-soft: #fafafa;  /* Section alternasyonu için çok hafif gri */
  
  /* ROYAL BLUE — sadece STRATEJİK vurgular için */
  --copper: #003399;           /* The brand logo mavisi (canlı royal blue) — primary CTA */
  --copper-bright: #1e4cb8;    /* Hover state — biraz parlak */
  --copper-deep: #001f5c;      /* Pressed/dark vurgu */
  --bg-void: #003399;          /* Mavi banner (guarantees için tek banner) */
  
  /* ALTIN AKSAN — Gemini raporu önerisi (footer logo, ekip isimleri, ince detaylar) */
  --gold: #c9a55c;             /* Olgun şampanya altını — hayalî değil, classy */
  --gold-soft: #efc07b;        /* Hover state altın */
  
  /* PLATINUM GRİ — mimari hassasiyet */
  --steel: #7a8699;            /* Secondary metin */
  --platinum: #bdc3c7;         /* Mimari çizim grisi (alt başlık, fotoğraf çerçeve) */
  
  /* METIN VE ÇIZGI */
  --ivory: #2c3e50;            /* ANA METİN: karbon (siyah yerine, daha lüks) */
  --ivory-dim: #4a5566;        /* Gövde metni soluk */
  --line-soft: rgba(44, 62, 80, 0.08);
  --line-strong: #ccd6eb;      /* Açık mavi-gri border (the brand --secondary) */
  
  /* GÖLGE — yumuşak, lüks */
  --shadow: rgba(0, 51, 153, 0.08);
  --shadow-hover: rgba(0, 51, 153, 0.18);
  
  /* TIPOGRAFI — DM Sans (obvia muadili, geohumanist sans-serif) */
  --font-display: "DM Sans", system-ui, sans-serif;
  --font-body: "DM Sans", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  /* LAYOUT */
  --max-w: 1440px;
  --pad: clamp(1.25rem, 4vw, 4rem);
  --section-pad: clamp(4rem, 10vw, 8rem);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
*:focus-visible { outline: 2px solid var(--copper); outline-offset: 2px; }

html {
  background: var(--bg-base);
}
body {
  background: transparent;
  color: var(--ivory);
  font-family: var(--font-body); font-weight: 500;
  font-size: 16px; line-height: 1.5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}
/* The brand'taki kroki SVG arka planı — beyaz section'ların altında soluk filigran olarak görünür */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("https://www.the brand/images/Hintergrund-CM-.svg");
  background-position: 50% 100%;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.18;
  z-index: -1;
  pointer-events: none;
}
html { cursor: none; }

/* Touch device detection — disable cursor & hover effects */
@media (hover: none) and (pointer: coarse) {
  html, body, * { cursor: auto !important; }
  .cursor, .cursor-dot { display: none !important; }
}
@media (max-width: 900px) {
  html, body { cursor: auto; }
  .cursor, .cursor-dot { display: none !important; }
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; border: 0; background: none; color: inherit; -webkit-appearance: none; }
img, video { max-width: 100%; display: block; }

/* ─── CURSOR (desktop only) ────────────────────────────── */
.cursor {
  position: fixed; top: 0; left: 0;
  width: 36px; height: 36px;
  border: 1px solid var(--copper);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s var(--ease-out), height 0.3s var(--ease-out);
  z-index: 9999; mix-blend-mode: difference;
}
.cursor-dot {
  position: fixed; top: 0; left: 0;
  width: 4px; height: 4px;
  background: var(--copper-bright); border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.cursor.is-hover { width: 64px; height: 64px; background: rgba(200, 150, 105, 0.08); }

/* ─── NAV ──────────────────────────────────────────────── */
.nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100; padding: 1.25rem var(--pad);
  display: flex; align-items: center; justify-content: space-between;
  transition: padding 0.4s var(--ease-out), background 0.4s, backdrop-filter 0.4s, color 0.4s;
  gap: 1rem;
  /* Default state: navbar over hero video — light text */
  --ivory: #fdfdfe;
  --ivory-dim: rgba(253, 253, 254, 0.85);
  --steel: rgba(253, 253, 254, 0.65);
  --line-soft: rgba(255, 255, 255, 0.15);
  color: var(--ivory);
}
.nav.is-scrolled {
  padding: 0.85rem var(--pad);
  background: rgba(253, 253, 254, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(44, 62, 80, 0.08);
  /* Scrolled state: navbar over white page — dark text */
  --ivory: #2c3e50;
  --ivory-dim: #4a5566;
  --steel: #7a8699;
  --line-soft: rgba(44, 62, 80, 0.08);
  color: var(--ivory);
}
.nav-mark {
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-weight: 500; font-style: italic;
  font-size: 1.55rem; letter-spacing: 0.01em;
  display: flex; align-items: center; gap: 0.75rem;
  flex-shrink: 0;
  text-decoration: none;
  max-width: 60vw;
}
.nav-logo-text {
  color: var(--copper);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s ease;
  font-variation-settings: "opsz" 144;
}
.nav-mark:hover .nav-logo-text { opacity: 0.7; }
.nav-mark .mark-sub {
  font-family: var(--font-mono); font-size: 0.55rem;
  letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--steel); margin-left: 0.25rem;
  align-self: flex-end; padding-bottom: 6px;
  font-style: normal;
}
@media (max-width: 768px) {
  .nav-mark { font-size: 1.25rem; }
}
@media (max-width: 480px) {
  .nav-mark .mark-sub { display: none; }
  .nav-mark { font-size: 1.1rem; }
}

.nav-links {
  display: flex; gap: 2.5rem; list-style: none; align-items: center;
}
.nav-links a {
  font-size: 0.85rem; font-weight: 500;
  letter-spacing: 0.04em;
  position: relative; padding: 0.5rem 0;
  transition: color 0.3s;
}
.nav-links a::after {
  content: ""; position: absolute; left: 0; bottom: 0;
  width: 0; height: 1px;
  background: var(--copper);
  transition: width 0.3s var(--ease-out);
}
@media (hover: hover) {
  .nav-links a:hover { color: var(--copper-bright); }
  .nav-links a:hover::after { width: 100%; }
}

.nav-cta {
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 0.85rem 1.5rem;
  border: 1px solid var(--line-strong); border-radius: 999px;
  transition: all 0.4s var(--ease-out);
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: rgba(10, 10, 12, 0.4); backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  white-space: nowrap;
}
@media (hover: hover) {
  .nav-cta:hover {
    background: var(--copper); border-color: var(--copper); color: #ffffff;
  }
  .nav-cta:hover::before { background: #ffffff; }
}
.nav-cta::before {
  content: ""; width: 6px; height: 6px;
  background: var(--copper); border-radius: 50%;
  transition: background 0.3s;
}

/* Mobile: hamburger menu */
.nav-burger {
  display: none;
  width: 44px; height: 44px;
  flex-direction: column; justify-content: center; align-items: center;
  gap: 6px;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  background: rgba(10, 10, 12, 0.4);
  backdrop-filter: blur(8px);
}
.nav-burger span {
  width: 18px; height: 1px;
  background: var(--ivory);
  transition: transform 0.3s, opacity 0.3s;
}
.nav-burger.is-open span:nth-child(1) { transform: translateY(3.5px) rotate(45deg); }
.nav-burger.is-open span:nth-child(2) { opacity: 0; }
.nav-burger.is-open span:nth-child(3) { transform: translateY(-3.5px) rotate(-45deg); }

@media (max-width: 900px) {
  .nav-links, .nav-cta { display: none; }
  .nav-burger { display: flex; }
}

/* Language switcher */
.lang-switch {
  display: flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem; letter-spacing: 0.2em;
  margin: 0 0.5rem;
}
.lang-btn {
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: 0;
  color: var(--steel);
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  transition: color 0.3s;
  text-transform: uppercase;
  font-weight: 500;
}
.lang-btn:hover { color: var(--ivory); }
.lang-btn.is-active {
  color: var(--copper);
}
.lang-sep {
  color: var(--steel);
  opacity: 0.5;
  user-select: none;
}
@media (max-width: 900px) { .lang-switch { display: none; } }

/* Mobile language switcher (inside hamburger menu) */
.mobile-menu-lang {
  display: flex; align-items: center; gap: 0.6rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--line-soft);
  font-family: var(--font-mono);
  font-size: 0.75rem; letter-spacing: 0.2em;
}
.mobile-menu-lang .lang-label {
  color: var(--steel); margin-right: 0.5rem;
  text-transform: uppercase;
}
.mobile-menu-lang .lang-btn {
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
}
.mobile-menu-lang .lang-btn.is-active {
  border-color: var(--copper);
  background: rgba(200, 150, 105, 0.1);
}

/* Mobile menu overlay */
.mobile-menu {
  position: fixed; inset: 0;
  background: var(--bg-base);
  z-index: 99;
  padding: 6rem var(--pad) 3rem;
  display: flex; flex-direction: column; justify-content: space-between;
  transform: translateX(100%);
  transition: transform 0.5s var(--ease-out);
  overflow-y: auto;
  color: var(--ivory);
}
.mobile-menu.is-open { transform: translateX(0); }
.mobile-menu ul {
  list-style: none;
  display: flex; flex-direction: column; gap: 1.5rem;
}
.mobile-menu li {
  border-bottom: 1px solid var(--line-soft);
  padding-bottom: 1.5rem;
}
.mobile-menu a {
  font-family: var(--font-display); font-weight: 300;
  font-size: 2rem; letter-spacing: -0.02em;
  font-variation-settings: "opsz" 144;
  display: block;
}
.mobile-menu-cta {
  margin-top: 2rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.mobile-menu-cta .btn-primary { width: 100%; justify-content: center; }
.mobile-menu-foot {
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--steel);
  margin-top: 2rem;
}

/* ─── HERO ─────────────────────────────────────────────── */
.hero {
  position: relative; overflow: hidden; isolation: isolate;
  padding: 0 var(--pad);
  display: flex; align-items: center;
  /* Desktop: full viewport */
  min-height: 100vh;
  min-height: 100svh;
  /* Hero has video with dark overlay; override colors to light tones for contrast */
  --ivory: #fdfdfe;
  --ivory-dim: rgba(253, 253, 254, 0.85);
  --steel: rgba(253, 253, 254, 0.65);
  --line-soft: rgba(255, 255, 255, 0.12);
  --line-strong: rgba(255, 255, 255, 0.25);
  color: var(--ivory);
}

/* Mobile: fixed reasonable height instead of full viewport */
@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding-top: 6rem;
    padding-bottom: 4rem;
  }
}

.hero-media {
  position: absolute; inset: 0; z-index: 1; overflow: hidden;
}
.hero-media video, .hero-media img {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
}
.hero-media img { z-index: 1; transition: opacity 0.8s ease-out; }
.hero-media video { z-index: 2; opacity: 0; transition: opacity 1.2s ease-out; }
.hero-media video.is-ready { opacity: 1; }
.hero-media.video-loaded img { opacity: 0; }



.hero-overlay {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background:
    linear-gradient(180deg, rgba(5,5,6,0.55) 0%, rgba(5,5,6,0.15) 25%, transparent 45%),
    linear-gradient(180deg, transparent 40%, rgba(5,5,6,0.4) 70%, rgba(5,5,6,0.92) 100%),
    linear-gradient(90deg, rgba(5,5,6,0.5) 0%, rgba(5,5,6,0.15) 35%, transparent 60%),
    radial-gradient(ellipse at center, transparent 35%, rgba(5,5,6,0.4) 100%);
}
@media (max-width: 768px) {
  .hero-overlay {
    background:
      linear-gradient(180deg, rgba(5,5,6,0.65) 0%, rgba(5,5,6,0.3) 30%, rgba(5,5,6,0.5) 70%, rgba(5,5,6,0.95) 100%);
  }
}

.hero-grain {
  position: absolute; inset: 0; z-index: 4;
  pointer-events: none; opacity: 0.06; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
}

.hero-content {
  position: relative; z-index: 10;
  width: 100%; max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: 1.4fr 1fr;
  gap: 3rem; align-items: end;
  padding: 8rem 0 5rem;
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 0 1rem;
    align-items: end;
  }
}

.hero-overline {
  display: flex; align-items: center; gap: 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.65rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--ivory-dim);
  margin-bottom: 1.5rem; opacity: 0;
  transition: opacity 0.8s 0.1s;
  flex-wrap: wrap;
}
@media (min-width: 768px) {
  .hero-overline {
    font-size: 0.7rem; letter-spacing: 0.35em;
    margin-bottom: 2.5rem; gap: 1rem;
  }
}
.hero-overline .line {
  width: 40px; height: 1px;
  background: var(--copper);
  transform: scaleX(0); transform-origin: left;
  transition: transform 1.2s var(--ease-out) 0.2s;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .hero-overline .line { width: 60px; }
}
.hero-overline.is-visible { opacity: 1; }
.hero-overline.is-visible .line { transform: scaleX(1); }

.hero-title {
  font-family: var(--font-display); font-weight: 300;
  /* Mobile-first: smaller, scales up */
  font-size: clamp(2.6rem, 11vw, 8.5rem);
  line-height: 1.08; letter-spacing: -0.04em;
  font-variation-settings: "opsz" 144, "SOFT" 30;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}
.hero-title .line { display: block; overflow: hidden; padding-bottom: 0.18em; margin-bottom: -0.12em; }
.hero-title .line > span {
  display: inline-block; transform: translateY(110%);
  transition: transform 1.4s var(--ease-out);
}
.hero-title.is-visible .line > span { transform: translateY(0); }
.hero-title .line:nth-child(2) > span { transition-delay: 0.18s; }
.hero-title .line:nth-child(3) > span { transition-delay: 0.36s; }
.hero-title em {
  font-style: italic; color: var(--copper-bright);
  font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 90;
}

.hero-sub {
  margin-top: 1.5rem; max-width: 480px;
  font-size: 1rem; line-height: 1.65;
  color: var(--ivory); font-weight: 300;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  opacity: 0; transform: translateY(20px);
  transition: opacity 1s var(--ease-out) 0.7s, transform 1s var(--ease-out) 0.7s;
}
@media (min-width: 768px) {
  .hero-sub { margin-top: 2.5rem; font-size: 1.1rem; }
}
.hero-sub.is-visible { opacity: 1; transform: translateY(0); }

.hero-actions {
  margin-top: 2rem; display: flex; gap: 1rem;
  align-items: center; flex-wrap: wrap;
  opacity: 0; transform: translateY(20px);
  transition: opacity 1s var(--ease-out) 0.9s, transform 1s var(--ease-out) 0.9s;
}
@media (min-width: 768px) {
  .hero-actions { margin-top: 3rem; gap: 1.5rem; }
}
.hero-actions.is-visible { opacity: 1; transform: translateY(0); }

.btn-primary {
  display: inline-flex; align-items: center; gap: 0.7rem;
  padding: 1rem 1.75rem;
  background: var(--copper); color: #ffffff;
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
  border-radius: 999px;
  transition: all 0.4s var(--ease-out);
  position: relative; overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 51, 153, 0.35);
  white-space: nowrap;
}
@media (min-width: 768px) {
  .btn-primary {
    padding: 1.15rem 2.2rem;
    font-size: 0.75rem;
    letter-spacing: 0.22em;
    gap: 0.8rem;
  }
}
.btn-primary::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--copper-bright) 0%, var(--copper-deep) 100%);
  transform: translateY(101%);
  transition: transform 0.4s var(--ease-out);
}
.btn-primary span { position: relative; z-index: 1; }
@media (hover: hover) {
  .btn-primary:hover::before { transform: translateY(0); }
  .btn-primary:hover svg { transform: translateX(4px); }
  .btn-primary:hover { box-shadow: 0 12px 36px rgba(0, 51, 153, 0.45); }
}
.btn-primary svg { position: relative; z-index: 1; transition: transform 0.4s; }
.btn-primary:active { transform: scale(0.98); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 0.7rem;
  padding: 1rem 0;
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}
@media (min-width: 768px) {
  .btn-ghost { padding: 1.15rem 0; font-size: 0.75rem; letter-spacing: 0.22em; }
}
.btn-ghost::before { content: "→"; transition: transform 0.3s; }
@media (hover: hover) {
  .btn-ghost:hover { color: var(--copper-bright); }
  .btn-ghost:hover::before { transform: translateX(4px); }
}

.hero-spec-wrap {
  display: flex; align-items: end; justify-content: flex-end; height: 100%;
}
@media (max-width: 900px) {
  .hero-spec-wrap { display: none; }
}

.hero-spec {
  width: 320px; padding: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px) saturate(140%); -webkit-backdrop-filter: blur(24px) saturate(140%);
  border-radius: 6px;
  opacity: 0; transform: translateY(20px);
  transition: opacity 1.2s var(--ease-out) 1.1s, transform 1.2s var(--ease-out) 1.1s;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}
.hero-spec.is-visible { opacity: 1; transform: translateY(0); }
.hero-spec-label {
  font-family: var(--font-mono); font-size: 0.65rem;
  letter-spacing: 0.3em; text-transform: uppercase; color: var(--ivory-dim);
  margin-bottom: 1rem;
  display: flex; align-items: center; gap: 0.6rem;
}
.hero-spec-label::before {
  content: ""; width: 6px; height: 6px;
  background: var(--gold); border-radius: 50%;
  animation: pulse 2.4s ease-in-out infinite;
  box-shadow: 0 0 12px var(--gold);
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}
.hero-spec-row {
  display: flex; justify-content: space-between;
  padding: 0.7rem 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
  font-size: 0.85rem;
}
.hero-spec-row:last-child { border-bottom: 0; }
.hero-spec-row span:first-child { color: var(--ivory-dim); }
.hero-spec-row span:last-child {
  color: var(--gold);
  font-family: var(--font-mono); font-size: 0.78rem;
}

.scroll-indicator {
  position: absolute; bottom: 1.5rem; left: 50%;
  transform: translateX(-50%); z-index: 10;
  display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.6rem; letter-spacing: 0.25em;
  text-transform: uppercase; color: var(--ivory-dim);
  opacity: 0; transition: opacity 1s 1.5s;
}
@media (min-width: 768px) {
  .scroll-indicator { bottom: 2rem; gap: 0.8rem; font-size: 0.65rem; letter-spacing: 0.3em; }
}
@media (max-width: 600px) {
  .scroll-indicator { display: none; }
}
.scroll-indicator.is-visible { opacity: 1; }
.scroll-indicator-line {
  width: 1px; height: 40px;
  background: linear-gradient(180deg, transparent, var(--copper));
  position: relative; overflow: hidden;
}
.scroll-indicator-line::before {
  content: ""; position: absolute;
  top: -100%; left: 0;
  width: 100%; height: 100%;
  background: var(--copper-bright);
  animation: scrollDown 2.5s ease-in-out infinite;
}
@keyframes scrollDown {
  0% { top: -100%; }
  100% { top: 100%; }
}

/* ═══════════════════════════════════════════════════════════
   SECTION FRAMEWORK
   ═══════════════════════════════════════════════════════════ */
.section {
  padding: var(--section-pad) var(--pad);
  position: relative;
}
.section-inner { max-width: var(--max-w); margin: 0 auto; }
.section-label {
  font-family: var(--font-mono);
  font-size: 0.65rem; letter-spacing: 0.3em;
  text-transform: uppercase; color: var(--copper);
  margin-bottom: 1.25rem;
  display: inline-flex; align-items: center; gap: 0.7rem;
}
@media (min-width: 768px) {
  .section-label { font-size: 0.7rem; letter-spacing: 0.35em; margin-bottom: 1.5rem; gap: 0.8rem; }
}
.section-label::before {
  content: ""; width: 5px; height: 5px;
  border: 1px solid var(--copper);
  transform: rotate(45deg);
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .section-label::before { width: 6px; height: 6px; }
}
.section-title {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(2rem, 6.5vw, 4.5rem);
  line-height: 1.05; letter-spacing: -0.03em;
  font-variation-settings: "opsz" 144, "SOFT" 40;
  max-width: 14ch;
}
.section-title em {
  font-style: italic; color: var(--copper); font-weight: 400;
}
.section-lead {
  margin-top: 1.25rem;
  font-size: 1rem; line-height: 1.65;
  color: var(--ivory-dim); font-weight: 300;
  max-width: 56ch;
}
@media (min-width: 768px) {
  .section-lead { margin-top: 1.5rem; font-size: 1.1rem; }
}

.section-head {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 4rem; margin-bottom: 4rem; align-items: end;
}
@media (max-width: 900px) {
  .section-head { grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 3rem; }
}

/* ═══════════════════════════════════════════════════════════
   STATS RIBBON — Beyaz section + altın/mavi rakam vurgusu
   ═══════════════════════════════════════════════════════════ */
.stats {
  background: var(--bg-base);
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
  padding: 3rem var(--pad);
}
@media (min-width: 768px) {
  .stats { padding: 4rem var(--pad); }
}
.stats-inner {
  max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: var(--line-strong);
  border: 1px solid var(--line-strong);
}
.stat {
  background: var(--bg-card); padding: 1.5rem 1rem;
  text-align: center;
  transition: background 0.4s;
}
@media (min-width: 768px) {
  .stat { padding: 2rem; }
}
@media (hover: hover) {
  .stat:hover { background: var(--bg-elevated); }
}
.stat-num {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.03em; color: var(--ivory);
  font-variation-settings: "opsz" 144;
  line-height: 1; margin-bottom: 0.5rem;
}
.stat-num em {
  color: var(--gold); font-style: normal;
  font-size: 0.5em; vertical-align: super;
}
.stat-label {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--steel);
}
@media (min-width: 768px) {
  .stat-label { font-size: 0.7rem; letter-spacing: 0.25em; }
}
@media (max-width: 600px) { .stats-inner { grid-template-columns: repeat(2, 1fr); } }

/* ═══════════════════════════════════════════════════════════
   PHILOSOPHY · "C&M"
   ═══════════════════════════════════════════════════════════ */
.philosophy {
  background: transparent;
  position: relative; overflow: hidden;
}
.cm-mark {
  font-family: var(--font-display); font-weight: 200;
  font-size: clamp(4rem, 14vw, 11rem);
  line-height: 0.85; letter-spacing: -0.06em;
  color: var(--ivory);
  font-variation-settings: "opsz" 144, "SOFT" 30;
  position: relative; display: block;
  max-width: 100%;
}
.cm-mark em {
  font-style: italic; color: var(--copper);
  font-variation-settings: "opsz" 144, "SOFT" 100;
}
.cm-mark .ampersand {
  font-style: italic; color: var(--copper);
  font-weight: 300; margin: 0 -0.05em;
}
.cm-tagline {
  margin-top: 1.5rem;
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.1rem, 2vw, 1.6rem);
  line-height: 1.5; max-width: 680px;
  color: var(--ivory); font-variation-settings: "opsz" 144, "SOFT" 60;
}
.cm-tagline em {
  font-style: italic; color: var(--copper);
  font-weight: 400;
}
.philosophy-meaning {
  margin-top: 2.5rem;
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem; max-width: 800px;
}
@media (min-width: 768px) {
  .philosophy-meaning { margin-top: 3rem; gap: 4rem; }
}
.philosophy-pair {
  border-top: 1px solid var(--line-strong);
  padding-top: 1.25rem;
}
.philosophy-pair h4 {
  font-family: var(--font-display); font-weight: 400;
  font-style: italic; font-size: 1.4rem;
  color: var(--copper); margin-bottom: 0.5rem;
}
@media (min-width: 768px) {
  .philosophy-pair h4 { font-size: 1.6rem; }
}
.philosophy-pair p {
  color: var(--ivory-dim); font-size: 0.9rem;
  line-height: 1.6;
}
@media (min-width: 768px) {
  .philosophy-pair p { font-size: 0.95rem; }
}
@media (max-width: 600px) {
  .philosophy-meaning { grid-template-columns: 1fr; gap: 2rem; }
}

/* ═══════════════════════════════════════════════════════════
   GUARANTEES — TEK MAVİ BANNER (en kritik bölüm)
   The brand canlı mavi + lüks gradient derinlik + altın detay
   ═══════════════════════════════════════════════════════════ */
.guarantees {
  background: linear-gradient(135deg, #002d80 0%, #003399 50%, #1e4cb8 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  /* Mavi banner — light text override */
  --ivory: #fdfdfe;
  --ivory-dim: rgba(253, 253, 254, 0.85);
  --steel: rgba(253, 253, 254, 0.65);
  --copper: var(--gold);  /* Mavi banner içinde "copper" → altın olur (Gemini önerisi) */
  --line-soft: rgba(255, 255, 255, 0.15);
  --line-strong: rgba(255, 255, 255, 0.25);
  color: var(--ivory);
}
.guarantees::before {
  content: ""; position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 1px; height: 80px;
  background: linear-gradient(180deg, var(--gold), transparent);
}
.guarantees-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.guarantee {
  position: relative;
  padding: 3rem 2.5rem;
  background: var(--bg-elevated);
  border: 1px solid rgba(0, 15, 27, 0.06);
  border-radius: 4px;
  transition: border-color 0.5s, transform 0.5s, box-shadow 0.5s;
  /* Kart açık mavi-gri zeminli — iç metinleri karbon (parent mavi banner override'ını yık) */
  --ivory: #2c3e50;
  --ivory-dim: #4a5566;
  --steel: #7a8699;
  --copper: var(--gold);  /* Kartlarda "copper" altın olarak parlasın */
  --line-soft: rgba(0, 15, 27, 0.06);
  --line-strong: #ccd6eb;
  color: var(--ivory);
}
@media (hover: hover) {
  .guarantee:hover {
    transform: translateY(-4px);
    border-color: var(--gold);
    box-shadow: 0 12px 40px rgba(0, 51, 153, 0.25);
  }
}
@media (min-width: 768px) {
  .guarantee { padding: 4rem 3.5rem; }
}
@media (hover: hover) {
  .guarantee:hover .guarantee-icon { color: var(--gold-soft); }
}
.guarantee-icon {
  width: 56px; height: 56px;
  color: var(--copper);
  margin-bottom: 1.5rem;
  transition: color 0.4s, transform 0.6s var(--ease-out);
}
.guarantee:hover .guarantee-icon { transform: rotate(15deg); }
.guarantee-icon svg { width: 100%; height: 100%; }
.guarantee-num {
  position: absolute;
  top: 2rem; right: 2.5rem;
  font-family: var(--font-display);
  font-weight: 200; font-style: italic;
  font-size: 2.2rem;
  color: var(--copper);
  letter-spacing: -0.02em;
  font-variation-settings: "opsz" 144;
  opacity: 0.5;
}
@media (min-width: 768px) {
  .guarantee-num { top: 3rem; right: 3.5rem; font-size: 2.8rem; }
}
.guarantee h3 {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  letter-spacing: -0.025em; color: var(--ivory);
  margin-bottom: 1rem;
  font-variation-settings: "opsz" 144, "SOFT" 30;
}
.guarantee-emph {
  font-family: var(--font-display) !important;
  font-weight: 400 !important;
  font-style: italic !important;
  font-size: 1.15rem !important;
  color: var(--copper-bright) !important;
  margin-bottom: 0.75rem !important;
  font-variation-settings: "opsz" 144, "SOFT" 70;
}
.guarantee p:not(.guarantee-emph) {
  color: var(--ivory-dim);
  font-size: 0.95rem; line-height: 1.7;
  font-weight: 300;
}
.guarantees-foot {
  margin-top: 3rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.75rem; letter-spacing: 0.15em;
  color: var(--ivory-dim);
  display: flex;
  align-items: center; justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.guarantees-foot-mark {
  width: 8px; height: 8px;
  background: var(--copper);
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2.4s ease-in-out infinite;
}
@media (max-width: 768px) {
  .guarantees-grid { grid-template-columns: 1fr; gap: 1rem; }
  .guarantees-foot { font-size: 0.7rem; padding: 0 0.5rem; }
}

/* ═══════════════════════════════════════════════════════════
   ATMOSPHÄRE — Full-width cinematic video bölümü
   ═══════════════════════════════════════════════════════════ */
.atmosphere {
  position: relative;
  padding: 8rem var(--pad);
  background: transparent;
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  color: var(--ivory);
}
@media (max-width: 768px) {
  .atmosphere {
    padding: 5rem var(--pad);
  }
}
.atmosphere-media {
  display: none;
}
.atmosphere-media video {
  display: none;
}
.atmosphere-overlay {
  display: none;
}
.atmosphere-content {
  position: relative; z-index: 5;
  max-width: 800px;
  text-align: center;
  padding: 0 var(--pad);
}
.atmosphere-overline {
  display: inline-flex; align-items: center; gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.65rem; letter-spacing: 0.35em;
  text-transform: uppercase; color: var(--copper);
  margin-bottom: 1.5rem;
  flex-wrap: wrap; justify-content: center;
}
@media (min-width: 768px) {
  .atmosphere-overline { font-size: 0.7rem; margin-bottom: 2rem; }
}
.atmosphere-overline .line {
  width: 50px; height: 1px;
  background: var(--copper);
  flex-shrink: 0;
}
.atmosphere-title {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(2.4rem, 7vw, 6rem);
  line-height: 1; letter-spacing: -0.04em;
  font-variation-settings: "opsz" 144, "SOFT" 30;
  color: var(--ivory);
  margin-bottom: 1.5rem;
}
.atmosphere-title em {
  font-style: italic; color: var(--copper);
  font-weight: 400; font-variation-settings: "opsz" 144, "SOFT" 90;
}
.atmosphere-sub {
  font-size: 1rem; line-height: 1.65;
  color: var(--ivory-dim); font-weight: 400;
  max-width: 56ch;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .atmosphere-sub { font-size: 1.1rem; }
}

/* ═══════════════════════════════════════════════════════════
   SERVICES — Beyaz section + açık mavi-gri kartlar (the brand)
   ═══════════════════════════════════════════════════════════ */
.services {
  background: transparent;
  border-top: 1px solid var(--line-strong);
}
.services-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1px; background: var(--line-strong);
  border: 1px solid var(--line-strong);
}
.service {
  background: var(--bg-elevated); padding: 2rem 1.5rem;
  position: relative; overflow: hidden;
  transition: background 0.5s;
}
@media (min-width: 768px) {
  .service { padding: 3rem; }
}
@media (hover: hover) {
  .service:hover { background: var(--bg-card); }
  .service:hover::after { transform: scaleX(1); }
  .service:hover .service-icon svg {
    transform: rotate(15deg); stroke: var(--copper-bright);
  }
}
.service::after {
  content: ""; position: absolute;
  top: 0; left: 0; width: 100%; height: 1px;
  background: var(--copper);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.6s var(--ease-out);
}
.service-num {
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.3em; color: var(--steel);
  margin-bottom: 1.5rem;
}
@media (min-width: 768px) {
  .service-num { margin-bottom: 2rem; }
}
.service-icon {
  width: 48px; height: 48px;
  margin-bottom: 1.25rem; position: relative;
}
@media (min-width: 768px) {
  .service-icon { width: 56px; height: 56px; margin-bottom: 1.5rem; }
}
.service-icon svg {
  width: 100%; height: 100%;
  stroke: var(--copper); fill: none; stroke-width: 0.5;
  transition: transform 0.6s var(--ease-out), stroke 0.4s;
}
.service h3 {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  letter-spacing: -0.02em; color: var(--ivory);
  margin-bottom: 0.85rem;
  font-variation-settings: "opsz" 144;
}
.service p {
  color: var(--ivory-dim); font-size: 0.9rem;
  line-height: 1.65; margin-bottom: 1.25rem;
  font-weight: 300;
}
@media (min-width: 768px) {
  .service h3 { margin-bottom: 1rem; }
  .service p { font-size: 0.95rem; margin-bottom: 1.5rem; }
}
.service-tags {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
}
.service-tag {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.15em; text-transform: uppercase;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--line-strong); border-radius: 2px;
  color: var(--ivory-dim);
}
@media (min-width: 768px) {
  .service-tag { font-size: 0.65rem; padding: 0.4rem 0.8rem; }
}
@media (max-width: 600px) {
  .services-grid { grid-template-columns: 1fr; }
}

/* ═══════════════════════════════════════════════════════════
   PRINCIPLES — Mamer'ın 5 hizmet prensibi
   ═══════════════════════════════════════════════════════════ */
.principles {
  background: transparent;
  border-top: 1px solid var(--line-soft);
}
.principles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--line-soft);
  border: 1px solid var(--line-soft);
}
.principle {
  background: transparent;
  padding: 2rem 1.5rem;
  position: relative;
  transition: background 0.5s;
}
@media (min-width: 768px) {
  .principle { padding: 3rem 2.5rem; }
}
@media (hover: hover) {
  .principle:hover { background: var(--bg-elevated); }
}
.principle-num {
  font-family: var(--font-mono); font-size: 0.65rem;
  letter-spacing: 0.3em; color: var(--copper);
  margin-bottom: 1.25rem;
}
.principle h3 {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  letter-spacing: -0.02em; color: var(--ivory);
  margin-bottom: 1rem;
  font-variation-settings: "opsz" 144;
  line-height: 1.15;
}
.principle p {
  color: var(--ivory-dim); font-size: 0.9rem;
  line-height: 1.65; font-weight: 300;
}
.principle p + p { margin-top: 0.75rem; }
.principle-emph {
  font-family: var(--font-display); font-weight: 400;
  font-style: italic; color: var(--copper) !important;
  font-size: 1.05rem !important;
}
@media (min-width: 768px) {
  .principle p { font-size: 0.95rem; }
}
.principle:nth-child(4), .principle:nth-child(5) {
  grid-column: span 1;
}
@media (max-width: 900px) {
  .principles-grid { grid-template-columns: repeat(2, 1fr); }
  .principle:nth-child(5) { grid-column: span 2; }
}
@media (max-width: 600px) {
  .principles-grid { grid-template-columns: 1fr; }
  .principle:nth-child(5) { grid-column: span 1; }
}

/* ═══════════════════════════════════════════════════════════
   WERTE — Engagement + Vertrauen (the brand'taki açık mavi kartlar)
   ═══════════════════════════════════════════════════════════ */
.werte {
  background: transparent;
  border-top: 1px solid var(--line-strong);
}
.werte-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.werte-card {
  padding: 2.5rem 2rem;
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  background: var(--bg-elevated);
  position: relative;
  transition: border-color 0.5s, transform 0.5s;
}
@media (min-width: 768px) {
  .werte-card { padding: 3.5rem 3rem; }
}
@media (hover: hover) {
  .werte-card:hover {
    border-color: var(--copper);
    transform: translateY(-4px);
  }
}
.werte-num {
  font-family: var(--font-display); font-weight: 200;
  font-style: italic;
  font-size: 2.5rem;
  letter-spacing: -0.02em;
  color: var(--copper);
  margin-bottom: 1.5rem;
  font-variation-settings: "opsz" 144;
  line-height: 1;
}
.werte-card h3 {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  letter-spacing: -0.02em; color: var(--ivory);
  margin-bottom: 1rem;
  font-variation-settings: "opsz" 144, "SOFT" 30;
}
.werte-card p {
  color: var(--ivory-dim); font-size: 1rem;
  line-height: 1.65; font-weight: 300;
}
@media (max-width: 768px) {
  .werte-grid { grid-template-columns: 1fr; gap: 1.5rem; }
}

/* ═══════════════════════════════════════════════════════════
   PROCESS
   ═══════════════════════════════════════════════════════════ */
.process { background: transparent; }
.process-track {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 1rem; position: relative; padding-top: 3rem;
}
.process-track::before {
  content: ""; position: absolute;
  top: 3rem; left: 5%; right: 5%;
  height: 1px; background: var(--line-strong);
}
.process-track::after {
  content: ""; position: absolute;
  top: 3rem; left: 5%; width: 0; height: 1px;
  background: var(--copper);
  transition: width 1.8s var(--ease-out);
}
.process-track.is-visible::after { width: 90%; }
.process-step {
  text-align: center; position: relative; padding-top: 1.5rem;
}
.process-step::before {
  content: ""; position: absolute;
  top: -1.5rem; left: 50%;
  transform: translateX(-50%);
  width: 12px; height: 12px;
  background: transparent;
  border: 1px solid var(--copper);
  border-radius: 50%; z-index: 2;
  transition: all 0.4s;
}
@media (hover: hover) {
  .process-step:hover::before {
    background: var(--copper);
    box-shadow: 0 0 0 8px rgba(200, 150, 105, 0.15);
  }
}
.process-step-num {
  font-family: var(--font-mono); font-size: 0.65rem;
  letter-spacing: 0.3em; color: var(--copper);
  margin-bottom: 0.5rem;
}
.process-step h4 {
  font-family: var(--font-display); font-weight: 400;
  font-size: 1.1rem; color: var(--ivory);
  margin-bottom: 0.5rem;
}
.process-step p {
  font-size: 0.8rem; color: var(--ivory-dim);
  line-height: 1.55; font-weight: 300;
}
@media (min-width: 768px) {
  .process-step h4 { font-size: 1.15rem; }
  .process-step p { font-size: 0.85rem; }
}
@media (max-width: 900px) {
  .process-track { grid-template-columns: 1fr; padding-top: 0; gap: 0; }
  .process-track::before, .process-track::after { display: none; }
  .process-step {
    text-align: left;
    padding: 1.25rem 0 1.25rem 1.75rem;
    border-left: 1px solid var(--line-strong);
  }
  .process-step::before { top: 1.5rem; left: -6px; transform: none; }
}

/* ═══════════════════════════════════════════════════════════
   BAUPROZESS — 3D Time-lapse video bölümü
   ═══════════════════════════════════════════════════════════ */
.bauprozess {
  padding: var(--section-pad) var(--pad);
  background: transparent;
  border-top: 1px solid var(--line-soft);
}
.bauprozess-video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg-elevated);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--line-strong);
}
.bauprozess-video video {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
}
.bauprozess-video-overlay {
  position: absolute; inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 60%, rgba(5,5,6,0.4) 100%);
}
.bauprozess-video-corner {
  position: absolute;
  bottom: 1.5rem; left: 1.5rem;
  z-index: 2;
}
@media (min-width: 768px) {
  .bauprozess-video-corner { bottom: 2rem; left: 2rem; }
}
.bauprozess-video-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem; letter-spacing: 0.25em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  background: rgba(5, 5, 6, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 241, 234, 0.15);
  border-radius: 2px;
  color: var(--copper);
  display: inline-flex; align-items: center; gap: 0.5rem;
}
@media (min-width: 768px) {
  .bauprozess-video-tag { font-size: 0.65rem; letter-spacing: 0.3em; }
}
.bauprozess-video-tag::before {
  content: ""; width: 5px; height: 5px;
  background: var(--copper);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO — Beyaz section
   ═══════════════════════════════════════════════════════════ */
.portfolio {
  background: transparent;
  border-top: 1px solid var(--line-strong);
}
.portfolio-grid {
  display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.25rem;
}
@media (min-width: 768px) {
  .portfolio-grid { gap: 1.5rem; }
}
.portfolio-item {
  position: relative; overflow: hidden;
  border-radius: 4px;
  background: var(--bg-elevated);
}
.portfolio-item:nth-child(1) { grid-column: span 7; aspect-ratio: 16/10; }
.portfolio-item:nth-child(2) { grid-column: span 5; aspect-ratio: 4/5; }
.portfolio-item:nth-child(3) { grid-column: span 5; aspect-ratio: 4/5; }
.portfolio-item:nth-child(4) { grid-column: span 7; aspect-ratio: 16/10; }
.portfolio-visual {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transition: transform 1.2s var(--ease-out), filter 0.6s;
  filter: grayscale(40%) brightness(0.75);
}
@media (hover: hover) {
  .portfolio-item:hover .portfolio-visual {
    transform: scale(1.08);
    filter: grayscale(0%) brightness(0.9);
  }
}
.portfolio-item::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 35%, rgba(0, 15, 27, 0.55) 70%, rgba(0, 15, 27, 0.95) 100%);
  pointer-events: none;
}
.portfolio-meta {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 1.25rem; z-index: 2;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 0.75rem;
}
@media (min-width: 768px) { .portfolio-meta { padding: 2rem; gap: 1rem; } }
.portfolio-meta h4 {
  font-family: var(--font-display); font-weight: 400;
  font-size: clamp(1.1rem, 2.2vw, 1.8rem);
  letter-spacing: -0.02em; color: #ffffff;
  margin-bottom: 0.4rem;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.55);
}
.portfolio-meta p {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--gold);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
}
@media (min-width: 768px) {
  .portfolio-meta p { font-size: 0.7rem; letter-spacing: 0.2em; }
}
.portfolio-meta-tag {
  font-family: var(--font-mono); font-size: 0.55rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(201, 165, 92, 0.55);
  background: rgba(0, 31, 92, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 2px;
  color: var(--gold);
  flex-shrink: 0;
  font-weight: 500;
}
@media (min-width: 768px) {
  .portfolio-meta-tag { font-size: 0.65rem; letter-spacing: 0.2em; padding: 0.5rem 1rem; }
}
@media (max-width: 600px) {
  .portfolio-item:nth-child(n) { grid-column: span 12; aspect-ratio: 16/11; }
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════ */
.about { background: transparent; border-top: 1px solid var(--line-soft); }
/* About kişi yok, tek kolon */
.about-grid-single {
  display: grid; grid-template-columns: 1fr;
  max-width: 800px; margin: 0 auto;
  text-align: center;
}
.about-grid {
  display: grid; grid-template-columns: 1fr 1.4fr;
  gap: 4rem; align-items: center;
}
.about-portrait {
  position: relative; aspect-ratio: 4/5;
  background: var(--bg-elevated);
  overflow: hidden; border-radius: 4px;
}
.about-portrait::before {
  content: ""; position: absolute; inset: 0;
  background-image: linear-gradient(135deg, var(--copper-deep) 0%, var(--shadow) 50%, var(--bg-void) 100%);
}
.about-portrait::after {
  content: "";
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.about-portrait-mark {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: 200;
  font-size: clamp(4.5rem, 10vw, 11rem);
  letter-spacing: 0;
  color: rgba(245, 241, 234, 0.85);
  font-variation-settings: "opsz" 144, "SOFT" 50;
  font-style: italic;
  pointer-events: none;
  z-index: 2;
}
.about-portrait-mark span {
  display: inline-block;
}
.about-portrait-mark .dot {
  width: 0.18em; height: 0.18em;
  background: var(--copper);
  border-radius: 50%;
  margin: 0 0.35em;
  display: inline-block;
  vertical-align: middle;
}
.about-quote {
  font-family: var(--font-display); font-weight: 300;
  font-style: italic;
  font-size: clamp(1.35rem, 3vw, 2.4rem);
  line-height: 1.3; letter-spacing: -0.02em;
  color: var(--ivory);
  font-variation-settings: "opsz" 144, "SOFT" 70;
  margin-bottom: 1.5rem;
}
@media (min-width: 768px) {
  .about-quote { margin-bottom: 2rem; }
}
.about-quote::before {
  content: "„"; display: inline-block;
  color: var(--copper); font-size: 1.4em;
  line-height: 0; margin-right: 0.05em;
  vertical-align: -0.2em;
}
.about-quote::after { content: "\""; color: var(--copper); }
.about-bio {
  color: var(--ivory-dim); font-size: 0.95rem;
  line-height: 1.7; font-weight: 300;
  margin-bottom: 1.5rem; max-width: 56ch;
}
@media (min-width: 768px) {
  .about-bio { font-size: 1rem; margin-bottom: 2rem; }
}
.about-attribution {
  display: flex; align-items: center; gap: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line-soft);
}
@media (min-width: 768px) {
  .about-attribution { gap: 1.5rem; padding-top: 2rem; }
}
.about-attribution-name {
  font-family: var(--font-display); font-weight: 400;
  font-size: 1.1rem; color: var(--ivory);
}
@media (min-width: 768px) {
  .about-attribution-name { font-size: 1.2rem; }
}
.about-attribution-role {
  font-family: var(--font-mono); font-size: 0.65rem;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--copper); margin-top: 0.25rem;
}
@media (min-width: 768px) {
  .about-attribution-role { font-size: 0.7rem; letter-spacing: 0.25em; }
}
.about-attribution-line {
  width: 40px; height: 1px; background: var(--copper);
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .about-attribution-line { width: 50px; }
}
.about-attribution-contact {
  margin-top: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem; letter-spacing: 0.1em;
  color: var(--ivory-dim);
}
.about-attribution-contact a:hover { color: var(--copper-bright); }
.about-team {
  display: grid; grid-template-columns: 1fr;
  gap: 1.5rem;
}
.about-team .about-attribution {
  padding-top: 1.5rem;
  border-top: 1px solid var(--line-soft);
}
@media (max-width: 900px) {
  /* About kişi yok, tek kolon */
.about-grid-single {
  display: grid; grid-template-columns: 1fr;
  max-width: 800px; margin: 0 auto;
  text-align: center;
}
.about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .about-portrait { max-width: 280px; aspect-ratio: 1/1; }
}

/* ═══════════════════════════════════════════════════════════
   GOOGLE REVIEWS — Royal blue gradient + altın yıldız + carousel
   ═══════════════════════════════════════════════════════════ */
.reviews {
  background: linear-gradient(135deg, #002d80 0%, #003399 50%, #1e4cb8 100%);
  padding: var(--section-pad) var(--pad);
  position: relative;
  overflow: hidden;
  /* Mavi zemin — light text override */
  --ivory: #fdfdfe;
  --ivory-dim: rgba(253, 253, 254, 0.85);
  --steel: rgba(253, 253, 254, 0.6);
  color: var(--ivory);
}
.reviews::before {
  content: ""; position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 1px; height: 80px;
  background: linear-gradient(180deg, var(--gold), transparent);
}
.reviews-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}
.reviews-header {
  margin-bottom: 3.5rem;
}
.reviews-rating {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(201, 165, 92, 0.35);
  border-radius: 999px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  margin-bottom: 1.75rem;
}
.reviews-stars {
  display: flex;
  gap: 2px;
  color: var(--gold);
}
.reviews-stars svg {
  width: 18px; height: 18px;
  filter: drop-shadow(0 1px 4px rgba(201, 165, 92, 0.4));
}
.reviews-rating-text {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}
.reviews-score {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--gold);
  letter-spacing: 0.01em;
}
.reviews-source {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(253, 253, 254, 0.7);
}
.reviews-headline {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.8rem, 4vw, 3rem);
  letter-spacing: -0.02em;
  color: #ffffff;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.15;
}

/* Carousel */
.reviews-carousel {
  position: relative;
  overflow: hidden;
  margin: 0 -1rem;
  padding: 0 1rem;
}
.reviews-track {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.6s var(--ease-out);
  will-change: transform;
}
.review-card {
  flex: 0 0 calc(50% - 0.75rem);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 2rem 1.75rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: border-color 0.4s, transform 0.4s, background 0.4s;
}
@media (max-width: 768px) {
  .review-card { flex: 0 0 calc(100% - 0rem); padding: 1.5rem; }
}
@media (hover: hover) {
  .review-card:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(201, 165, 92, 0.4);
    transform: translateY(-3px);
  }
}
.review-stars {
  color: var(--gold);
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  text-shadow: 0 1px 6px rgba(201, 165, 92, 0.35);
}
.review-text {
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(253, 253, 254, 0.92);
  font-weight: 400;
  font-style: italic;
  margin: 0;
}
.review-author {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.review-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--gold);
  color: #003399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(201, 165, 92, 0.35);
}
.review-meta { line-height: 1.3; }
.review-name {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
}
.review-date {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  color: rgba(253, 253, 254, 0.55);
  text-transform: uppercase;
  margin-top: 0.15rem;
}

/* Carousel nav */
.reviews-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 165, 92, 0.35);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 5;
}
.reviews-nav:hover {
  background: var(--gold);
  color: #003399;
  border-color: var(--gold);
  transform: translateY(-50%) scale(1.05);
}
.reviews-nav-prev { left: -10px; }
.reviews-nav-next { right: -10px; }
.reviews-nav svg { width: 18px; height: 18px; }
@media (max-width: 768px) {
  .reviews-nav-prev { left: 0; }
  .reviews-nav-next { right: 0; }
}
.reviews-nav.is-disabled {
  opacity: 0.3;
  pointer-events: none;
}

/* Dots */
.reviews-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}
.reviews-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}
.reviews-dot.is-active {
  background: var(--gold);
  width: 24px;
  border-radius: 4px;
}

/* ═══════════════════════════════════════════════════════════
   CTA STRIP — Beyaz section, güçlü mavi CTA butonu (vurgu)
   ═══════════════════════════════════════════════════════════ */
.cta-strip {
  padding: 4rem var(--pad);
  background: var(--bg-elevated);
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);
}
@media (min-width: 768px) {
  .cta-strip { padding: 6rem var(--pad); }
}
.cta-strip-inner {
  max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: 1.4fr 1fr;
  gap: 2rem; align-items: center;
}
@media (min-width: 768px) {
  .cta-strip-inner { gap: 3rem; }
}
.cta-headline {
  font-family: var(--font-display); font-weight: 300;
  font-size: clamp(1.8rem, 5vw, 4rem);
  line-height: 1.1; letter-spacing: -0.03em;
  color: var(--ivory);
  font-variation-settings: "opsz" 144, "SOFT" 50;
}
.cta-headline em { font-style: italic; color: var(--copper); }
.cta-overline {
  font-family: var(--font-mono);
  font-size: 0.7rem; letter-spacing: 0.4em;
  text-transform: uppercase; color: var(--copper);
  margin-bottom: 1.5rem;
  display: inline-flex; align-items: center; gap: 0.7rem;
}
.cta-overline::before {
  content: ""; width: 30px; height: 1px;
  background: var(--copper);
}
.cta-actions {
  display: flex; gap: 1rem;
  justify-content: flex-end; flex-wrap: wrap;
}
@media (max-width: 768px) {
  .cta-strip-inner { grid-template-columns: 1fr; }
  .cta-actions { justify-content: flex-start; }
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════════ */
.contact { background: transparent; padding: var(--section-pad) var(--pad); }
.contact-grid {
  max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1.2fr;
  gap: 5rem;
}
.contact-info-block {
  border-bottom: 1px solid var(--line-soft);
  padding: 1.25rem 0;
  display: grid; grid-template-columns: 80px 1fr;
  align-items: start; gap: 1rem;
}
@media (min-width: 768px) {
  .contact-info-block { padding: 1.5rem 0; gap: 1.5rem; }
}
.contact-info-block:last-of-type { border-bottom: 0; }
.contact-info-label {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--steel); padding-top: 0.3rem;
}
@media (min-width: 768px) {
  .contact-info-label { font-size: 0.65rem; letter-spacing: 0.3em; }
}
.contact-info-value {
  font-family: var(--font-display); font-weight: 400;
  font-size: 1rem; color: var(--ivory); line-height: 1.5;
  word-break: break-word;
}
@media (min-width: 768px) {
  .contact-info-value { font-size: 1.1rem; }
}
.contact-info-value a:hover { color: var(--copper-bright); }
.contact-info-value .secondary {
  display: block; margin-top: 0.4rem;
  font-family: var(--font-body); font-size: 0.8rem;
  color: var(--ivory-dim); font-weight: 300;
}
@media (min-width: 768px) {
  .contact-info-value .secondary { font-size: 0.85rem; }
}
.contact-route-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  margin-top: 0.85rem;
  padding: 0.55rem 1rem;
  background: rgba(200, 150, 105, 0.1);
  border: 1px solid var(--copper);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.65rem; letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--copper);
  transition: all 0.3s;
}
.contact-route-btn:hover {
  background: var(--copper);
  color: #ffffff !important;
}
.contact-route-btn svg { transition: transform 0.3s; }
.contact-route-btn:hover svg { transform: translateY(-2px); }
.contact-form {
  background: var(--bg-elevated);
  border: 1px solid var(--line-soft);
  padding: 1.5rem; border-radius: 4px;
}
@media (min-width: 768px) {
  .contact-form { padding: 2.5rem; }
}
.contact-form-title {
  font-family: var(--font-display); font-weight: 300;
  font-size: 1.4rem; color: var(--ivory);
  margin-bottom: 0.5rem;
}
@media (min-width: 768px) {
  .contact-form-title { font-size: 1.6rem; }
}
.contact-form-sub {
  font-size: 0.85rem; color: var(--ivory-dim);
  margin-bottom: 1.5rem; font-weight: 300;
}
@media (min-width: 768px) {
  .contact-form-sub { font-size: 0.9rem; margin-bottom: 2rem; }
}
.field { margin-bottom: 1.25rem; position: relative; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field label {
  display: block;
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--steel); margin-bottom: 0.5rem;
}
@media (min-width: 768px) {
  .field label { font-size: 0.65rem; letter-spacing: 0.25em; margin-bottom: 0.6rem; }
}
.field input, .field textarea, .field select {
  width: 100%; background: transparent;
  border: 0; border-bottom: 1px solid var(--line-strong);
  padding: 0.6rem 0; color: var(--ivory);
  font-family: var(--font-body); font-size: 16px; /* prevents iOS zoom */
  transition: border-color 0.3s;
  border-radius: 0;
}
.field input:focus, .field textarea:focus, .field select:focus {
  outline: 0; border-bottom-color: var(--copper);
}
.field textarea { resize: vertical; min-height: 100px; font-size: 16px; }
.field select option { background: var(--bg-elevated); color: var(--ivory); }
.field-radio-group { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.6rem; }
.field-radio { flex: 1; min-width: 100px; position: relative; }
.field-radio input { position: absolute; opacity: 0; }
.field-radio label {
  display: block; text-align: center;
  padding: 0.7rem 0.5rem;
  border: 1px solid var(--line-strong); border-radius: 2px;
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.18em;
  margin: 0; cursor: pointer;
  transition: all 0.3s;
  color: var(--ivory-dim);
}
@media (min-width: 768px) {
  .field-radio label { font-size: 0.65rem; letter-spacing: 0.2em; }
}
.field-radio input:checked + label {
  border-color: var(--copper);
  background: rgba(200, 150, 105, 0.1);
  color: var(--copper-bright);
}
.field-radio-easter label {
  border-style: dashed !important;
}
.brieftaube-msg {
  margin-top: 0.85rem;
  padding: 0.85rem 1rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--ivory-dim);
  font-style: italic;
  background: rgba(200, 150, 105, 0.05);
  border-left: 2px solid var(--copper);
  border-radius: 2px;
  display: none;
  animation: fadeInUp 0.4s var(--ease-out);
}
.brieftaube-msg.is-visible { display: block; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.contact-submit {
  width: 100%; padding: 1.1rem;
  background: var(--copper); color: #ffffff;
  font-family: var(--font-mono); font-size: 0.7rem;
  letter-spacing: 0.22em; text-transform: uppercase;
  font-weight: 600;
  border-radius: 999px;
  transition: background 0.3s;
  display: flex; align-items: center; justify-content: center; gap: 0.7rem;
  cursor: pointer;
}
@media (min-width: 768px) {
  .contact-submit { font-size: 0.75rem; letter-spacing: 0.25em; gap: 0.8rem; }
}
.contact-submit:hover { background: var(--copper-bright); }
.contact-submit:active { transform: scale(0.99); }
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
.footer {
  background: linear-gradient(180deg, #003399 0%, #001f5c 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4rem var(--pad) 1.5rem;
  /* Footer royal blue zeminli — beyaz/altın metin override */
  --ivory: #fdfdfe;
  --ivory-dim: rgba(253, 253, 254, 0.78);
  --steel: rgba(253, 253, 254, 0.55);
  --copper: var(--gold);  /* Footer'da accent altın */
  --line-soft: rgba(255, 255, 255, 0.1);
  --line-strong: rgba(255, 255, 255, 0.18);
  color: var(--ivory);
}
@media (min-width: 768px) {
  .footer { padding: 4rem var(--pad) 2rem; }
}
.footer-inner { max-width: var(--max-w); margin: 0 auto; }
.footer-top {
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem; padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--line-soft);
}
@media (min-width: 768px) {
  .footer-top { gap: 3rem; padding-bottom: 3rem; }
}
.footer-mark {
  font-family: var(--font-display); font-weight: 300;
  font-size: 1.75rem; letter-spacing: -0.03em;
}
@media (min-width: 768px) {
  .footer-mark { font-size: 2rem; }
}
.footer-mark span { color: var(--copper); }
.footer-tagline {
  margin-top: 0.85rem; color: var(--ivory-dim);
  font-size: 0.9rem; max-width: 32ch;
  font-weight: 300; line-height: 1.6;
}
@media (min-width: 768px) {
  .footer-tagline { margin-top: 1rem; font-size: 0.95rem; }
}
.footer-col h5 {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--steel); margin-bottom: 1.25rem;
}
@media (min-width: 768px) {
  .footer-col h5 { font-size: 0.65rem; letter-spacing: 0.3em; margin-bottom: 1.5rem; }
}
.footer-col ul { list-style: none; }
.footer-col li { margin-bottom: 0.6rem; }
@media (min-width: 768px) {
  .footer-col li { margin-bottom: 0.7rem; }
}
.footer-col a, .footer-col li {
  color: var(--ivory-dim); font-size: 0.85rem;
  transition: color 0.3s;
}
@media (min-width: 768px) {
  .footer-col a, .footer-col li { font-size: 0.9rem; }
}
.footer-col a:hover { color: var(--copper-bright); }
.footer-bottom {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 1.5rem; flex-wrap: wrap; gap: 1rem;
}
@media (min-width: 768px) {
  .footer-bottom { padding-top: 2rem; }
}
.footer-copy, .footer-legal {
  font-family: var(--font-mono); font-size: 0.6rem;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel);
}
@media (min-width: 768px) {
  .footer-copy, .footer-legal { font-size: 0.65rem; letter-spacing: 0.2em; }
}
.footer-legal { display: flex; gap: 1.5rem; }
@media (min-width: 768px) {
  .footer-legal { gap: 2rem; }
}
.footer-legal a:hover { color: var(--copper-bright); }
@media (max-width: 600px) {
  .footer-top { grid-template-columns: 1fr 1fr; }
  .footer-top > div:first-child { grid-column: 1 / -1; }
}

/* ═══════════════════════════════════════════════════════════
   FLOATING ACTION MENU
   ═══════════════════════════════════════════════════════════ */
.float-menu {
  position: fixed;
  right: 1.5rem; bottom: 1.5rem;
  z-index: 90;
  display: flex; flex-direction: column;
  gap: 0.85rem;
}
@media (min-width: 768px) {
  .float-menu { right: 2rem; bottom: 2rem; gap: 1rem; }
}

.float-btn {
  width: 52px; height: 52px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  transition: transform 0.4s var(--ease-out), box-shadow 0.4s, background 0.4s, border-color 0.4s;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 10px 30px rgba(0, 51, 153, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
}
@media (min-width: 768px) {
  .float-btn { width: 58px; height: 58px; }
}
.float-btn svg {
  width: 22px; height: 22px;
  stroke-width: 1.75;
}
@media (min-width: 768px) {
  .float-btn svg { width: 24px; height: 24px; }
}

/* Variants — Royal blue gradient zemin + parlak beyaz ikon (premium) */
.float-btn-ai {
  background: linear-gradient(135deg, #003399 0%, #1e4cb8 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.22);
}
.float-btn-maps {
  background: linear-gradient(135deg, #003399 0%, #1e4cb8 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.22);
}
.float-btn-wa {
  background: #25D366;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(37, 211, 102, 0.35);
}
.float-btn-wa::before {
  content: ""; position: absolute; inset: -4px;
  border-radius: 50%;
  border: 2px solid #25D366;
  opacity: 0;
  animation: floatPulse 2.5s ease-in-out infinite;
}
@keyframes floatPulse {
  0% { transform: scale(0.95); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}
.float-btn-top {
  background: linear-gradient(135deg, #003399 0%, #001f5c 100%);
  color: var(--gold);
  border: 1px solid rgba(201, 165, 92, 0.4);
  box-shadow: 0 10px 30px rgba(0, 51, 153, 0.35);
}
.float-btn-top.is-hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.7);
  pointer-events: none;
}

@media (hover: hover) {
  .float-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 45px rgba(0, 51, 153, 0.32), 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: var(--gold);
  }
  .float-btn-ai:hover { background: linear-gradient(135deg, #1e4cb8 0%, #003399 100%); color: var(--gold); }
  .float-btn-maps:hover { background: linear-gradient(135deg, #1e4cb8 0%, #003399 100%); color: var(--gold); }
  .float-btn-wa:hover { background: #1ebe57; box-shadow: 0 18px 45px rgba(37, 211, 102, 0.5); }
  .float-btn-top:hover { background: linear-gradient(135deg, #001f5c 0%, #003399 100%); color: #ffffff; border-color: var(--gold); }
}
.float-btn:active { transform: scale(0.95); }

/* Tooltip — Royal blue zemin + altın metin (premium) */
.float-btn[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%) translateX(8px);
  padding: 0.7rem 1.1rem;
  background: linear-gradient(135deg, #003399 0%, #001f5c 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 165, 92, 0.35);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: #ffffff;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s var(--ease-out);
  box-shadow: 0 12px 35px rgba(0, 51, 153, 0.35), 0 2px 6px rgba(0, 0, 0, 0.1);
}
.float-btn[data-tooltip]::before {
  /* Tooltip arrow */
  content: "";
  position: absolute;
  right: calc(100% + 7px);
  top: 50%;
  transform: translateY(-50%) translateX(8px);
  width: 0; height: 0;
  border-left: 7px solid #003399;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s var(--ease-out);
  z-index: 1;
}
@media (hover: hover) {
  .float-btn[data-tooltip]:hover::after,
  .float-btn[data-tooltip]:hover::before {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* Hide tooltips on small screens (no hover anyway) */
@media (max-width: 768px) {
  .float-btn[data-tooltip]::after,
  .float-btn[data-tooltip]::before { display: none; }
}

/* When mobile menu is open, hide float menu */
body.menu-open .float-menu { display: none; }

/* ═══════════════════════════════════════════════════════════
   AI ASSISTANT — Notification badge + Chat panel + Demo modal
   ═══════════════════════════════════════════════════════════ */

/* Notification badge (5 sn sonra belirir) */
.float-btn-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e63946;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.45);
  opacity: 0;
  transform: scale(0.4);
  pointer-events: none;
  transition: opacity 0.4s var(--ease-out), transform 0.5s var(--ease-out);
}
.float-btn-badge.is-visible {
  opacity: 1;
  transform: scale(1);
  animation: badgePulse 2.5s ease-in-out infinite;
}
@keyframes badgePulse {
  0%, 100% { box-shadow: 0 4px 12px rgba(230, 57, 70, 0.45); }
  50% { box-shadow: 0 4px 20px rgba(230, 57, 70, 0.7); }
}

/* CHAT PANEL — Royal blue header + beyaz body, lüks his */
.ai-chat-panel {
  position: fixed;
  bottom: 95px;
  right: 1.25rem;
  width: 360px;
  max-width: calc(100vw - 2rem);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 51, 153, 0.25), 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 51, 153, 0.1);
  z-index: 99;
  opacity: 0;
  transform: translateY(20px) scale(0.96);
  pointer-events: none;
  transition: opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ai-chat-panel.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
@media (min-width: 768px) {
  .ai-chat-panel { bottom: 105px; right: 5rem; width: 380px; }
}
@media (max-width: 480px) {
  .ai-chat-panel { right: 1rem; left: 1rem; width: auto; }
}

/* Chat header */
.ai-chat-header {
  background: linear-gradient(135deg, #003399 0%, #001f5c 100%);
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
}
.ai-chat-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(201, 165, 92, 0.35);
}
.ai-chat-avatar svg {
  width: 22px; height: 22px;
  color: #003399;
}
.ai-chat-header-text {
  flex: 1;
  min-width: 0;
}
.ai-chat-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  color: #ffffff;
  letter-spacing: 0.005em;
  line-height: 1.2;
}
.ai-chat-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 0.25rem;
}
.ai-chat-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 0 8px rgba(37, 211, 102, 0.6);
  animation: chatDotPulse 2s ease-in-out infinite;
}
@keyframes chatDotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.ai-chat-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}
.ai-chat-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}
.ai-chat-close svg { width: 14px; height: 14px; }

/* Chat body — Mesajlar */
.ai-chat-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #fafafa;
  min-height: 140px;
}
.ai-chat-message {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 85%;
  font-weight: 500;
}
.ai-chat-message-bot {
  background: #ffffff;
  color: #2c3e50;
  border: 1px solid rgba(0, 51, 153, 0.08);
  border-top-left-radius: 4px;
  align-self: flex-start;
  box-shadow: 0 2px 6px rgba(0, 51, 153, 0.04);
}
.ai-chat-time {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--steel);
  align-self: flex-start;
  padding-left: 0.5rem;
}

/* Input area */
.ai-chat-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: #ffffff;
  border-top: 1px solid rgba(0, 51, 153, 0.08);
}
.ai-chat-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--ivory);
  padding: 0.5rem 0;
  cursor: pointer;
}
.ai-chat-input::placeholder { color: var(--steel); }
.ai-chat-send {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--gold);
  border: none;
  color: #003399;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(201, 165, 92, 0.35);
}
.ai-chat-send:hover {
  background: var(--gold-soft);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(201, 165, 92, 0.5);
}
.ai-chat-send svg { width: 18px; height: 18px; }

/* DEMO MODAL — Tıklayınca tam ekran overlay */
.ai-demo-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 15, 27, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease-out);
}
.ai-demo-modal.is-open {
  opacity: 1;
  pointer-events: auto;
}
.ai-demo-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 30px 80px rgba(0, 51, 153, 0.35);
  transform: scale(0.94);
  transition: transform 0.4s var(--ease-out);
}
.ai-demo-modal.is-open .ai-demo-card {
  transform: scale(1);
}
.ai-demo-icon {
  width: 56px; height: 56px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  border: 2px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
}
.ai-demo-icon svg { width: 26px; height: 26px; }
.ai-demo-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--ivory);
  margin-bottom: 0.85rem;
  letter-spacing: -0.01em;
}
.ai-demo-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--ivory-dim);
  margin-bottom: 1.75rem;
  font-weight: 400;
}
.ai-demo-btn {
  display: inline-block;
  padding: 0.85rem 2.5rem;
  background: var(--gold);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 18px rgba(201, 165, 92, 0.35);
}
.ai-demo-btn:hover {
  background: var(--gold-soft);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(201, 165, 92, 0.5);
}

/* ═══════════════════════════════════════════════════════════
   REVEAL
   ═══════════════════════════════════════════════════════════ */
.reveal { opacity: 0; transform: translateY(40px); transition: all 1s var(--ease-out); }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.2s; }
.reveal-d3 { transition-delay: 0.3s; }
.reveal-d4 { transition-delay: 0.4s; }

@media (prefers-reduced-motion: reduce) {
  .hero-media video { display: none; }
  * { animation: none !important; transition-duration: 0.01ms !important; }
}
</style>
</style>
</head>
<body>

</style>
</head>
<body>

<div class="cursor"></div>
<div class="cursor-dot"></div>

<!-- FLOATING ACTION MENU (sağ alt, fixed) -->
<div class="float-menu" id="floatMenu">

  <!-- AI ASSISTANT -->
  <button type="button" class="float-btn float-btn-ai" id="aiAssistantBtn" data-i18n-tooltip="float_ai" data-tooltip="KI-Assistent · Fragen stellen" aria-label="KI-Assistent">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" />
      <path d="M12 6V3M9 3h6M8 17h8" stroke-linecap="round" />
    </svg>
    <span class="float-btn-badge" id="aiAssistantBadge" aria-hidden="true">1</span>
  </button>

  <!-- YOL TARİFİ -->
  <a href="${mapsUrl}"
     target="_blank" rel="noopener"
     class="float-btn float-btn-maps"
     data-i18n-tooltip="float_maps"
     data-tooltip="${t.float_maps} · ${adresKisa}"
     aria-label="Routenplaner öffnen">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" stroke-linejoin="round" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  </a>

  <!-- WHATSAPP -->
  <a href="${waLink}"
     target="_blank" rel="noopener"
     class="float-btn float-btn-wa"
     data-i18n-tooltip="float_wa"
     data-tooltip="WhatsApp · Sofort-Anfrage"
     aria-label="WhatsApp öffnen">
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  </a>

  <!-- ÜSTE ÇIK -->
  <button class="float-btn float-btn-top is-hidden"
          id="scrollTopBtn"
          data-i18n-tooltip="float_top"
          data-tooltip="Nach oben"
          aria-label="Nach oben scrollen">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>

</div>

<!-- KI-ASSISTENT CHAT PANEL -->
<div class="ai-chat-panel" id="aiChatPanel" aria-hidden="true">
  <div class="ai-chat-header">
    <div class="ai-chat-avatar" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="6" width="18" height="14" rx="3" />
        <circle cx="9" cy="13" r="1.2" fill="currentColor" />
        <circle cx="15" cy="13" r="1.2" fill="currentColor" />
        <path d="M12 6V3M9 3h6M8 17h8" stroke-linecap="round" />
      </svg>
    </div>
    <div class="ai-chat-header-text">
      <div class="ai-chat-name">${navTitle}<br>Assistent</div>
      <div class="ai-chat-status"><span class="ai-chat-dot"></span>Online</div>
    </div>
    <button type="button" class="ai-chat-close" id="aiChatClose" aria-label="Schließen">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M6 6l12 12M6 18L18 6" stroke-linecap="round" />
      </svg>
    </button>
  </div>
  <div class="ai-chat-body">
    <div class="ai-chat-message ai-chat-message-bot">
      Guten Tag! Wie können wir Ihnen helfen? Schreiben Sie uns für Beratung,
      Termine oder Bauprojekt-Anfragen.
    </div>
    <div class="ai-chat-time">jetzt</div>
  </div>
  <div class="ai-chat-input-wrap">
    <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Nachricht schreiben..." readonly />
    <button type="button" class="ai-chat-send" id="aiChatSend" aria-label="Senden">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M4 12L20 4l-4 16-4-7-8-1z" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</div>

<!-- KI-ASSISTENT DEMO MODAL -->
<div class="ai-demo-modal" id="aiDemoModal" aria-hidden="true">
  <div class="ai-demo-card">
    <div class="ai-demo-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" stroke-linecap="round" />
      </svg>
    </div>
    <h3 class="ai-demo-title">KI-Assistent</h3>
    <p class="ai-demo-text">
      Dieser Bereich dient nur zu Demonstrationszwecken. Nach Vertragsabschluss
      wird Ihr KI-Assistent hier vollständig aktiviert.
    </p>
    <button type="button" class="ai-demo-btn" id="aiDemoClose">Verstanden</button>
  </div>
</div>

<!-- LOADER — loader-21.mp4 saf hali, hiç filter yok -->
<div class="loader" id="loader">
  <video class="loader-video" id="loaderVideo" autoplay muted playsinline preload="auto" aria-hidden="true">
    <source src="https://raw.githubusercontent.com/volkancatak1309-max/premium-3d-assets/main/loaders/3d-abstract/loader-21.mp4" type="video/mp4" />
  </video>
</div>

<!-- NAV -->
<nav class="nav" id="nav">
  <a href="#top" class="nav-mark" aria-label="${firmaAdi}">
    <span class="nav-logo-text">${navTitle}</span>
    <span class="mark-sub">${adresKisa.split(",").slice(-2)[0] ? adresKisa.split(",").slice(-2)[0].trim() : ""}</span>
  </a>
  <ul class="nav-links">
    <li><a href="#leistungen" data-i18n="nav_services">Leistungen</a></li>
    <li><a href="#prozess" data-i18n="nav_process">Prozess</a></li>
    <li><a href="#referenzen" data-i18n="nav_references">Referenzen</a></li>
    <li><a href="#ueber-uns" data-i18n="nav_about">Über uns</a></li>
  </ul>
  <div class="lang-switch" role="group" aria-label="Sprache wählen / Choose language / Dil seçimi">
    <button class="lang-btn is-active" data-lang="de" type="button" aria-label="Deutsch">DE</button>
    <span class="lang-sep">·</span>
    <button class="lang-btn" data-lang="en" type="button" aria-label="English">EN</button>
    <span class="lang-sep">·</span>
    <button class="lang-btn" data-lang="tr" type="button" aria-label="Türkçe">TR</button>
  </div>
  <a href="#kontakt" class="nav-cta" data-i18n="nav_cta">Termin vereinbaren</a>
  <button class="nav-burger" id="navBurger" aria-label="Menü öffnen" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- MOBILE MENU -->
<div class="mobile-menu" id="mobileMenu">
  <div>
    <ul>
      <li><a href="#leistungen" data-mm-link data-i18n="nav_services">Leistungen</a></li>
      <li><a href="#prozess" data-mm-link data-i18n="nav_process">Prozess</a></li>
      <li><a href="#referenzen" data-mm-link data-i18n="nav_references">Referenzen</a></li>
      <li><a href="#ueber-uns" data-mm-link data-i18n="nav_about">Über uns</a></li>
      <li><a href="#kontakt" data-mm-link data-i18n="nav_contact">Kontakt</a></li>
    </ul>
    <div class="mobile-menu-cta">
      <a href="#kontakt" class="btn-primary" data-mm-link>
        <span data-i18n="nav_cta">Termin vereinbaren</span>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <path d="M1 5h16M13 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
        </svg>
      </a>
    </div>
    <div class="mobile-menu-lang">
      <span class="lang-label" data-i18n="lang_label">Sprache</span>
      <button class="lang-btn is-active" data-lang="de" type="button">DE</button>
      <button class="lang-btn" data-lang="en" type="button">EN</button>
      <button class="lang-btn" data-lang="tr" type="button">TR</button>
    </div>
  </div>
  <div class="mobile-menu-foot">
    ${telefon}<br>
    ${adres}
  </div>
</div>

<!-- HERO -->
<section class="hero" id="top">
  <div class="hero-media" id="heroMedia">
    <img src="${heroImage}" alt="${firmaAdi}" />
    <video id="heroVideo" autoplay muted loop playsinline preload="metadata">
      <source src="${heroVideo}" type="video/mp4" />
    </video>
  </div>
  <div class="hero-overlay"></div>
  <div class="hero-grain"></div>

  <div class="hero-content">
    <div class="hero-text">
      <div class="hero-overline" id="heroOverline">
        <span class="line"></span>
        <span data-i18n="hero_overline">Generalunternehmer · seit 2023</span>
      </div>
      <h1 class="hero-title" id="heroTitle">
        <span class="line"><span data-i18n="hero_title_1">Präzision.</span></span>
        <span class="line"><span><em data-i18n="hero_title_2">Effizienz.</em></span></span>
        <span class="line"><span data-i18n="hero_title_3">Handschlag.</span></span>
      </h1>
      <p class="hero-sub" id="heroSub" data-i18n="hero_sub">
        Ihr bevorzugter Generalunternehmer in ${adresKisa.split(',')[1] ? adresKisa.split(',')[1].trim() : ''} für Neubau, Umbau,
        Sanierung und Holzbau. Wir stehen für strukturierte Bauprozesse,
        die Qualität, Zeit und Budget vereinen — von der ersten Idee
        bis zur Schlüsselübergabe.
      </p>
      <div class="hero-actions" id="heroActions">
        <a href="#kontakt" class="btn-primary">
          <span data-i18n="hero_cta_primary">Projekt besprechen</span>
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M1 5h16M13 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" />
          </svg>
        </a>
        <a href="#leistungen" class="btn-ghost" data-i18n="hero_cta_secondary">Leistungen entdecken</a>
      </div>
    </div>
    <div class="hero-spec-wrap">
      <div class="hero-spec" id="heroSpec">
        <div class="hero-spec-label" data-i18n="spec_label">Live · Aktuelle Auslastung</div>
        <div class="hero-spec-row"><span data-i18n="spec_active">Aktive Projekte</span><span>07</span></div>
        <div class="hero-spec-row"><span data-i18n="spec_region">Region</span><span>${adresKisa.split(',')[1] ? adresKisa.split(',')[1].trim() : ''}</span></div>
        <div class="hero-spec-row"><span data-i18n="spec_specialty">Spezialisierung</span><span data-i18n="spec_specialty_value">Holzbau</span></div>
        <div class="hero-spec-row"><span data-i18n="spec_capacity">Kapazität Q3 / 2026</span><span data-i18n="spec_capacity_value">verfügbar</span></div>
        <div class="hero-spec-row"><span data-i18n="spec_response">Reaktionszeit</span><span>&lt; 24 h</span></div>
      </div>
    </div>
  </div>

  <div class="scroll-indicator" id="scrollIndicator">
    <span data-i18n="scroll_word">Scroll</span>
    <div class="scroll-indicator-line"></div>
  </div>
</section>

<!-- STATS -->
<section class="stats">
  <div class="stats-inner">
    <div class="stat reveal">
      <div class="stat-num"><span data-counter="2023" data-counter-duration="3000">0</span><em>·</em></div>
      <div class="stat-label" data-i18n="stat_founded">Gegründet</div>
    </div>
    <div class="stat reveal reveal-d1">
      <div class="stat-num"><span data-counter="27">0</span><em>+</em></div>
      <div class="stat-label" data-i18n="stat_projects">Projekte</div>
    </div>
    <div class="stat reveal reveal-d2">
      <div class="stat-num"><span data-counter="56">0</span><em>+</em></div>
      <div class="stat-label" data-i18n="stat_clients">Zufriedene Kunden</div>
    </div>
    <div class="stat reveal reveal-d3">
      <div class="stat-num"><span data-counter="100">0</span><em>%</em></div>
      <div class="stat-label" data-i18n="stat_quality">Handschlagqualität</div>
    </div>
  </div>
</section>

<!-- PHILOSOPHY -->
<section class="section philosophy" id="ueber-uns">
  <div class="section-inner">
    <div class="section-label reveal" data-i18n="phil_label">CM · Bedeutung</div>
    <div class="cm-mark reveal reveal-d1">
      <em>C</em><span class="ampersand">&</span><em>M</em>
    </div>
    <p class="cm-tagline reveal reveal-d2" data-i18n-html="phil_tagline">
      CM steht für <em>Craftsmanship & Modernity.</em> Wir bewahren das
      traditionelle Handwerk und sehen die Zukunft in der konsequenten
      Modernisierung.
    </p>
  </div>
</section>

<!-- GUARANTEES: Budget + Termin -->
<section class="section guarantees">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="guar_label">Bauen ohne Kompromisse</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="guar_title">Was Bauherren<br /><em>von uns erwarten dürfen.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="guar_lead">
        Als Generalunternehmer übernehmen wir die komplette Koordination aller
        regionalen Fachbetriebe aus dem Ländle und Umgebung. Zwei Versprechen
        stehen dabei kompromisslos im Vordergrund.
      </p>
    </div>

    <div class="guarantees-grid">
      <div class="guarantee reveal">
        <div class="guarantee-icon">
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="0.6">
            <circle cx="28" cy="28" r="20" />
            <path d="M28 12v16l10 6" stroke-linecap="round" />
            <circle cx="28" cy="28" r="2" fill="currentColor" />
          </svg>
        </div>
        <div class="guarantee-num">I</div>
        <h3 data-i18n="guar_termin_title">Termin-Garantie</h3>
        <p class="guarantee-emph" data-i18n="guar_termin_emph">Ihre Zeit ist kostbar.</p>
        <p data-i18n="guar_termin_text">Daher legen wir großen Wert auf die Einhaltung des vereinbarten Zeitplans. Mit bewährten Prozessen und effizienter Koordination garantieren wir eine zügige und termingerechte Fertigstellung Ihres Projekts.</p>
      </div>

      <div class="guarantee reveal reveal-d1">
        <div class="guarantee-icon">
          <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="0.6">
            <rect x="8" y="14" width="40" height="28" rx="2" />
            <circle cx="28" cy="28" r="6" />
            <path d="M28 22v12M22 28h12" stroke-linecap="round" />
            <circle cx="14" cy="20" r="1" fill="currentColor" />
            <circle cx="42" cy="36" r="1" fill="currentColor" />
          </svg>
        </div>
        <div class="guarantee-num">II</div>
        <h3 data-i18n="guar_budget_title">Budget-Sicherheit</h3>
        <p class="guarantee-emph" data-i18n="guar_budget_emph">Transparente Kostenkontrolle.</p>
        <p data-i18n="guar_budget_text">Transparente Kostenaufstellung und striktes Budgetmanagement bilden die Grundsteine unserer Arbeit. Wir setzen uns dafür ein, Ihr Budget sorgfältig einzuhalten und durch kreative und effektive Lösungen eine wirtschaftliche Realisierung Ihres Projekts sicherzustellen.</p>
      </div>
    </div>

    <p class="guarantees-foot reveal reveal-d2">
      <span class="guarantees-foot-mark"></span>
      <span data-i18n="guar_foot">Wir arbeiten ausschließlich mit geprüften, regionalen Fachbetrieben aus
      ${adresKisa} — vom ersten Aushub bis zur Schlüsselübergabe.</span>
    </p>
  </div>
</section>

<!-- SERVICES -->
<section class="section services" id="leistungen">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="srv_label">Leistungsspektrum</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="srv_title">Spezialist für<br /><em>Bauvorhaben.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="srv_lead">
        Von der Revitalisierung historischer Bauten über moderne Neubauten
        bis hin zu anspruchsvollen Umbauprojekten. Spezialisierte Bauleistungen
        werden dabei durch entsprechend qualifizierte, regionale Fachbetriebe umgesetzt.
      </p>
    </div>

    <div class="services-grid">
      <div class="service reveal">
        <div class="service-num">01</div>
        <div class="service-icon">
          <svg viewBox="0 0 56 56"><path d="M8 48h40M14 48V24L28 12l14 12v24M22 48V36h12v12M28 24v6" /></svg>
        </div>
        <h3 data-i18n="srv_neubau_title">Neubau</h3>
        <p data-i18n="srv_neubau_text">Von der Grundstücksanalyse bis zum Einzug. Schlüsselfertige Generalunternehmerleistung mit klarer Kostentransparenz und definierten Meilensteinen.</p>
        <div class="service-tags">
          <span class="service-tag" data-i18n="srv_neubau_tag1">Einfamilienhaus</span>
          <span class="service-tag" data-i18n="srv_neubau_tag2">Wohnbau</span>
          <span class="service-tag" data-i18n="srv_neubau_tag3">Gewerbe</span>
        </div>
      </div>

      <div class="service reveal reveal-d1">
        <div class="service-num">02</div>
        <div class="service-icon">
          <svg viewBox="0 0 56 56"><rect x="10" y="14" width="36" height="32" /><path d="M10 26h36M22 14v32M22 26h12v12" /><path d="M14 14l8-8h28l-4 8" /></svg>
        </div>
        <h3 data-i18n="srv_umbau_title">Umbau</h3>
        <p data-i18n="srv_umbau_text">Den Bestand neu denken. Strukturelle Anpassungen, Aufstockungen und Zubauten — mit Respekt vor der Substanz und Klarheit in der Umsetzung.</p>
        <div class="service-tags">
          <span class="service-tag" data-i18n="srv_umbau_tag1">Aufstockung</span>
          <span class="service-tag" data-i18n="srv_umbau_tag2">Zubau</span>
          <span class="service-tag" data-i18n="srv_umbau_tag3">Erweiterung</span>
        </div>
      </div>

      <div class="service reveal reveal-d2">
        <div class="service-num">03</div>
        <div class="service-icon">
          <svg viewBox="0 0 56 56"><path d="M8 50h40M12 50V20l16-12 16 12v30" /><path d="M20 50V32h6v18M30 50V32h6v18" /><circle cx="28" cy="22" r="2" /></svg>
        </div>
        <h3 data-i18n="srv_san_title">Sanierung</h3>
        <p data-i18n="srv_san_text">Altbauten fachgerecht modernisieren. Energetische Optimierung, Substanzerhalt, gestalterische Aufwertung — koordiniert mit regionalen Fachbetrieben.</p>
        <div class="service-tags">
          <span class="service-tag" data-i18n="srv_san_tag1">Energetisch</span>
          <span class="service-tag" data-i18n="srv_san_tag2">Denkmalschutz</span>
          <span class="service-tag" data-i18n="srv_san_tag3">Modernisierung</span>
        </div>
      </div>

      <div class="service reveal reveal-d3">
        <div class="service-num">04</div>
        <div class="service-icon">
          <svg viewBox="0 0 56 56"><path d="M8 48h40M28 48V12M14 18l14-6 14 6M14 28l14-6 14 6M14 38l14-6 14 6" /></svg>
        </div>
        <h3 data-i18n="srv_holz_title">Holzbau</h3>
        <p data-i18n="srv_holz_text">Unsere Wurzeln. Konstruktiver Holzbau, vom Aufstockungsmodul bis zum vollständigen Holzhaus — als nachhaltiges, charaktervolles Statement.</p>
        <div class="service-tags">
          <span class="service-tag" data-i18n="srv_holz_tag1">Konstruktion</span>
          <span class="service-tag" data-i18n="srv_holz_tag2">Holzhaus</span>
          <span class="service-tag" data-i18n="srv_holz_tag3">Nachhaltig</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ATMOSPHÄRE — Video 2: Mavi saat ev (Veo 3 image-to-video) -->
<section class="atmosphere">
  <div class="atmosphere-media">
    <video id="atmosphereVideo" autoplay muted loop playsinline preload="metadata"
           poster="${galleryImage1}">
      <source src="${heroVideo}" type="video/mp4" />
    </video>
  </div>
  <div class="atmosphere-overlay"></div>
  <div class="atmosphere-content">
    <div class="atmosphere-overline reveal">
      <span class="line"></span>
      <span data-i18n="atm_overline">Atmosphäre · ${adresKisa.split(',')[1] ? adresKisa.split(',')[1].trim() : ''}</span>
    </div>
    <h2 class="atmosphere-title reveal reveal-d1" data-i18n-html="atm_title">
      Wenn der Tag<br /><em>zur Ruhe kommt.</em>
    </h2>
    <p class="atmosphere-sub reveal reveal-d2" data-i18n="atm_sub">
      Ein fertiges Bauwerk ist mehr als Mauern, Holz und Glas. Es ist
      der Ort, an dem Geschichten beginnen — sicher gebaut, sorgfältig
      koordiniert, termingerecht übergeben.
    </p>
  </div>
</section>

<!-- PRINZIPIEN -->
<section class="section principles">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="prin_label">Unsere Werte</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="prin_title">Fünf Prinzipien.<br /><em>Eine Verpflichtung.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="prin_lead">
        Entdecken Sie unsere vielfältige Palette an Dienstleistungen, die darauf
        ausgerichtet sind, all Ihre individuellen Bedürfnisse und Anforderungen
        bestmöglich zu erfüllen.
      </p>
    </div>

    <div class="principles-grid">
      <div class="principle reveal">
        <div class="principle-num">01</div>
        <h3 data-i18n="prin1_title">Projektberatung + Management</h3>
        <p data-i18n="prin1_text">Wir starten jedes Projekt mit einer detaillierten Aufnahme Ihrer Vision, um Ihre Wünsche maßgerecht umzusetzen. Unser Team arbeitet eng mit Ihnen zusammen, um jeden Aspekt Ihres Projektes zu prüfen und zu koordinieren, wobei Ihre Anforderungen stets im Vordergrund stehen.</p>
      </div>
      <div class="principle reveal reveal-d1">
        <div class="principle-num">02</div>
        <h3 data-i18n="prin2_title">Koordination</h3>
        <p data-i18n="prin2_text">Ein reibungsloser Ablauf erfordert eine sorgfältige Abstimmung aller Gewerke. Wir übernehmen die Koordination der beteiligten Unternehmen und Fachkräfte, um eine harmonische und zielgerichtete Zusammenarbeit zu sichern.</p>
      </div>
      <div class="principle reveal reveal-d2">
        <div class="principle-num">03</div>
        <h3 data-i18n="prin3_title">Nachhaltigkeit</h3>
        <p data-i18n="prin3_text">Nachhaltige Materialbeschaffung ist ein zentrales Anliegen, daher wählen wir Materialien und Ressourcen sorgfältig aus, um nicht nur die Umwelt zu schonen, sondern auch langfristige Wertbeständigkeit in Ihr Bauwerk zu bringen.</p>
      </div>
      <div class="principle reveal reveal-d3">
        <div class="principle-num">04</div>
        <h3 data-i18n="prin4_title">Termintreue</h3>
        <p class="principle-emph" data-i18n="prin4_emph">Ihre Zeit ist kostbar!</p>
        <p data-i18n="prin4_text">Daher legen wir großen Wert auf die Einhaltung des vereinbarten Zeitplans. Mit bewährten Prozessen und effizienter Koordination garantieren wir eine zügige und termingerechte Fertigstellung Ihres Projekts.</p>
      </div>
      <div class="principle reveal reveal-d4">
        <div class="principle-num">05</div>
        <h3 data-i18n="prin5_title">Kostenmanagement</h3>
        <p data-i18n="prin5_text">Transparente Kostenaufstellung und striktes Budgetmanagement bilden die Grundsteine unserer Arbeit. Wir setzen uns dafür ein, Ihr Budget sorgfältig einzuhalten und durch kreative und effektive Lösungen eine wirtschaftliche Realisierung Ihres Projekts sicherzustellen.</p>
      </div>
    </div>
  </div>
</section>

<!-- PROCESS -->
<section class="section process" id="prozess">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="prc_label">Ablauf</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="prc_title">Von der Idee.<br /><em>Bis zur Übergabe.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="prc_lead">
        Strukturierte Bauprozesse statt improvisiertem Aktionismus. Jeder Schritt ist dokumentiert, terminiert und mit Ihnen abgestimmt.
      </p>
    </div>
    <div class="process-track" id="processTrack">
      <div class="process-step reveal"><div class="process-step-num">01</div><h4 data-i18n="prc1_title">Erstgespräch</h4><p data-i18n="prc1_text">Vision, Rahmen, Machbarkeit. Vor Ort oder digital.</p></div>
      <div class="process-step reveal reveal-d1"><div class="process-step-num">02</div><h4 data-i18n="prc2_title">Konzept</h4><p data-i18n="prc2_text">Detaillierte Aufnahme, Variantenstudie, Erstkalkulation.</p></div>
      <div class="process-step reveal reveal-d2"><div class="process-step-num">03</div><h4 data-i18n="prc3_title">Planung</h4><p data-i18n="prc3_text">Behörde, Ausführungsplan, Gewerkekoordination.</p></div>
      <div class="process-step reveal reveal-d3"><div class="process-step-num">04</div><h4 data-i18n="prc4_title">Ausführung</h4><p data-i18n="prc4_text">Bauleitung, Termin- und Kostencontrolling, Qualitätssicherung.</p></div>
      <div class="process-step reveal reveal-d4"><div class="process-step-num">05</div><h4 data-i18n="prc5_title">Übergabe</h4><p data-i18n="prc5_text">Schlussabnahme, Dokumentation, Gewährleistung.</p></div>
    </div>
  </div>
</section>

<!-- BAUPROZESS — Video 3: 3D Yapım Simülasyonu -->
<section class="bauprozess">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="bau_label">Projekt Aufstockung</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="bau_title">Vorher.<br /><em>Nachher.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="bau_lead">
        Eine reale Aufstockung in ${adresKisa.split(',')[1] ? adresKisa.split(',')[1].trim() : ''}, in zehn Sekunden erzählt.
        Drei Fassaden, drei Perspektiven — der Bestand bleibt,
        der Charakter wächst.
      </p>
    </div>

    <div class="bauprozess-video reveal reveal-d3">
      <video id="bauprozessVideo" autoplay muted loop playsinline preload="metadata"
             poster="${galleryImage2}">
        <source src="${heroVideo}" type="video/mp4" />
      </video>
      <div class="bauprozess-video-overlay"></div>
      <div class="bauprozess-video-corner">
        <span class="bauprozess-video-tag" data-i18n="bau_tag">Vorher · Nachher</span>
      </div>
    </div>
  </div>
</section>

<!-- PORTFOLIO -->
<section class="section portfolio" id="referenzen">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="ref_label">Referenzen</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="ref_title">Realisierte<br /><em>Bauwerke.</em></h2>
      </div>
      <p class="section-lead reveal reveal-d2" data-i18n="ref_lead">
        Eine Auswahl unserer Arbeiten in ${adresKisa.split(',')[1] ? adresKisa.split(',')[1].trim() : ''}. Vom Neubau über sensible Sanierungen bis hin zu Holzbau-Projekten mit Charakter.
      </p>
    </div>
    <div class="portfolio-grid">
      <div class="portfolio-item reveal">
        <div class="portfolio-visual" style="background-image: url('${galleryImage1}');"></div>
        <div class="portfolio-meta"><div><h4 data-i18n="ref1_title">Aufstockung</h4><p data-i18n="ref1_meta">Vorher · Nachher</p></div><span class="portfolio-meta-tag" data-i18n="ref1_tag">Aufstockung</span></div>
      </div>
      <div class="portfolio-item reveal reveal-d1">
        <div class="portfolio-visual" style="background-image: url('${galleryImage2}');"></div>
        <div class="portfolio-meta"><div><h4 data-i18n="ref2_title">Hofacker</h4><p data-i18n="ref2_meta">Zubau · Umbau</p></div><span class="portfolio-meta-tag" data-i18n="ref2_tag">Zubau</span></div>
      </div>
      <div class="portfolio-item reveal reveal-d2">
        <div class="portfolio-visual" style="background-image: url('${galleryImage3}');"></div>
        <div class="portfolio-meta"><div><h4 data-i18n="ref3_title">Özgün</h4><p data-i18n="ref3_meta">Schlüsselfertig</p></div><span class="portfolio-meta-tag" data-i18n="ref3_tag">Neubau</span></div>
      </div>
      <div class="portfolio-item reveal reveal-d3">
        <div class="portfolio-visual" style="background-image: url('${galleryImage1}');"></div>
        <div class="portfolio-meta"><div><h4 data-i18n="ref4_title">Spiegel</h4><p data-i18n="ref4_meta">Bestandserneuerung</p></div><span class="portfolio-meta-tag" data-i18n="ref4_tag">Sanierung</span></div>
      </div>
    </div>
  </div>
</section>

<!-- WERTE: Engagement + Vertrauen -->
<section class="section werte">
  <div class="section-inner">
    <div class="werte-grid">
      <div class="werte-card reveal">
        <div class="werte-num">I</div>
        <h3 data-i18n="werte_eng_title">Engagement</h3>
        <p data-i18n="werte_eng_text">Höchste Qualitätsstandards und eine kundenorientierte Herangehensweise zeichnen unsere Arbeit aus.</p>
      </div>
      <div class="werte-card reveal reveal-d1">
        <div class="werte-num">II</div>
        <h3 data-i18n="werte_ver_title">Vertrauen</h3>
        <p data-i18n="werte_ver_text">Zählen auf unser professionelles Team, das Ihr Bauprojekt mit Sorgfalt und fachlicher Kompetenz zum Erfolg führt.</p>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="section about" id="ueber-uns">
  <div class="section-inner">
    <div class="section-head">
      <div>
        <div class="section-label reveal" data-i18n="about_eyebrow">${t.about_eyebrow}</div>
        <h2 class="section-title reveal reveal-d1" data-i18n-html="about_title">${t.about_title}</h2>
      </div>
      <p class="section-lead reveal reveal-d2">
        ${firmaSlogan}
      </p>
    </div>

    <div class="about-grid about-grid-single">
      <div>
        <p class="about-quote reveal reveal-d1" data-i18n="about_quote">${t.about_quote}</p>
        <p class="about-bio reveal reveal-d2">
          ${lang === "de"
            ? `Wir bei ${firmaAdi} verbinden traditionelles Handwerk mit moderner Baukompetenz. Präzise Planung, klare Struktur und echte Handschlagqualität sind die Grundpfeiler unserer Arbeit. Jedes Projekt wird mit Sorgfalt geplant und mit Hingabe umgesetzt — für Bauwerke, die Bestand haben und Vertrauen schaffen.`
            : `${firmaAdi} olarak geleneksel ustalığı modern inşaat yetkinliğiyle birleştiriyoruz. Hassas planlama, net yapı ve gerçek söz senedi anlayışı, çalışmamızın temel taşlarıdır. Her proje özenle planlanır ve titizlikle hayata geçirilir — kalıcı, güven veren yapılar için.`
          }
        </p>
      </div>
    </div>
  </div>
</section>

<!-- GOOGLE REVIEWS -->

/* ─── PARÇA 2 SONU — buradan sonra Parça 3 (Reviews + CTA + Contact + Footer + JS + Closing) gelecek ─── */
