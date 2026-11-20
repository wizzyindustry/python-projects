(function() {
  function expose(settings) {
    window.WizzySettings = {
      formspreeUrl: (settings && settings.formspreeUrl) || '',
      siteName: (settings && settings.siteName) || '',
      tagline: (settings && settings.tagline) || '',
      metaDesc: (settings && settings.metaDesc) || ''
    };
  }

  let admin = null;
  let settings = {};
  try {
    const raw = localStorage.getItem('wizzyAdminData');
    if (raw) {
      admin = JSON.parse(raw);
      settings = admin.settings || {};
    }
  } catch (e) {}
  expose(settings);

  // === SEO Meta Tags ===
  if (settings.metaDesc) {
    let existing = document.querySelector('meta[name="description"]');
    if (!existing) {
      existing = document.createElement('meta');
      existing.name = 'description';
      document.head.appendChild(existing);
    }
    existing.content = settings.metaDesc;
  }
  if (settings.siteName) {
    let titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = settings.siteName + (settings.tagline && !titleEl.textContent.includes('|') ? ' | ' + settings.tagline : '');
  }

  // === Open Graph / Twitter Card Meta Tags ===
  var ogTags = [
    ['og:title', settings.siteName || document.title],
    ['og:description', settings.metaDesc || ''],
    ['og:type', 'website'],
    ['twitter:card', 'summary_large_image'],
    ['twitter:title', settings.siteName || document.title],
    ['twitter:description', settings.metaDesc || '']
  ];
  ogTags.forEach(function(pair) {
    var prop = pair[0], val = pair[1];
    if (!val) return;
    var sel = prop.indexOf('twitter:') === 0 ? 'meta[name="' + prop + '"]' : 'meta[property="' + prop + '"]';
    var el = document.querySelector(sel);
    if (!el) {
      el = document.createElement('meta');
      if (prop.indexOf('twitter:') === 0) el.name = prop;
      else el.setAttribute('property', prop);
      document.head.appendChild(el);
    }
    el.content = val;
  });

  const socialMap = {
    'github': settings.github || '#',
    'linkedin': settings.linkedin || '#',
    'whatsapp': settings.whatsapp || '#'
  };
  Object.keys(socialMap).forEach(key => {
    const links = document.querySelectorAll('a.social-' + key + ' , a[href="#social-' + key + '"], a[data-social="' + key + '"]');
    if (!links.length) {
      document.querySelectorAll('.social-links a, .footer-social a').forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        const inner = a.innerHTML.toLowerCase();
        if (href === '#' || href === '') {
          if (inner.includes(key)) a.href = socialMap[key];
        }
      });
    } else {
      links.forEach(a => { a.href = socialMap[key]; });
    }
  });

  // === Active page link (driven by data-nav on any nav element) ===
  const page = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('[data-nav]').forEach(function(el) {
    if (el.dataset.nav === page) {
      el.classList.add('is-active');
      el.setAttribute('aria-current', 'page');
    } else {
      el.classList.remove('is-active');
      el.removeAttribute('aria-current');
    }
  });
  document.querySelectorAll('footer a[href$="' + page + '"]').forEach(a => a.style.color = 'var(--gold)');

  // === Position the animated indicator under the active bottom-nav tab ===
  function positionIndicator() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;
    const indicator = nav.querySelector('.bottom-nav__indicator');
    const active = nav.querySelector('.bottom-nav__tab.is-active');
    if (!indicator) return;
    if (!active) { indicator.style.opacity = '0'; return; }
    const tabs = nav.querySelectorAll('.bottom-nav__tab');
    const idx = Array.prototype.indexOf.call(tabs, active);
    if (idx < 0) return;
    const width = 100 / tabs.length;
    indicator.style.width = width + '%';
    indicator.style.transform = 'translateX(' + (idx * 100) + '%)';
    indicator.style.opacity = '1';
  }
  positionIndicator();
  window.addEventListener('resize', positionIndicator);

  // === Resume button ===
  if (settings.resumeUrl) {
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
      resumeBtn.href = settings.resumeUrl;
      resumeBtn.download = 'resume.pdf';
    }
  }

  // === Back-to-top button ===
  var btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  btt.setAttribute('aria-label', 'Back to top');
  btt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.body.appendChild(btt);

  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { btt.classList.add('show'); } else { btt.classList.remove('show'); }
  });

  // === Form submissions: save to admin AND send to Formspree ===
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form.classList.contains('contact-form') && form.id !== 'newsletterForm') return;
    e.preventDefault();
    var fd = new FormData(form);

    if (form.classList.contains('contact-form')) {
      window.saveSubmission && window.saveSubmission({
        type: 'Contact',
        name: fd.get('name') || '',
        email: fd.get('email') || '',
        subject: fd.get('subject') || '',
        message: fd.get('message') || ''
      });
      var btn = form.querySelector('.submit-btn');
      if (btn) { btn.textContent = 'Sent!'; btn.disabled = true; }
    } else if (form.id === 'newsletterForm') {
      window.saveSubmission && window.saveSubmission({
        type: 'Newsletter',
        email: fd.get('email') || ''
      });
      var btn2 = form.querySelector('button');
      if (btn2) { btn2.textContent = 'Done!'; btn2.disabled = true; }
    }

    // Send to Formspree via sendBeacon (works from file://, no CORS issues)
    var formspreeUrl = (window.WizzySettings && window.WizzySettings.formspreeUrl) || '';
    if (formspreeUrl) {
      form.action = formspreeUrl;
      navigator.sendBeacon(formspreeUrl, fd);
    } else {
      // No Formspree URL configured yet — skip the network call but keep the local save.
      console.warn('Wizzy: formspreeUrl not configured; skipping email send.');
    }

    setTimeout(function() {
      [].forEach.call(form.querySelectorAll('button'), function(b) { b.textContent = b.classList.contains('submit-btn') ? 'Send Message' : 'Subscribe'; b.disabled = false; });
      form.reset();
    }, 3000);
  });

  // === Global form submission saver ===
  window.saveSubmission = function(data) {
    try {
      const raw = localStorage.getItem('wizzyAdminData');
      if (!raw) return;
      const admin = JSON.parse(raw);
      if (!admin.submissions) admin.submissions = [];
      admin.submissions.push({ id: Date.now(), date: new Date().toLocaleString(), read: false, ...data });
      localStorage.setItem('wizzyAdminData', JSON.stringify(admin));
    } catch(e) {}
  };
})();

