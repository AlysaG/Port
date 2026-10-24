(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const img = (src, alt) => {
    const i = el('img'); i.src = src; i.alt = alt || ''; i.loading = 'lazy';
    i.addEventListener('error', () => i.remove());
    i.addEventListener('load', () => { const ph = i.parentElement && i.parentElement.querySelector(':scope > .ph'); if (ph) ph.remove(); });
    return i;
  };

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav-toggle'), links = $('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', links.classList.toggle('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ---------- Render projects ---------- */
  const data = window.PROJECTS || [];
  const featured = $('#featured');
  if (featured) {
    data.filter(p => p.featured).slice(0, 3).forEach(p => {
      const row = el('article', 'prow reveal');
      const media = el('div', 'prow-media'); media.style.setProperty('--c', p.color);
      media.append(el('span', 'ph', p.title), img(p.image, p.title));
      const body = el('div', 'prow-body');
      const h = el('h3', null, p.title);
      const meta = el('p', 'prow-year', p.year);
      const d = el('p', 'prow-desc', p.desc);
      const r = el('p', 'prow-role'); r.append(el('strong', null, 'My role: '), document.createTextNode(p.role + ' · ' + p.job));
      body.append(meta, h, d, r);
      (p.links || []).forEach(l => { const a = el('a', 'prow-link', l.label + ' \u2197'); a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; body.append(a); });
      row.append(media, body); featured.append(row);
    });
  }

  const grid = $('#folderGrid'), modal = $('#modal');
  if (grid) {
    data.forEach(p => {
      const b = el('button', 'folder reveal'); b.type = 'button'; b.dataset.id = p.id;
      const art = el('div', 'folder-art');
      const peek = el('div', 'peek'); peek.style.setProperty('--c', p.color);
      peek.append(el('span', 'ph', p.title), img(p.image, p.title));
      art.append(el('div', 'back'), peek, el('div', 'front'));
      b.append(art, el('h3', null, p.title), el('div', 'yr', '[' + p.year + ']'));
      grid.append(b);
    });
  }
  if (modal) {
    const card = $('.modal-card', modal), media = $('.modal-media', modal);
    let last = null;
    const open = id => {
      const p = data.find(x => x.id === id); if (!p) return;
      last = document.activeElement;
      media.replaceChildren();
      [p.image, ...(p.gallery || [])].forEach(src => { const w = el('div', 'm-shot'); w.style.setProperty('--c', p.color); w.append(img(src, p.title)); media.append(w); });
      $('#m-year').textContent = p.year; $('#m-title').textContent = p.title; $('#m-desc').textContent = p.desc;
      $('#m-role').textContent = p.role; $('#m-job').textContent = p.job;
      const ml = $('#m-links'); ml.replaceChildren();
      (p.links || []).forEach(l => { const a = el('a', 'btn-link', l.label); a.href = l.url; a.target = '_blank'; a.rel = 'noopener'; ml.append(a); });
      modal.hidden = false; document.body.classList.add('no-scroll');
      requestAnimationFrame(() => modal.classList.add('show'));
      $('.modal-close', modal).focus();
    };
    const close = () => {
      modal.classList.remove('show'); document.body.classList.remove('no-scroll');
      setTimeout(() => { modal.hidden = true; }, 220);
      if (last) last.focus();
    };
    grid.addEventListener('click', e => { const f = e.target.closest('.folder'); if (f) open(f.dataset.id); });
    modal.addEventListener('click', e => { if (e.target.matches('.modal-backdrop, .modal-close, .modal-close *')) close(); });
    document.addEventListener('keydown', e => {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = card.querySelectorAll('button, a[href]'); if (!f.length) return;
        const first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Reveal + skill bars ---------- */
  const animateBars = root => root.querySelectorAll('.bar i[data-level]').forEach(b => { b.style.width = b.dataset.level + '%'; });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; e.target.classList.add('in'); animateBars(e.target); io.unobserve(e.target);
  }), { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(n => io ? io.observe(n) : (n.classList.add('in'), animateBars(n)));
  if (!io) animateBars(document);

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
