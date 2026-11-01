(function () {
  'use strict';
  const cfg = window.LANDING_CONFIG || {};
  const price = document.querySelector('[data-price]');
  if (price && cfg.priceLabel) price.textContent = cfg.priceLabel;
  const slot = document.querySelector('[data-checkout-slot]');
  const raw = typeof cfg.checkoutUrl === 'string' ? cfg.checkoutUrl.trim() : '';
  let url = null;
  try {
    if (raw) {
      const u = new URL(raw);
      if (u.protocol === 'https:' && (u.hostname === 'pay.hotmart.com' || u.hostname.endsWith('.hotmart.com'))) url = u;
    }
  } catch (_) { /* No checkout active until verified URL is configured. */ }
  if (url && slot) {
    const attrs = new URLSearchParams(window.location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','fbclid'].forEach(function (key) {
      if (attrs.has(key) && !url.searchParams.has(key)) url.searchParams.set(key, String(attrs.get(key)).slice(0,250));
    });
    const anchor = document.createElement('a');
    anchor.className = 'btn btn-gold btn-checkout';
    anchor.href = url.href;
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = cfg.checkoutLabel || 'Comprar com segurança';
    const note = document.createElement('p');
    note.textContent = 'Pagamento e entrega digital realizados pela Hotmart.';
    slot.replaceChildren(anchor, note);
  }
  const gallery = document.getElementById('gallery');
  const prev = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  const shift = dir => { if (gallery) gallery.scrollBy({left: dir * Math.min(380, gallery.clientWidth * .8), behavior: 'smooth'}); };
  if (prev) prev.addEventListener('click', () => shift(-1));
  if (next) next.addEventListener('click', () => shift(1));
  const year = document.getElementById('year');
  if (year) year.textContent = '2026';
}());
