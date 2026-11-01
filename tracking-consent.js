/* Conteudo Sem Aparecer: consentimento para Analytics, Clarity e Meta Pixel.
   IDs exclusivos deste produto; nao instalar outros pixels nem eventos Purchase.
   Script carregado antes de app.js. A escolha pode ser alterada no rodape. */
(function () {
  'use strict';
  const STORAGE_KEY = 'conteudo_sem_aparecer_privacidade_v1';
  const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
  const GA4_ID = 'G-LNFQ75QREZ';
  const CLARITY_ID = 'z72tgim6r6';
  const META_PIXEL_ID = '2275722606706763';

  let active = { analytics: false, marketing: false };
  let analyticsLoaded = false;
  let clarityLoaded = false;
  let metaLoaded = false;

  function readChoice() {
    try {
      const data = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (data && typeof data.analytics === 'boolean' &&
          typeof data.marketing === 'boolean' &&
          typeof data.savedAt === 'number' && Date.now() - data.savedAt < MAX_AGE_MS) {
        return { analytics: data.analytics, marketing: data.marketing };
      }
    } catch (_) { /* Storage indisponivel: pedir escolha novamente. */ }
    return null;
  }

  function saveChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        analytics: choice.analytics,
        marketing: choice.marketing,
        savedAt: Date.now()
      }));
    } catch (_) { /* Navegacao e compra permanecem funcionando. */ }
  }

  function loadAnalytics(consent) {
    if (analyticsLoaded) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied'
      });
      return;
    }
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(script);
  }

  function loadClarity(consent) {
    if (clarityLoaded) return;
    clarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,'clarity','script',CLARITY_ID);
    window.clarity('consentv2', {
      ad_Storage: consent.marketing ? 'granted' : 'denied',
      analytics_Storage: 'granted'
    });
  }

  function loadMetaPixel() {
    if (metaLoaded) return;
    metaLoaded = true;
    (function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=true;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=true;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    })(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent','grant');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    window.fbq('track', 'ViewContent', {
      content_name: 'Conteudo Sem Aparecer',
      content_ids: ['8855018'],
      content_type: 'product',
      value: 47.90,
      currency: 'BRL'
    });
    // Purchase e InitiateCheckout sao enviados exclusivamente pela Hotmart.
  }

  function applyTracking(choice) {
    active = { analytics: !!choice.analytics, marketing: !!choice.marketing };
    if (active.analytics) {
      loadAnalytics(active);
      loadClarity(active);
    }
    if (active.marketing) {
      loadMetaPixel();
      if (analyticsLoaded) loadAnalytics(active);
      if (clarityLoaded) {
        window.clarity('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' });
      }
    }
  }

  const panel = document.createElement('section');
  panel.className = 'cookie-panel';
  panel.setAttribute('aria-label', 'Preferencias de privacidade');
  panel.innerHTML =
    '<strong>Privacidade e cookies</strong>' +
    '<p>Podemos usar Google Analytics e Clarity para entender a navegacao, e Meta Pixel para medir anuncios. Voce escolhe. A compra funciona sem aceitar.</p>' +
    '<div class="cookie-actions">' +
      '<button type="button" data-cookie-action="accept">Aceitar opcionais</button>' +
      '<button type="button" data-cookie-action="reject">Somente necessarios</button>' +
    '</div>' +
    '<button type="button" class="cookie-customize" data-cookie-action="customize" aria-expanded="false">Personalizar escolhas</button>' +
    '<div class="cookie-custom" hidden>' +
      '<label><input type="checkbox" data-cookie-analytics> Analise de visitas (GA4 e Clarity)</label>' +
      '<label><input type="checkbox" data-cookie-marketing> Publicidade (Meta Pixel)</label>' +
      '<button type="button" data-cookie-action="save">Salvar minhas escolhas</button>' +
    '</div>';
  const custom = panel.querySelector('.cookie-custom');
  const analyticsBox = panel.querySelector('[data-cookie-analytics]');
  const marketingBox = panel.querySelector('[data-cookie-marketing]');
  const toggle = panel.querySelector('[data-cookie-action="customize"]');

  function showPanel() {
    analyticsBox.checked = active.analytics;
    marketingBox.checked = active.marketing;
    custom.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = false;
    document.body.classList.add('cookie-choice-open');
  }

  function choose(choice) {
    const withdrawing = (active.analytics && !choice.analytics) || (active.marketing && !choice.marketing);
    saveChoice(choice);
    panel.hidden = true;
    document.body.classList.remove('cookie-choice-open');
    if (withdrawing) {
      // Recarrega para encerrar scripts de terceiros que ja foram carregados.
      window.location.reload();
      return;
    }
    applyTracking(choice);
  }

  panel.addEventListener('click', function (event) {
    const button = event.target.closest('[data-cookie-action]');
    if (!button) return;
    const action = button.dataset.cookieAction;
    if (action === 'accept') choose({ analytics: true, marketing: true });
    if (action === 'reject') choose({ analytics: false, marketing: false });
    if (action === 'customize') {
      custom.hidden = !custom.hidden;
      toggle.setAttribute('aria-expanded', String(!custom.hidden));
      if (!custom.hidden) analyticsBox.focus();
    }
    if (action === 'save') {
      choose({ analytics: analyticsBox.checked, marketing: marketingBox.checked });
    }
  });

  document.body.appendChild(panel);
  const footer = document.querySelector('.footer-right') || document.querySelector('footer');
  if (footer) {
    const preferences = document.createElement('button');
    preferences.className = 'cookie-preferences-link';
    preferences.type = 'button';
    preferences.textContent = 'Preferencias de privacidade';
    preferences.addEventListener('click', showPanel);
    footer.appendChild(preferences);
  }

  const saved = readChoice();
  if (saved) {
    panel.hidden = true;
    applyTracking(saved);
  } else {
    showPanel();
  }
}());
