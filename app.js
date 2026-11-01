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
  if (url && slot && cfg.checkoutEnabled === true) {
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
  if (url && slot && cfg.checkoutEnabled !== true) {
    const inactive = slot.querySelector('.btn-unavailable');
    const help = slot.querySelector('p');
    if (inactive) inactive.textContent = 'Aguardando liberação pela Hotmart';
    if (help) help.textContent = 'O produto já foi cadastrado. A compra será habilitada aqui após a Hotmart aprovar o produto e o checkout funcionar.';
  }
  // V1.4: entrada suave das secoes; conteudo permanece visivel sem suporte ao observer.
  const revealItems = document.querySelectorAll('[data-reveal]');
  document.documentElement.classList.add('js');
  if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
  // Previa ampliada via dialog nativo, com link direto para imagem como fallback.
  const previewDialog = document.getElementById('preview-dialog');
  const previewImage = previewDialog && previewDialog.querySelector('[data-preview-image]');
  const previewCaption = previewDialog && previewDialog.querySelector('[data-preview-caption]');
  document.querySelectorAll('.product-preview').forEach(link => {
    link.addEventListener('click', event => {
      if (!previewDialog || typeof previewDialog.showModal !== 'function' || !previewImage) return;
      event.preventDefault();
      const img = link.querySelector('img');
      previewImage.src = link.href;
      previewImage.alt = img ? img.alt : 'Material do guia';
      if (previewCaption) previewCaption.textContent = img ? img.alt : '';
      previewDialog.showModal();
    });
  });
  const previewClose = document.querySelector('[data-preview-close]');
  if (previewClose) previewClose.addEventListener('click', () => previewDialog.close());
  if (previewDialog) previewDialog.addEventListener('click', event => {
    if (event.target === previewDialog) previewDialog.close();
  });
  const gallery = document.getElementById('gallery');
  const prev = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  const shift = dir => { if (gallery) gallery.scrollBy({left: dir * Math.min(380, gallery.clientWidth * .8), behavior: 'smooth'}); };
  if (prev) prev.addEventListener('click', () => shift(-1));
  if (next) next.addEventListener('click', () => shift(1));
  const year = document.getElementById('year');
  if (year) year.textContent = '2026';
}());