// === Site Search ===
window.openSearch = function() {
  var overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('is-modal-open');
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    var input = document.getElementById('searchInput');
    if (input) { input.value = ''; input.focus(); }
  }, 200);
  document.getElementById('searchResults').innerHTML = '';
};

window.closeSearch = function() {
  var overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.classList.remove('is-modal-open');
  document.body.style.overflow = '';
};

window.runSearch = function(q) {
  q = q.trim().toLowerCase();
  var results = document.getElementById('searchResults');
  if (!q) { results.innerHTML = ''; return; }

  try {
    var raw = localStorage.getItem('wizzyAdminData');
    if (!raw) { results.innerHTML = '<div class="search-empty">No data to search.</div>'; return; }
    var admin = JSON.parse(raw);
    var hits = [];

    (admin.projects || []).forEach(function(p) {
      if ((p.title && p.title.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q)) || (p.techs || []).some(function(t) { return t.toLowerCase().includes(q); })) {
        hits.push({ title: p.title, desc: p.description, badge: p.category || 'Project', link: '/files/projects.html' });
      }
    });

    (admin.blogs || []).forEach(function(b) {
      if ((b.title && b.title.toLowerCase().includes(q)) || (b.description && b.description.toLowerCase().includes(q)) || (b.tag && b.tag.toLowerCase().includes(q)) || (b.content && b.content.toLowerCase().includes(q))) {
        hits.push({ title: b.title, desc: b.description, badge: 'Blog Â· ' + (b.tag || 'General'), link: null });
      }
    });

    if (!hits.length) {
      results.innerHTML = '<div class="search-empty">No results found for "' + esc(q) + '".</div>';
      return;
    }

    results.innerHTML = hits.map(function(h) {
      return '<div class="search-result-item" onclick="' + (h.link ? 'window.location.href=\'' + h.link + '\'' : 'closeSearch()') + '"><h4>' + esc(h.title) + '</h4><p>' + esc((h.desc || '').slice(0, 100)) + '</p><span class="search-badge">' + esc(h.badge) + '</span></div>';
    }).join('');
  } catch(e) {}
};

// === Lazy load images ===
(function() {
  function lazyImages() {
    document.querySelectorAll('img:not([loading])').forEach(function(img) {
      if (img.width > 100 || img.offsetWidth > 100 || img.closest('.preview-panel')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
  lazyImages();
  if (window.MutationObserver) {
    var obs = new MutationObserver(function() { lazyImages(); });
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }
})();

// === Page transition ===
(function() {
  document.body.classList.add('page-fade');
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http') || a.hasAttribute('download') || a.target === '_blank') return;
    e.preventDefault();
    document.body.classList.add('page-fade-out');
    setTimeout(function() { window.location.href = href; }, 250);
  });
})();

// === Ripple effect on bottom-nav tabs ===
(function() {
  document.querySelectorAll('.bottom-nav__tab').forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      var rect = this.getBoundingClientRect();
      var r = document.createElement('span');
      r.className = 'ripple';
      var size = Math.max(rect.width, rect.height) * 1.2;
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(r);
      setTimeout(function() { r.remove(); }, 500);
    });
  });
})();

// === Hamburger drawer ===
(function() {
  var btn = document.getElementById('hamburgerBtn');
  var dr = document.getElementById('drawer');
  var ov = document.getElementById('drawerOverlay');
  if (!btn || !dr || !ov) return;
  function open() { btn.classList.add('open'); dr.classList.add('open'); ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { btn.classList.remove('open'); dr.classList.remove('open'); ov.classList.remove('open'); document.body.style.overflow = ''; }
  btn.addEventListener('click', function() { if (dr.classList.contains('open')) close(); else open(); });
  ov.addEventListener('click', close);
})();

// === Cookie consent (show after 5min, once per day) ===
(function() {
  var today = new Date().toDateString();
  if (localStorage.getItem('cookieConsent') === today) return;
  setTimeout(function() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<p>This website uses cookies to improve your experience.</p><button class="cookie-btn">Accept</button>';
    banner.querySelector('.cookie-btn').addEventListener('click', function() {
      localStorage.setItem('cookieConsent', today);
      banner.remove();
    });
    document.body.appendChild(banner);
  }, 300000); // 5 minutes
})();

// Keyboard shortcut: Ctrl+K to open search
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault();
    var overlay = document.getElementById('searchOverlay');
    if (overlay && overlay.classList.contains('open')) { closeSearch(); }
    else { openSearch(); }
  }
  if (e.key === 'Escape') { closeSearch(); closeBlogModal(); }
});

function esc(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function escAttr(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}