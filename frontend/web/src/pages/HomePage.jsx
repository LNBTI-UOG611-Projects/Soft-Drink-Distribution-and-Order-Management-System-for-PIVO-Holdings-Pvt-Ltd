import { useEffect, useState } from 'react';
import { fetchCurrentUser, fetchFeaturedProducts } from '../lib/api.js';

const A = '/assets/';

const demoProducts = [
  {
    id: 'demo-mango',
    name: 'Mango Nectar',
    description: 'A juicy tropical favorite with a bright, cheerful taste.',
    image: `${A}mango-bottle.webp`,
    poster: `${A}poster-mango.png`,
    tag: 'Tropical taste',
    background: 'bg-[#fff0cc]',
  },
  {
    id: 'demo-mixed',
    name: 'Mixed Fruit Nectar',
    description: 'A colorful combination of fruity flavors for every mood.',
    image: `${A}mix-fruit-bottle.webp`,
    poster: `${A}poster-mix-fruit.png`,
    tag: 'Fruit medley',
    background: 'bg-[#ffe6ed]',
  },
  {
    id: 'demo-woodapple',
    name: 'Woodapple Nectar',
    description: 'A distinctive, locally inspired refreshment with rich flavor.',
    image: `${A}woodapple-bottle.webp`,
    poster: `${A}poster-woodapple.png`,
    tag: 'Local favorite',
    background: 'bg-[#f2e7da]',
  },
  {
    id: 'demo-aloe',
    name: 'Aloe Vera Nectar',
    description: 'A cool and refreshing option with a clean, light feel.',
    image: `${A}aloe-bottle.webp`,
    poster: `${A}poster-aloe.png`,
    tag: 'Refreshing',
    background: 'bg-[#e9f8dc]',
  },
];

function Arrow({ diagonal = false, className = 'h-5 w-5' }) {
  return diagonal ? (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10" /></svg>
  ) : (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
  );
}

const featureItems = [
  { icon: '01', heading: 'Explore products', copy: 'Discover the PIVO catalogue and find drinks that suit your customers.', tone: 'bg-[#fff0f5] text-pivo-red' },
  { icon: '02', heading: 'Order with ease', copy: 'Shop owners and sales representatives can place and manage orders online.', tone: 'bg-[#effbdd] text-pivo-green-dark' },
  { icon: '03', heading: 'Track every step', copy: 'Stay informed about order progress, dispatches and deliveries.', tone: 'bg-[#fff2e5] text-[#a55e24]' },
];

function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-pivo-border bg-white shadow-[0_10px_35px_rgba(31,41,55,0.035)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(195,0,74,0.1)]">
      <div className={`relative flex h-[255px] items-center justify-center overflow-hidden ${product.background}`}>
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#655b5c] shadow-sm">{product.tag}</span>
        <div className="absolute h-48 w-48 rounded-full bg-white/40" />
        <img src={product.image} alt={product.name} loading="lazy" className="relative h-[235px] w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105" />
      </div>
      <div className="relative min-h-[155px] px-5 pb-6 pt-5">
        <h3 className="pr-6 text-lg font-extrabold tracking-tight">{product.name}</h3>
        <p className="mt-2 max-w-[220px] pr-4 text-[13px] leading-6 text-pivo-muted">{product.description}</p>
        <a href="/products" aria-label={`View ${product.name} in product catalogue`} className="absolute bottom-5 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#fbe4ed] text-pivo-red transition-colors hover:bg-pivo-red hover:text-white"><Arrow diagonal className="h-4 w-4" /></a>
      </div>
    </article>
  );
}

function CampaignCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-pivo-border bg-white shadow-[0_10px_35px_rgba(31,41,55,0.045)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(31,41,55,0.12)]">
      <div className="overflow-hidden">
        <img
          src={product.poster}
          alt={`${product.name} promotional poster`}
          loading="lazy"
          className="h-[400px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-pivo-text">{product.name}</h3>
          <p className="mt-1 text-[13px] text-pivo-muted">Explore this PIVO flavor.</p>
        </div>
        <a href="/products" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbe4ed] text-pivo-red transition-colors hover:bg-pivo-red hover:text-white" aria-label={`Explore ${product.name}`}>
          <Arrow diagonal className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(demoProducts);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (import.meta.env.VITE_API_ENABLED !== 'true') return;
    let mounted = true;
    fetchFeaturedProducts().then((rows) => {
      if (!mounted || !Array.isArray(rows) || rows.length === 0) return;
      setProducts(rows.slice(0, 4).map((row, i) => ({
        ...demoProducts[i % demoProducts.length],
        id: row.id,
        name: row.name,
        description: row.description || demoProducts[i % demoProducts.length].description,
        image: row.image_url || demoProducts[i % demoProducts.length].image,
      })));
    }).catch(() => { /* Keep local homepage assets if the API is unavailable. */ });
    fetchCurrentUser().then((current) => { if (mounted) setUser(current); }).catch(() => { if (mounted) setUser(null); });
    return () => { mounted = false; };
  }, []);

  const destination = user ? '/dashboard' : '/signup';
  const dismiss = () => setMenuOpen(false);

  return (
    <div id="top" className="overflow-x-hidden bg-pivo-background font-sans text-pivo-text">
      <header className="sticky top-0 z-50 border-b border-[#f1e7eb] bg-white/95 shadow-[0_4px_18px_rgba(31,41,55,0.035)] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1240px] items-center justify-between px-5 sm:px-7 lg:px-10">
          <a href="#top" onClick={dismiss} className="flex items-center gap-2" aria-label="PIVO Holdings home">
            <img src={`${A}pivo-logo.png`} alt="PIVO logo" className="h-[53px] w-[86px] object-contain" />
            <span className="flex flex-col leading-none"><strong className="text-lg font-black tracking-[-0.05em] text-pivo-red">PIVO</strong><small className="mt-1 text-[9px] font-extrabold tracking-[0.27em] text-[#3f4954]">HOLDINGS</small></span>
          </a>
          <button type="button" className="rounded-lg p-2 text-pivo-text hover:bg-pivo-background lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="pivo-main-nav">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">{menuOpen ? <path d="M6 6 18 18M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}</svg>
          </button>
          <nav id="pivo-main-nav" aria-label="Main navigation" className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-[78px] flex-col gap-1 border-b border-pivo-border bg-white px-6 py-5 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <a onClick={dismiss} href="#top" className="rounded-lg px-3 py-3 text-[14px] font-bold text-pivo-red lg:px-0">Home</a>
            <a onClick={dismiss} href="#drinks" className="rounded-lg px-3 py-3 text-[14px] font-semibold text-[#59616b] hover:text-pivo-red lg:px-0">Our Drinks</a>
            <a onClick={dismiss} href="#campaigns" className="rounded-lg px-3 py-3 text-[14px] font-semibold text-[#59616b] hover:text-pivo-red lg:px-0">Campaigns</a>
            <a onClick={dismiss} href="#why-pivo" className="rounded-lg px-3 py-3 text-[14px] font-semibold text-[#59616b] hover:text-pivo-red lg:px-0">Why PIVO</a>
            <a onClick={dismiss} href="#about" className="rounded-lg px-3 py-3 text-[14px] font-semibold text-[#59616b] hover:text-pivo-red lg:px-0">About Us</a>
            {user ? <a onClick={dismiss} href="/dashboard" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pivo-red px-6 py-3 text-sm font-bold text-white hover:bg-pivo-dark lg:ml-2 lg:mt-0">Dashboard <Arrow diagonal className="h-4 w-4" /></a> : <>
              <a onClick={dismiss} href="/login" className="rounded-lg px-3 py-3 text-[14px] font-bold text-pivo-red lg:ml-2 lg:px-0">Sign In</a>
              <a onClick={dismiss} href="/signup" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pivo-red px-6 py-3 text-sm font-bold text-white shadow-[0_7px_20px_rgba(195,0,74,.19)] hover:bg-pivo-dark lg:mt-0">Get Started <Arrow diagonal className="h-4 w-4" /></a>
            </>}
          </nav>
        </div>
      </header>

      <main>
        <section aria-labelledby="hero-title" className="hero-ambient relative overflow-hidden bg-[#fffcfb]">
          <div className="mx-auto grid max-w-[1240px] items-center gap-7 px-5 pb-16 pt-14 sm:px-7 lg:min-h-[605px] lg:grid-cols-[1.02fr_.98fr] lg:gap-10 lg:px-10 lg:py-16">
            <div className="relative z-10 mx-auto max-w-[610px] text-center lg:mx-0 lg:text-left">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f9dce6] bg-[#fff1f6] px-4 py-2 text-[10px] font-extrabold tracking-[.17em] text-pivo-red sm:text-[11px]"><span className="h-2 w-2 rounded-full bg-pivo-green" /> FRESH FLAVORS. EASIER ORDERING.</p>
              <h1 id="hero-title" className="text-[clamp(43px,5.3vw,78px)] font-black leading-[1.08] tracking-[-0.055em] text-pivo-text">Refresh your day.<br /><span className="text-pivo-red">Stock with PIVO.</span></h1>
              <p className="mx-auto mt-6 max-w-[510px] text-[15px] leading-[1.9] text-pivo-muted sm:text-[17px] lg:mx-0">Explore PIVO&apos;s fruit drink range and discover a simpler way for shops to place orders, track deliveries and stay connected.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a href="#drinks" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pivo-red px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_12px_25px_rgba(195,0,74,.2)] transition-all hover:-translate-y-1 hover:bg-pivo-dark">Explore Our Drinks <Arrow /></a>
              </div>
              <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce2eb] text-xl" aria-hidden="true">🥭</span><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5f6d8] text-xl" aria-hidden="true">🍏</span><p className="text-left text-[12px] leading-5 text-pivo-muted"><strong className="block text-[13px] text-pivo-text">Made for everyday refreshment</strong>and convenient distribution</p></div>
            </div>
            <div className="hero-stage relative mx-auto flex h-[360px] w-full max-w-[575px] items-center justify-center overflow-hidden rounded-[38px] sm:h-[465px] lg:h-[490px]" aria-label="PIVO fruit drink bottles">
              <div className="absolute h-[76%] w-[70%] rounded-full border-[24px] border-pivo-green/15" />
              <div className="absolute h-[58%] w-[55%] rounded-full bg-pivo-green/15" />
              <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-pivo-green/20 blur-2xl" />
              <div className="absolute -bottom-10 left-2 h-32 w-32 rounded-full bg-pivo-red/15 blur-xl" />
              <span className="absolute right-[12%] top-[13%] text-4xl text-pivo-green sm:text-6xl" aria-hidden="true">✳</span>
              <span className="absolute bottom-[20%] left-[10%] text-3xl text-[#eca64b]" aria-hidden="true">✳</span>
              <img src={`${A}mix-fruit-bottle.webp`} alt="" className="hero-product absolute bottom-[12%] left-[8%] h-[62%] rotate-[-16deg] sm:left-[13%] sm:h-[65%]" />
              <img src={`${A}mango-bottle.webp`} alt="" className="hero-product absolute bottom-[9%] left-[36%] z-10 h-[80%] rotate-[2deg]" />
              <img src={`${A}aloe-bottle.webp`} alt="" className="hero-product absolute bottom-[12%] right-[8%] h-[61%] rotate-[14deg] sm:right-[13%] sm:h-[67%]" />
              <div className="absolute bottom-5 right-5 z-20 rotate-[-6deg] rounded-2xl bg-white/95 px-4 py-3 text-center shadow-lg sm:bottom-9 sm:right-9"><span className="block text-[9px] font-bold tracking-widest text-pivo-muted">A LITTLE JOY</span><strong className="block text-lg font-black text-pivo-red">IN EVERY SIP ✦</strong></div>
            </div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-pivo-red via-[#ed8fa9] to-pivo-green" />
        </section>

        <section aria-label="PIVO benefits" className="border-b border-[#edf0ea] bg-white"><div className="mx-auto grid max-w-[1240px] gap-4 px-5 py-5 text-center text-[12px] font-bold text-[#515963] sm:grid-cols-3 sm:gap-2 sm:px-7 lg:px-10"><div><span className="mr-2 text-lg text-pivo-green-dark">✳</span>Refreshing fruit drink range</div><div><span className="mr-2 text-lg text-pivo-green-dark">✓</span>Simple shop ordering</div><div><span className="mr-2 text-lg text-pivo-green-dark">↗</span>Order & delivery updates</div></div></section>

        <section id="drinks" className="scroll-mt-24 bg-white py-20 sm:py-24" aria-labelledby="drinks-title"><div className="mx-auto max-w-[1240px] px-5 sm:px-7 lg:px-10">
          <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-[11px] font-extrabold tracking-[.24em] text-pivo-green-dark">EXPLORE THE FLAVORS</p><h2 id="drinks-title" className="text-4xl font-black tracking-[-.055em] sm:text-5xl">Find your <span className="text-pivo-red">favorite sip.</span></h2><p className="mt-3 text-[14px] leading-7 text-pivo-muted">Explore the signature PIVO nectar collection, available in refreshing flavors.</p></div><a className="inline-flex items-center gap-2 self-start text-[14px] font-bold text-pivo-red hover:text-pivo-dark sm:self-auto" href="/products">View full catalogue <Arrow className="h-4 w-4" /></a></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div></section>

        <section id="campaigns" className="scroll-mt-24 bg-pivo-background py-20 sm:py-24" aria-labelledby="campaigns-title">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-7 lg:px-10">
            <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-[11px] font-extrabold tracking-[.24em] text-pivo-green-dark">FEATURED VISUALS</p>
                <h2 id="campaigns-title" className="text-4xl font-black tracking-[-.055em] sm:text-5xl">Promotional <span className="text-pivo-red">campaign highlights.</span></h2>
                <p className="mt-3 max-w-[680px] text-[14px] leading-7 text-pivo-muted">Explore the colors and flavors of our featured drinks.</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => <CampaignCard key={`${product.id}-poster`} product={product} />)}
            </div>
          </div>
        </section>

        <section id="why-pivo" className="scroll-mt-24 bg-white py-20 sm:py-24" aria-labelledby="why-title"><div className="mx-auto max-w-[1240px] px-5 sm:px-7 lg:px-10"><div className="mx-auto mb-11 max-w-xl text-center"><p className="mb-3 text-[11px] font-extrabold tracking-[.24em] text-pivo-green-dark">MORE THAN JUST A DRINK</p><h2 id="why-title" className="text-4xl font-black tracking-[-.055em] sm:text-5xl">A smarter way to <span className="text-pivo-red">stay stocked.</span></h2><p className="mt-4 text-sm leading-7 text-pivo-muted">The PIVO distribution platform is designed to make everyday ordering and fulfillment easier.</p></div><div className="grid gap-5 md:grid-cols-3">{featureItems.map((item) => <article key={item.icon} className="rounded-[24px] border border-[#f0edf0] bg-white p-8 transition-shadow hover:shadow-xl"><div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold ${item.tone}`}>{item.icon}</div><h3 className="text-[22px] font-extrabold tracking-tight">{item.heading}</h3><p className="mt-3 text-[13px] leading-7 text-pivo-muted">{item.copy}</p></article>)}</div></div></section>

        <section id="about" className="gradient-cta scroll-mt-24 relative overflow-hidden py-16 text-white sm:py-20" aria-labelledby="about-title"><div className="soft-pattern absolute inset-0 opacity-40" /><div className="relative mx-auto grid max-w-[1240px] items-center gap-8 px-5 sm:px-7 md:grid-cols-[1.2fr_.8fr] lg:px-10"><div><p className="mb-4 text-[11px] font-extrabold tracking-[.25em] text-[#ffbed2]">THE PIVO EXPERIENCE</p><h2 id="about-title" className="max-w-[650px] text-4xl font-black leading-tight tracking-[-.05em] sm:text-5xl">From first order to final delivery, <span className="text-[#caffaa]">keep things moving.</span></h2><p className="mt-5 max-w-[530px] text-[14px] leading-7 text-[#ffe0e9]">PIVO Holdings distributes drinks to shops. Our proposed system brings order placement, stock information and delivery tracking together in one connected experience.</p><a href={destination} className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-extrabold text-pivo-red hover:bg-[#fff5f8]">{user ? 'Open Your Dashboard' : 'Get Started'} <Arrow /></a></div><div className="relative mx-auto flex h-[245px] w-[280px] items-center justify-center sm:h-[310px] sm:w-[340px]"><div className="absolute h-64 w-64 rounded-full border border-white/30 shadow-[0_0_0_30px_rgba(255,255,255,.06),0_0_0_70px_rgba(255,255,255,.03)]" /><img src={`${A}woodapple-bottle.webp`} className="relative h-[275px] rotate-[-8deg] object-contain drop-shadow-2xl" alt="PIVO Woodapple Nectar bottle" /><span className="absolute right-0 top-3 text-5xl text-[#baf68d]" aria-hidden="true">✳</span></div></div></section>
      </main>

      <footer className="bg-white py-10"><div className="mx-auto max-w-[1240px] px-5 sm:px-7 lg:px-10"><div className="flex flex-col items-start justify-between gap-7 border-b border-pivo-border pb-8 md:flex-row md:items-center"><div className="flex items-center gap-3"><img src={`${A}pivo-logo.png`} alt="PIVO" className="h-14 w-20 object-contain" /><div><p className="text-[17px] font-black text-pivo-red">PIVO HOLDINGS</p><p className="text-[12px] text-pivo-muted">Refreshment, made easier.</p></div></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-[13px] font-semibold text-[#58616b]"><a href="#top" className="hover:text-pivo-red">Home</a><a href="#drinks" className="hover:text-pivo-red">Drinks</a><a href="#campaigns" className="hover:text-pivo-red">Campaigns</a><a href="#why-pivo" className="hover:text-pivo-red">Why PIVO</a><a href="#about" className="hover:text-pivo-red">About Us</a></nav></div><p className="pt-6 text-[12px] text-pivo-muted">© {new Date().getFullYear()} PIVO Holdings (Pvt) Ltd. All rights reserved.</p></div></footer>
    </div>
  );
}
