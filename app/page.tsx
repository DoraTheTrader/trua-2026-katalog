"use client";

import { useMemo, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

type Product = {
  code: string;
  name: string;
  category: "Zamak" | "Düğme" | "Boy Kulp" | "Askı & Portmanto";
  sizes: string[];
  colors: string[];
  images?: string[];
};

const p = (
  code: string,
  name: string,
  category: Product["category"],
  sizes: string[],
  colors: string[],
  images?: string[],
): Product => ({ code, name, category, sizes, colors, images });

const productImages = (product: Product) => product.images ?? [
  `/products-hires/${product.code.replace("/", "-")}.jpg`,
];

const zamak4 = ["128", "160", "192", "224"];
const zamak3 = ["128", "160", "224"];
const zamak2 = ["96–128", "160–192"];
const boy = ["128", "160", "192", "224", "256", "288", "320"];

const products: Product[] = [
  p("3020", "Lort", "Zamak", zamak4, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3021", "Çizgili Lort", "Zamak", zamak4, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3018", "Prens", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3019", "Çizgili Prens", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3008", "Alfa", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3016", "Beta", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3011", "Kale", "Zamak", ["96–128", "160–192", "160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3005", "Kuvas", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3023", "Klas Gama", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3022", "Gama", "Zamak", zamak4, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3017", "Tiran", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3015", "Ezgi", "Zamak", zamak3, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3034", "Roma", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3035", "Çizgili Roma", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3036", "Babil", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3037", "Çizgili Babil", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3032", "Paris", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3033", "Bakü", "Zamak", zamak2, ["Siyah", "Krom", "İnox", "Altın"]),
  p("3007", "Rumeli", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3006", "Galata", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3038", "Lüx Safran", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3039", "Çizgili Lüx Safran", "Zamak", ["160"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3040", "Safran", "Zamak", ["160", "224"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3041", "Çizgili Safran", "Zamak", ["160", "224"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2500", "Yuvarlak Düz", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2600", "Kare Düz", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2501", "Yuvarlak Set", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2601", "Kare Set", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2502", "Yuvarlak Klas", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2602", "Kare Klas", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2503", "Yuvarlak Dalga", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2603", "Kare Dalga", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2504", "Yuvarlak Güneş", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("2604", "Kare Güneş", "Düğme", ["Standart"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3028", "Gondol", "Zamak", ["96", "128"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3024", "Favori", "Zamak", ["160", "224"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("3050", "Elf", "Zamak", ["160", "224"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("5000", "Tas Kulp", "Zamak", ["64", "96"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("5001", "Çizgili Tas Kulp", "Zamak", ["64", "96"], ["Siyah", "Krom", "İnox", "Altın"]),
  p("6007", "Nepal", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6007", "Çizgili Nepal", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6007-cizgili.jpg"]),
  p("6008", "Tibet", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6008", "Çizgili Tibet", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6008-cizgili.jpg"]),
  p("6010", "London", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6010", "Çizgili London", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6010-cizgili.jpg"]),
  p("6006", "Arya", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6006", "Çizgili Arya", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6006-cizgili.jpg"]),
  p("6004", "Madrid", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6004", "Çizgili Madrid", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6004-cizgili.jpg"]),
  p("6005", "Milan", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"]),
  p("6005", "Çizgili Milan", "Boy Kulp", boy, ["Siyah", "Krom", "Altın", "Antik"], ["/products-hires/6005-cizgili.jpg"]),
  p("4500", "Asport Askı", "Askı & Portmanto", ["Askı"], ["Siyah", "Krom", "Altın"]),
  p("4002/4502", "Bosna", "Askı & Portmanto", ["Askı", "Portmanto"], ["Siyah", "Krom", "Altın"], ["/products-hires/4002.jpg", "/products-hires/4502.jpg"]),
  p("4003/4503", "Mostar", "Askı & Portmanto", ["Askı", "Portmanto"], ["Siyah", "Krom", "Altın"], ["/products-hires/4003.jpg", "/products-hires/4503.jpg"]),
  p("4014/4514", "Noktalı", "Askı & Portmanto", ["Askı", "Portmanto"], ["Siyah", "Krom", "Altın"], ["/products-hires/4014.jpg", "/products-hires/4514.jpg"]),
  p("4015/4515", "Boncuk", "Askı & Portmanto", ["Askı", "Portmanto"], ["Siyah", "Krom", "Altın"], ["/products-hires/4015.jpg", "/products-hires/4515.jpg"]),
  p("4001/4501", "Mali", "Askı & Portmanto", ["Askı", "Portmanto"], ["Siyah", "Krom", "Altın"], ["/products-hires/4001.jpg", "/products-hires/4501.jpg"]),
];

const categories = ["Tümü", "Zamak", "Düğme", "Boy Kulp", "Askı & Portmanto"] as const;

function ProductModal({ product, close }: { product: Product; close: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={close} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label={`${product.name} seçenekleri`} onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close} aria-label="Kapat">×</button>
        <div className="modal-top">
          <div className={`modal-image${productImages(product).length > 1 ? " multi" : ""}`}>{productImages(product).map((image, index) => <img key={image} src={assetPath(image)} alt={`${product.name}${productImages(product).length > 1 ? ` ${index + 1}` : ""}`} />)}</div>
          <div><span className="eyebrow">{product.category} · {product.code}</span><h2>{product.name}</h2><p>Renk ve ölçü seçeneklerini inceleyin.</p></div>
        </div>
        <div className="product-options">
          <div className="option-block"><span>Ölçüler</span><div>{product.sizes.map((size) => <b key={size}>{size}{/^\d/.test(size) ? " mm" : ""}</b>)}</div></div>
          <div className="option-block"><span>Renkler</span><div>{product.colors.map((color) => <b key={color}>{color}</b>)}</div></div>
        </div>
        <div className="modal-note"><span>Projeniz için uygun seçenekleri birlikte belirleyelim.</span><a href={`https://wa.me/905322241664?text=${encodeURIComponent(`${product.code} ${product.name} hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noreferrer">WhatsApp’tan sor ↗</a></div>
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
          <span className="eyebrow">TRUA · KOLEKSİYONU</span>
          <h1>Mobilyaya dokunan <em>son çizgi.</em></h1>
          <p>Estetik, dayanıklılık ve ustalıkla üretilen dolap kulpları, çekmece kulpları ve mobilya aksesuarları.</p>
          <div className="hero-actions"><a className="button primary" href="#urunler">Koleksiyonu keşfet <span>↓</span></a><a className="button ghost" href="#iletisim">Bilgi alın <span>↗</span></a></div>
          <div className="hero-stats"><div><strong>{products.length}</strong><span>katalog modeli</span></div><div><strong>4+</strong><span>renk seçeneği</span></div></div>
        </div>
        <div className="hero-art" aria-label="Trua ürün seçkisi">
          <div className="mosaic"></div>
          <div className="cover-card"><img src={assetPath("/catalog/catalog-062.jpg")} alt="Trua katalog kapağı" /></div>
          <div className="product-float float-one"><img src={assetPath("/products-hires/3020.jpg")} alt="Lort kulp" /></div>
          <div className="product-float float-two"><img src={assetPath("/products-hires/3018.jpg")} alt="Prens kulp" /></div>
        </div>
      </section>

      <section className="catalog-section" id="urunler">
        <div className="section-heading"><div><span className="eyebrow">ÜRÜN KATALOĞU</span><h2>Detaylarda fark yaratın.</h2></div><p>Ürünleri model veya kodla arayın; her ürünün renk ve ölçü seçeneklerini tek dokunuşla inceleyin.</p></div>
        <div className="catalog-tools">
          <div className="filters" role="group" aria-label="Ürün kategorileri">{categories.map((category) => <button key={category} className={category === activeCategory ? "active" : ""} onClick={() => { setActiveCategory(category); setVisible(12); }}>{category}</button>)}</div>
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => { setQuery(e.target.value); setVisible(12); }} placeholder="Model veya kod ara" aria-label="Model veya kod ara" /></label>
        </div>
        <div className="product-grid">
          {filtered.slice(0, visible).map((product) => {
            return <button className="product-card" key={`${product.code}-${product.name}`} onClick={() => setSelected(product)}>
              <div className="product-image"><img src={assetPath(productImages(product)[0])} alt={product.name} loading="lazy" /><span>{product.category}</span></div>
              <div className="product-info"><small>{product.code}</small><h3>{product.name}</h3><div className="product-meta"><span>{product.sizes.length} ölçü</span><span>{product.colors.length} renk</span></div><div className="detail-row"><span>Ürünü incele</span><i>↗</i></div></div>
            </button>;
          })}
        </div>
        {filtered.length === 0 && <div className="empty">Aramanızla eşleşen ürün bulunamadı.</div>}
        {visible < filtered.length && <button className="load-more" onClick={() => setVisible((value) => value + 12)}>Daha fazla ürün göster <span>+{filtered.length - visible}</span></button>}
      </section>

      <section className="about" id="hakkimizda">
        <div className="about-visual"><img src={assetPath("/products-hires/3015.jpg")} alt="Trua Ezgi mobilya kulbu" /><div className="quality-stamp"><b>TRUA</b><span>Kalite odaklı üretim</span></div></div>
        <div className="about-copy"><span className="eyebrow">HAKKIMIZDA</span><h2>Tasarımdan üretime, her detayda <em>ustalık.</em></h2><p>Trua, mobilya aksesuarları imalatında öne çıkan bir marka olarak dolap ve çekmece kulpları üretiminde estetiği ve fonksiyonelliği harmanlar. Yılların deneyimiyle kalite odaklı üretimi benimser, her adımda müşteri memnuniyetini esas alır.</p><p>Modern ve klasik tasarımların yanında özel siparişlere açık ürün yelpazemizi; farklı renk, doku ve biçim seçenekleriyle sürekli geliştiriyoruz. Doğaya duyarlı üretim süreçleriyle uzun ömürlü, dayanıklı ve karakterli çözümler sunuyoruz.</p><div className="values"><div><b>01</b><span><strong>Kalite</strong>Uzun ömürlü malzeme ve titiz denetim</span></div><div><b>02</b><span><strong>Tasarım</strong>Her stile uyum sağlayan özgün çizgiler</span></div><div><b>03</b><span><strong>İş birliği</strong>Projelerinize uzun vadeli destek</span></div></div></div>
      </section>

      <section className="contact" id="iletisim">
        <div><span className="eyebrow">BİRLİKTE ÜRETELİM</span><h2>Projeniz için doğru detayı birlikte seçelim.</h2></div>
        <div className="contact-links"><a href="tel:+905322241664"><span>Telefon</span><strong>0 532 224 16 64</strong><i>↗</i></a><a href="mailto:info@tuanaaks.com"><span>E-posta</span><strong>info@tuanaaks.com</strong><i>↗</i></a><a href="https://www.tuanaaks.com" target="_blank" rel="noreferrer"><span>Web</span><strong>www.tuanaaks.com</strong><i>↗</i></a><a href="https://share.google/pNLsPmhvnkkRtUyts" target="_blank" rel="noreferrer"><span>Konum</span><strong>Google’da görüntüle</strong><i>↗</i></a></div>
      </section>

      <footer><a className="brand light" href="#top"><b>trua</b><span>mobilya aksesuarları</span></a><p>© Trua. Tüm hakları saklıdır.</p><a href="#top">Yukarı dön ↑</a></footer>
      {selected && <ProductModal product={selected} close={() => setSelected(null)} />}
    </main>
  );
}
