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
    anchor.dataset.track = 'checkout_oferta';
    anchor.href = url.href;
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = cfg.checkoutLabel || 'Comprar com segurança';
    const note = document.createElement('p');
    note.textContent = 'Pagamento e entrega digital realizados pela Hotmart.';
    slot.replaceChildren(anchor, note);

    // CTA flutuante utiliza a mesma URL validada (incluindo UTMs) do checkout principal.
    const floating = document.createElement('a');
    floating.className = 'floating-buy';
    floating.dataset.track = 'checkout_flutuante';
    floating.href = url.href;
    floating.rel = 'noopener noreferrer';
    floating.setAttribute('aria-label', 'Comprar agora o guia Conteúdo Sem Aparecer por ' + (cfg.priceLabel || 'R$ 47,90'));
    const floatingLabel = document.createElement('span');
    floatingLabel.textContent = 'Comprar agora';
    const floatingPrice = document.createElement('span');
    floatingPrice.className = 'floating-buy-price';
    floatingPrice.textContent = cfg.priceLabel || 'R$ 47,90';
    floating.append(floatingLabel, floatingPrice);
    document.body.appendChild(floating);

    // Surge depois do início da leitura e desaparece quando o checkout principal está visível.
    const refreshFloating = function () {
      const primary = slot.querySelector('.btn-checkout');
      const bounds = primary ? primary.getBoundingClientRect() : null;
      const primaryVisible = bounds && bounds.top < window.innerHeight - 25 && bounds.bottom > 30;
      const shouldShow = (window.scrollY || document.documentElement.scrollTop || 0) > 260 && !primaryVisible;
      floating.classList.toggle('is-visible', shouldShow);
    };
    let pendingFloatingFrame = false;
    const scheduleFloatingRefresh = function () {
      if (pendingFloatingFrame) return;
      pendingFloatingFrame = true;
      window.requestAnimationFrame(function () {
        pendingFloatingFrame = false;
        refreshFloating();
      });
    };
    window.addEventListener('scroll', scheduleFloatingRefresh, { passive: true });
    window.addEventListener('resize', scheduleFloatingRefresh);
    refreshFloating();
  }
  if (url && slot && cfg.checkoutEnabled !== true) {
    const inactive = slot.querySelector('.btn-unavailable');
    const help = slot.querySelector('p');
    if (inactive) inactive.textContent = 'Aguardando liberação pela Hotmart';
    if (help) help.textContent = 'O produto já foi cadastrado. A compra será habilitada aqui após a Hotmart aprovar o produto e o checkout funcionar.';
  }
  // Rastreio GA4: identifica a origem de cada acao sem criar Purchase ou InitiateCheckout.
  // "click" (saida do dominio) continua sendo medido automaticamente pelo GA4.
  document.addEventListener('click', function (event) {
    const element = event.target && event.target.closest ? event.target.closest('[data-track]') : null;
    if (!element || typeof window.gtag !== 'function') return;
    const id = element.dataset.track;
    if (!id) return;
    window.gtag('event', id.startsWith('checkout_') ? 'checkout_click' : 'cta_click', {
      cta_id: id
    });
  });

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
