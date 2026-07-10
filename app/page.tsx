"use client";

import { useMemo, useState } from "react";

type Product = {
  code: string;
  name: string;
  category: "Zamak" | "Düğme" | "Boy Kulp" | "Askı & Portmanto";
  image: number;
  sizes: string[];
  colors: string[];
  prices: Record<string, string[]>;
  box: string;
};

const p = (
  code: string,
  name: string,
  category: Product["category"],
  image: number,
  sizes: string[],
  prices: Record<string, string[]>,
  box = "50 / 400",
): Product => ({ code, name, category, image, sizes, colors: Object.keys(prices), prices, box });

const zamak4 = ["128", "160", "192", "224"];
const zamak3 = ["128", "160", "224"];
const zamak2 = ["96–128", "160–192"];
const boy = ["128", "160", "192", "224", "256", "288", "320"];

const products: Product[] = [
  p("3020", "Lort", "Zamak", 3, zamak4, { Siyah: ["45", "53", "60", "68"], Krom: ["60", "68", "77", "86"], İnox: ["64", "72", "81", "90"], Altın: ["82", "95", "107", "120"] }),
  p("3021", "Çizgili Lort", "Zamak", 4, zamak4, { Siyah: ["46", "53", "61", "68"], Krom: ["60", "68", "77", "86"], İnox: ["64", "72", "81", "90"], Altın: ["82", "95", "107", "120"] }),
  p("3018", "Prens", "Zamak", 5, zamak3, { Siyah: ["55", "61", "73"], Krom: ["68", "75", "90"], İnox: ["72", "79", "94"], Altın: ["90", "102", "124"] }),
  p("3019", "Çizgili Prens", "Zamak", 6, zamak3, { Siyah: ["55", "61", "73"], Krom: ["68", "75", "90"], İnox: ["72", "79", "94"], Altın: ["90", "102", "124"] }),
  p("3008", "Alfa", "Zamak", 8, zamak3, { Siyah: ["55", "61", "73"], Krom: ["68", "75", "90"], İnox: ["72", "79", "94"], Altın: ["90", "102", "124"] }),
  p("3016", "Beta", "Zamak", 9, zamak3, { Siyah: ["61", "67", "80"], Krom: ["74", "82", "96"], İnox: ["78", "86", "100"], Altın: ["97", "108", "131"] }),
  p("3011", "Kale", "Zamak", 10, ["96–128", "160–192", "160"], { Siyah: ["37", "40", "38"], Krom: ["48", "54", "52"], İnox: ["52", "57", "55"], Altın: ["64", "77", "75"] }, "75 / 600"),
  p("3005", "Kuvas", "Zamak", 11, ["160"], { Siyah: ["66"], Krom: ["80"], İnox: ["84"], Altın: ["107"] }),
  p("3023", "Klas Gama", "Zamak", 12, ["160"], { Siyah: ["45"], Krom: ["61"], İnox: ["65"], Altın: ["87"] }),
  p("3022", "Gama", "Zamak", 14, zamak4, { Siyah: ["46", "53", "61", "68"], Krom: ["60", "68", "77", "86"], İnox: ["64", "72", "81", "90"], Altın: ["82", "95", "107", "120"] }),
  p("3017", "Tiran", "Zamak", 15, zamak3, { Siyah: ["55", "61", "73"], Krom: ["68", "75", "90"], İnox: ["72", "79", "94"], Altın: ["90", "102", "124"] }),
  p("3015", "Ezgi", "Zamak", 16, zamak3, { Siyah: ["42", "47", "58"], Krom: ["55", "62", "75"], İnox: ["59", "66", "79"], Altın: ["78", "88", "110"] }),
  p("3034", "Roma", "Zamak", 18, zamak2, { Siyah: ["67", "78"], Krom: ["78", "91"], İnox: ["82", "95"], Altın: ["96", "118"] }),
  p("3035", "Çizgili Roma", "Zamak", 20, zamak2, { Siyah: ["67", "78"], Krom: ["78", "91"], İnox: ["82", "95"], Altın: ["96", "118"] }),
  p("3036", "Babil", "Zamak", 21, zamak2, { Siyah: ["58", "66"], Krom: ["70", "80"], İnox: ["74", "84"], Altın: ["88", "106"] }),
  p("3037", "Çizgili Babil", "Zamak", 22, zamak2, { Siyah: ["58", "66"], Krom: ["70", "80"], İnox: ["74", "84"], Altın: ["88", "106"] }),
  p("3032", "Paris", "Zamak", 23, zamak2, { Siyah: ["50", "56"], Krom: ["61", "70"], İnox: ["65", "74"], Altın: ["80", "97"] }),
  p("3033", "Bakü", "Zamak", 24, zamak2, { Siyah: ["58", "66"], Krom: ["70", "80"], İnox: ["74", "84"], Altın: ["88", "106"] }),
  p("3007", "Rumeli", "Zamak", 25, ["160"], { Siyah: ["77"], Krom: ["91"], İnox: ["95"], Altın: ["117"] }),
  p("3006", "Galata", "Zamak", 26, ["160"], { Siyah: ["77"], Krom: ["91"], İnox: ["95"], Altın: ["117"] }),
  p("3038", "Lüx Safran", "Zamak", 28, ["160"], { Siyah: ["73"], Krom: ["87"], İnox: ["91"], Altın: ["113"] }),
  p("3039", "Çizgili Lüx Safran", "Zamak", 30, ["160"], { Siyah: ["73"], Krom: ["87"], İnox: ["91"], Altın: ["113"] }),
  p("3040", "Safran", "Zamak", 32, ["160", "224"], { Siyah: ["53", "68"], Krom: ["68", "86"], İnox: ["72", "90"], Altın: ["95", "120"] }),
  p("3041", "Çizgili Safran", "Zamak", 33, ["160", "224"], { Siyah: ["53", "68"], Krom: ["68", "86"], İnox: ["72", "90"], Altın: ["95", "120"] }),
  p("2500", "Yuvarlak Düz", "Düğme", 34, ["Standart"], { Siyah: ["30"], Krom: ["38"], İnox: ["42"], Altın: ["49"] }, "150 / 1200"),
  p("2601", "Kare Set", "Düğme", 35, ["Standart"], { Siyah: ["30"], Krom: ["38"], İnox: ["42"], Altın: ["49"] }, "150 / 1200"),
  p("2502", "Yuvarlak Klas", "Düğme", 38, ["Standart"], { Siyah: ["30"], Krom: ["38"], İnox: ["42"], Altın: ["49"] }, "150 / 1200"),
  p("2602", "Kare Klas", "Düğme", 39, ["Standart"], { Siyah: ["30"], Krom: ["38"], İnox: ["42"], Altın: ["49"] }, "150 / 1200"),
  p("3028", "Gondol", "Zamak", 41, ["96", "128"], { Siyah: ["25", "29"], Krom: ["38", "43"], İnox: ["42", "47"], Altın: ["56", "66"] }),
  p("3024", "Favori", "Zamak", 43, ["160", "224"], { Siyah: ["53", "68"], Krom: ["68", "86"], İnox: ["72", "90"], Altın: ["95", "120"] }),
  p("3050", "Elf", "Zamak", 44, ["160", "224"], { Siyah: ["60", "73"], Krom: ["75", "90"], İnox: ["79", "94"], Altın: ["101", "124"] }),
  p("5000", "Tas Kulp", "Zamak", 46, ["64", "96"], { Siyah: ["35", "44"], Krom: ["48", "58"], İnox: ["52", "62"], Altın: ["71", "85"] }),
  p("6007", "Nepal", "Boy Kulp", 47, boy, { Siyah: ["85", "89", "93", "98", "102", "106", "110"], Krom: ["106", "112", "117", "123", "128", "133", "139"], Altın: ["134", "142", "150", "158", "165", "173", "181"], Antik: ["147", "156", "165", "173", "182", "191", "199"] }, "40 / 320"),
  p("6008", "Tibet", "Boy Kulp", 49, boy, { Siyah: ["85", "89", "93", "98", "102", "106", "110"], Krom: ["106", "112", "117", "123", "128", "133", "139"], Altın: ["134", "142", "150", "158", "165", "173", "181"], Antik: ["147", "156", "165", "173", "182", "191", "199"] }, "40 / 320"),
  p("6010", "London", "Boy Kulp", 53, boy, { Siyah: ["66", "70", "74", "78", "82", "86", "91"], Krom: ["87", "92", "98", "103", "108", "114", "119"], Altın: ["114", "122", "130", "138", "146", "154", "162"], Antik: ["126", "134", "143", "152", "161", "169", "178"] }),
  p("6006", "Arya", "Boy Kulp", 55, boy, { Siyah: ["107", "111", "115", "119", "123", "128", "132"], Krom: ["128", "134", "139", "144", "150", "155", "161"], Altın: ["156", "164", "171", "179", "187", "195", "203"], Antik: ["171", "180", "189", "197", "206", "215", "223"] }, "40 / 320"),
  p("6004", "Madrid", "Boy Kulp", 57, boy, { Siyah: ["85", "89", "93", "98", "102", "106", "110"], Krom: ["106", "112", "117", "123", "128", "133", "139"], Altın: ["134", "142", "150", "158", "165", "173", "181"], Antik: ["147", "156", "165", "173", "182", "191", "199"] }, "40 / 320"),
  p("6005", "Milan", "Boy Kulp", 58, boy, { Siyah: ["85", "89", "93", "98", "102", "106", "110"], Krom: ["106", "112", "117", "123", "128", "133", "139"], Altın: ["134", "142", "150", "158", "165", "173", "181"], Antik: ["147", "156", "165", "173", "182", "191", "199"] }, "40 / 320"),
  p("4500", "Asport Askı", "Askı & Portmanto", 59, ["Askı"], { Siyah: ["45"], Krom: ["53"], Altın: ["77"] }, "100 / 1000"),
  p("4003/4503", "Mostar", "Askı & Portmanto", 60, ["Askı", "Portmanto"], { Siyah: ["44", "64"], Krom: ["49", "72"], Altın: ["71", "96"] }, "60–100 / 480–800"),
  p("4015/4515", "Boncuk", "Askı & Portmanto", 59, ["Askı", "Portmanto"], { Siyah: ["43", "57"], Krom: ["53", "75"], Altın: ["74", "94"] }, "50–75 / 400–600"),
  p("4001/4501", "Mali", "Askı & Portmanto", 60, ["Askı", "Portmanto"], { Siyah: ["39", "56"], Krom: ["44", "64"], Altın: ["65", "88"] }, "60–120 / 480–960"),
];

