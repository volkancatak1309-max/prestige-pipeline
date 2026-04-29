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