const categories = ["Tümü", "Zamak", "Düğme", "Boy Kulp", "Askı & Portmanto"] as const;

function ProductModal({ product, close }: { product: Product; close: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={close} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label={`${product.name} fiyatları`} onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Kapat">×</button>
        <div className="modal-top">
          <div className="modal-image"><img src={`/catalog/catalog-${String(product.image).padStart(3, "0")}.jpg`} alt={product.name} /></div>
          <div><span className="eyebrow">{product.category} · {product.code}</span><h2>{product.name}</h2><p>2026 katalog liste fiyatları</p></div>
        </div>
        <div className="price-table-wrap">
          <table className="price-table">
            <thead><tr><th>Renk / Ölçü</th>{product.sizes.map((size) => <th key={size}>{size}{/^\d/.test(size) ? " mm" : ""}</th>)}</tr></thead>
            <tbody>{product.colors.map((color) => <tr key={color}><th>{color}</th>{product.prices[color].map((price, index) => <td key={index}>{price},00 ₺</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="modal-note"><span>Kutu / Koli</span><strong>{product.box}</strong><a href={`https://wa.me/905322241664?text=${encodeURIComponent(`${product.code} ${product.name} hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noreferrer">WhatsApp’tan sor ↗</a></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Tümü");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [visible, setVisible] = useState(12);
  const filtered = useMemo(() => products.filter((product) => {
    const categoryMatch = activeCategory === "Tümü" || product.category === activeCategory;
    const textMatch = `${product.name} ${product.code}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"));
    return categoryMatch && textMatch;
  }), [activeCategory, query]);

  return (
    <main>
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="Trua ana sayfa"><b>trua</b><span>mobilya aksesuarları</span></a>
        <nav aria-label="Ana menü"><a href="#urunler">Ürünler</a><a href="#hakkimizda">Hakkımızda</a><a href="#iletisim">İletişim</a></nav>
        <a className="nav-cta" href="tel:+905322241664">Hemen Ara</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">TRUA · 2026 KOLEKSİYONU</span>
          <h1>Mobilyaya dokunan <em>son çizgi.</em></h1>
          <p>Estetik, dayanıklılık ve ustalıkla üretilen dolap kulpları, çekmece kulpları ve mobilya aksesuarları.</p>
          <div className="hero-actions"><a className="button primary" href="#urunler">Koleksiyonu keşfet <span>↓</span></a><a className="button ghost" href="/TRUA-2026-KATALOG.pdf" download>Kataloğu indir</a></div>
          <div className="hero-stats"><div><strong>{products.length}</strong><span>katalog modeli</span></div><div><strong>4+</strong><span>renk seçeneği</span></div><div><strong>2026</strong><span>güncel fiyatlar</span></div></div>
        </div>
        <div className="hero-art" aria-label="Trua ürün seçkisi">
          <div className="mosaic"></div>
          <div className="cover-card"><img src="/catalog/catalog-002.jpg" alt="Trua 2026 katalog kapağı" /></div>
          <div className="product-float float-one"><img src="/catalog/catalog-003.jpg" alt="Lort kulp" /></div>
          <div className="product-float float-two"><img src="/catalog/catalog-005.jpg" alt="Prens kulp" /></div>
          <span className="year-mark">’26</span>
        </div>
      </section>

      <section className="catalog-section" id="urunler">
        <div className="section-heading"><div><span className="eyebrow">ÜRÜN KATALOĞU</span><h2>Detaylarda fark yaratın.</h2></div><p>Katalogdaki tüm fiyatlar Türk Lirası cinsindedir. Ürünü seçerek renk ve ölçü bazında liste fiyatını görüntüleyin.</p></div>
        <div className="catalog-tools">
          <div className="filters" role="group" aria-label="Ürün kategorileri">{categories.map((category) => <button key={category} className={category === activeCategory ? "active" : ""} onClick={() => { setActiveCategory(category); setVisible(12); }}>{category}</button>)}</div>
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => { setQuery(e.target.value); setVisible(12); }} placeholder="Model veya kod ara" aria-label="Model veya kod ara" /></label>
        </div>
        <div className="product-grid">
          {filtered.slice(0, visible).map((product) => {
            const min = Math.min(...Object.values(product.prices).flat().map(Number));
            return <button className="product-card" key={`${product.code}-${product.name}`} onClick={() => setSelected(product)}>
              <div className="product-image"><img src={`/catalog/catalog-${String(product.image).padStart(3, "0")}.jpg`} alt={product.name} loading="lazy" /><span>{product.category}</span></div>
              <div className="product-info"><small>{product.code}</small><h3>{product.name}</h3><div className="product-meta"><span>{product.sizes.length} ölçü</span><span>{product.colors.length} renk</span></div><div className="price-row"><span>Başlangıç</span><strong>{min},00 ₺</strong><i>↗</i></div></div>
            </button>;
          })}
        </div>
        {filtered.length === 0 && <div className="empty">Aramanızla eşleşen ürün bulunamadı.</div>}
        {visible < filtered.length && <button className="load-more" onClick={() => setVisible((value) => value + 12)}>Daha fazla ürün göster <span>+{filtered.length - visible}</span></button>}
      </section>

      <section className="about" id="hakkimizda">
        <div className="about-visual"><img src="/catalog/catalog-016.jpg" alt="Trua Ezgi mobilya kulbu" /><div className="quality-stamp"><b>TRUA</b><span>Kalite odaklı üretim</span></div></div>
        <div className="about-copy"><span className="eyebrow">HAKKIMIZDA</span><h2>Tasarımdan üretime, her detayda <em>ustalık.</em></h2><p>Trua, mobilya aksesuarları imalatında öne çıkan bir marka olarak dolap ve çekmece kulpları üretiminde estetiği ve fonksiyonelliği harmanlar. Yılların deneyimiyle kalite odaklı üretimi benimser, her adımda müşteri memnuniyetini esas alır.</p><p>Modern ve klasik tasarımların yanında özel siparişlere açık ürün yelpazemizi; farklı renk, doku ve biçim seçenekleriyle sürekli geliştiriyoruz. Doğaya duyarlı üretim süreçleriyle uzun ömürlü, dayanıklı ve karakterli çözümler sunuyoruz.</p><div className="values"><div><b>01</b><span><strong>Kalite</strong>Uzun ömürlü malzeme ve titiz denetim</span></div><div><b>02</b><span><strong>Tasarım</strong>Her stile uyum sağlayan özgün çizgiler</span></div><div><b>03</b><span><strong>İş birliği</strong>Projelerinize uzun vadeli destek</span></div></div></div>
      </section>

      <section className="contact" id="iletisim">
        <div><span className="eyebrow">BİRLİKTE ÜRETELİM</span><h2>Projeniz için doğru detayı birlikte seçelim.</h2></div>
        <div className="contact-links"><a href="tel:+905322241664"><span>Telefon</span><strong>0 532 224 16 64</strong><i>↗</i></a><a href="mailto:info@tuanaaks.com"><span>E-posta</span><strong>info@tuanaaks.com</strong><i>↗</i></a><a href="https://www.tuanaaks.com" target="_blank" rel="noreferrer"><span>Web</span><strong>www.tuanaaks.com</strong><i>↗</i></a><a href="https://share.google/pNLsPmhvnkkRtUyts" target="_blank" rel="noreferrer"><span>Konum</span><strong>Google’da görüntüle</strong><i>↗</i></a></div>
      </section>

      <footer><a className="brand light" href="#top"><b>trua</b><span>mobilya aksesuarları</span></a><p>© 2026 Trua. Tüm hakları saklıdır.</p><a href="#top">Yukarı dön ↑</a></footer>
      {selected && <ProductModal product={selected} close={() => setSelected(null)} />}
    </main>
  );
}
