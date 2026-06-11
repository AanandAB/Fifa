/* ═══════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — Premium JavaScript
   Lenis · Parallax · Card Tilt · Ripple · Scroll Progress
   Enhanced Mobile · Smart Particles · Keyboard Nav
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════
  //  CONFIGURATION
  // ══════════════════════════════════════════════════════════

  const CONFIG = {
    footballApiKey: 'YOUR_FOOTBALL_DATA_API_KEY',
    footballApiBase: 'https://api.football-data.org/v4',
    competitionCode: 'WC',
    gnewsApiKey: '9d0fda3cd8a1510d9769b6e5dc6b7c17',
    refreshInterval: 60000,
    newsRefreshInterval: 600000,
    cacheKey: 'fifa2026_cache',
    cacheTTL: 300000,
    fifaApiV3: 'https://api.fifa.com/api/v3',
    fifaCxmApi: 'https://cxm-api.fifa.com/fifaplusweb/api',
    fifaCompetitionId: '17',
    fifaSeason2026: null,
    fifaDashboardLaunch: new Date('2026-06-02T00:00:00Z'),
    tournamentKickoff: new Date('2026-06-11T19:00:00Z'),
    playerImgBase: 'https://api.fifa.com/api/v3/picture/players',
    flagImgBase: 'https://api.fifa.com/api/v3/picture/flags'
  };

  const DATA_SOURCE = { local: true, api: false, fifa: false, broadcaster: false };
  const DBG = (msg, data) => { if (window.console) console.log(`[FIFA2026] ${msg}`, data || ''); };

  // ══════════════════════════════════════════════════════════
  //  TIME CONVERSION: ET → IST  (+9h 30m)
  // ══════════════════════════════════════════════════════════

  function etToIST(timeStr) {
    if (!timeStr || timeStr === 'TBD' || timeStr === 'LIVE') return timeStr;
    const m = timeStr.match(/(\d{1,2}):(\d{2})\s*ET/i);
    if (!m) return timeStr;
    let h = parseInt(m[1]), min = m[2];
    h += 9;  // ET → IST: +9h 30m
    let extraMins = 30;
    let mins = parseInt(min) + extraMins;
    if (mins >= 60) { h += 1; mins -= 60; }
    const nextDay = h >= 24;
    h = h % 24;
    const ist = `${String(h).padStart(2,'0')}:${String(mins).padStart(2,'0')} IST`;
    return ist;
  }

  function formatTimeIST(timeStr) {
    const ist = etToIST(timeStr);
    if (!ist || ist === 'TBD' || ist === 'LIVE') return ist;
    if (ist.includes('IST')) return ist;
    return ist;
  }

  // ══════════════════════════════════════════════════════════
  //  LENIS — BUTTERY SMOOTH SCROLLING
  // ══════════════════════════════════════════════════════════

  let lenis;
  function initLenis() {
    if (typeof window.Lenis !== 'undefined') {
      lenis = new window.Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      DBG('Lenis smooth scrolling initialized');
    }
  }
  initLenis();

  // ══════════════════════════════════════════════════════════
  //  SCROLL PROGRESS BAR
  // ══════════════════════════════════════════════════════════

  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ══════════════════════════════════════════════════════════
  //  BACK TO TOP BUTTON
  // ══════════════════════════════════════════════════════════

  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    const visible = (window.scrollY || document.documentElement.scrollTop) > 400;
    backToTop.classList.toggle('visible', visible);
    backToTop.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.0 });
      else window.scrollTo({ top: 0 });
    });
  }
  updateBackToTop();

  // ══════════════════════════════════════════════════════════
  //  FLAG HELPERS
  // ══════════════════════════════════════════════════════════

  const FLAG_FALLBACKS = { 'gb': 'gb-eng', 'cw': 'cw' };
  function getFlag(name, size = 28) {
    const code = COUNTRY_CODES[name];
    if (!code) return `<span class="flag-emoji">${getTeamFlag(name)}</span>`;
    const h = Math.round(size * 0.75);
    const s = size > 40 ? 48 : size > 24 ? 28 : 18;
    return `<img src="https://flagcdn.com/${s}x${Math.round(s*0.75)}/${code}.png" alt="${name} flag" class="flag-img" width="${size}" height="${h}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<span class=\\'flag-emoji\\'>${getTeamFlag(name)}</span>'">`;
  }
  function getFlagSmall(n) { return getFlag(n, 18); }
  function getFlagMedium(n) { return getFlag(n, 28); }
  function getFlagLarge(n) { return getFlag(n, 42); }

  // ══════════════════════════════════════════════════════════
  //  CARD 3D TILT EFFECT
  // ══════════════════════════════════════════════════════════

  function initCardTilt() {
    const cards = document.querySelectorAll('.team-card, .player-card, .venue-card, .about-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  initCardTilt();

  // ══════════════════════════════════════════════════════════
  //  BUTTON RIPPLE EFFECT
  // ══════════════════════════════════════════════════════════

  function initRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }
  initRipple();

  // ══════════════════════════════════════════════════════════
  //  HERO PARALLAX
  // ══════════════════════════════════════════════════════════

  function initHeroParallax() {
    const stadium = document.getElementById('parallaxStadium');
    const hero = document.getElementById('hero');
    if (!stadium || !hero) return;

    function updateParallax() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const heroHeight = hero.offsetHeight;
      const factor = scrollTop / heroHeight;
      const parallaxY = factor * 60;
      stadium.style.transform = `translateY(${parallaxY}px)`;
    }

    document.addEventListener('scroll', updateParallax, { passive: true });
    if (lenis) {
      lenis.on('scroll', updateParallax);
    }
  }
  initHeroParallax();

  // ══════════════════════════════════════════════════════════
  //  PARTICLE BACKGROUND (Performance-Aware)
  // ══════════════════════════════════════════════════════════

  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    // Reduce count on mobile / low-power
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const COUNT = prefersReduced ? 0 : isMobile ? 25 : 60;

    if (COUNT === 0) { canvas.style.display = 'none'; return; }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.1
      });
    }

    let lastTime = 0;
    function draw(timestamp) {
      // Throttle to ~30fps for particles (saves battery)
      if (timestamp - lastTime < 33) { requestAnimationFrame(draw); return; }
      lastTime = timestamp;

      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '255,215,0';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent}, ${p.a})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${accent}, ${0.04 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  initParticles();

  // ══════════════════════════════════════════════════════════
  //  THEME CUSTOMIZER
  // ══════════════════════════════════════════════════════════

  const themeToggle = document.getElementById('themeToggle');
  const themePanel = document.getElementById('themePanel');
  const themeSwatches = document.querySelectorAll('.theme-swatch');
  const themeFlags = document.querySelectorAll('.theme-flag');

  function setTheme(name) {
    document.body.setAttribute('data-theme', name);
    localStorage.setItem('fifa2026_theme', name);
    themeSwatches.forEach(s => s.classList.toggle('active', s.dataset.theme === name));
    themeFlags.forEach(f => f.classList.toggle('active', f.dataset.theme === name));
    const goldSpan = document.querySelector('#heroTitle .gold');
    if (goldSpan) {
      const c = getComputedStyle(document.body).getPropertyValue('--accent').trim();
      goldSpan.style.background = `linear-gradient(90deg, ${c} 30%, #FFF 50%, ${c} 70%)`;
      goldSpan.style.backgroundSize = '200% auto';
      goldSpan.style.webkitBackgroundClip = 'text';
      goldSpan.style.webkitTextFillColor = 'transparent';
      goldSpan.style.backgroundClip = 'text';
    }
    // Update theme-color meta
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      const bg = getComputedStyle(document.body).getPropertyValue('--bg-primary').trim();
      themeMeta.setAttribute('content', bg || '#080c18');
    }
  }

  const savedTheme = localStorage.getItem('fifa2026_theme');
  if (savedTheme) setTheme(savedTheme);

  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = themePanel.classList.toggle('open');
    themeToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    themePanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });
  document.addEventListener('click', (e) => {
    if (!themePanel.contains(e.target) && e.target !== themeToggle) {
      themePanel.classList.remove('open');
      themeToggle.setAttribute('aria-expanded', 'false');
      themePanel.setAttribute('aria-hidden', 'true');
    }
  });
  themeSwatches.forEach(sw => sw.addEventListener('click', () => setTheme(sw.dataset.theme)));
  themeFlags.forEach(f => f.addEventListener('click', () => setTheme(f.dataset.theme)));

  // ══════════════════════════════════════════════════════════
  //  STADIUM AMBIANCE SOUND
  // ══════════════════════════════════════════════════════════

  let ambianceAudio = null;
  let ambianceActive = localStorage.getItem('fifa2026_ambiance') === 'on';
  const soundBtn = document.getElementById('soundToggle');

  function toggleAmbiance() {
    ambianceActive = !ambianceActive;
    localStorage.setItem('fifa2026_ambiance', ambianceActive ? 'on' : 'off');
    soundBtn.textContent = ambianceActive ? '🔊' : '🔇';
    if (ambianceActive) playAmbiance();
    else if (ambianceAudio) { ambianceAudio.stop?.(); if (ambianceAudio._ctx) ambianceAudio._ctx.close(); ambianceAudio = null; }
  }

  function playAmbiance() {
    if (!ambianceActive) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const dur = 4, sr = ctx.sampleRate, len = sr * dur;
      const buf = ctx.createBuffer(1, len, sr);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        d[i] = (Math.random() * 2 - 1) * 0.06;
        const pulse = Math.sin(t * Math.PI * 0.5) * 0.5 + 0.5;
        d[i] += Math.sin(t * 3.7) * Math.sin(t * 5.1) * 0.03;
        d[i] += (Math.random() * 2 - 1) * 0.015 * pulse;
        if (Math.random() < 0.0004) {
          for (let j = 0; j < 2500 && i + j < len; j++)
            d[i + j] += (Math.random() * 2 - 1) * 0.12 * (1 - j / 2500);
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buf; source.loop = true; source.connect(ctx.destination); source.start();
      ambianceAudio = source; ambianceAudio._ctx = ctx;
    } catch {}
  }

  if (ambianceActive) { soundBtn.textContent = '🔊'; document.addEventListener('click', playAmbiance, { once: true }); }
  soundBtn.addEventListener('click', toggleAmbiance);

  // ══════════════════════════════════════════════════════════
  //  BROADCAST UI
  // ══════════════════════════════════════════════════════════

  function updateBroadcastClock() {
    const el = document.getElementById('broadcastClock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }) + ' IST';
  }
  updateBroadcastClock();
  setInterval(updateBroadcastClock, 1000);

  // ══════════════════════════════════════════════════════════
  //  LIVE DATA ENGINE · Multi-Source Fallback Chain
  // ══════════════════════════════════════════════════════════

  let liveStatus = { online: false, lastUpdated: null, source: 'local' };
  const liveIndicator = document.getElementById('liveIndicator');
  const liveDot = document.querySelector('.live-dot');
  const liveText = document.getElementById('liveText');
  const bLiveDot = document.getElementById('bLiveDot');
  const bLiveLabel = document.getElementById('bLiveLabel');
  const footerUpdated = document.getElementById('footerUpdated');
  const broadcastCenter = document.getElementById('broadcastCenter');

  function setLiveStatus(online, source) {
    liveStatus.online = online;
    liveStatus.source = source || 'local';
    liveStatus.lastUpdated = new Date();
    if (liveDot) liveDot.classList.toggle('offline', !online);
    if (liveText) { liveText.textContent = online ? 'Live' : 'Offline'; liveText.classList.toggle('offline', !online); }
    if (bLiveDot) bLiveDot.classList.toggle('offline', !online);
    if (bLiveLabel) bLiveLabel.textContent = online ? 'LIVE DATA' : 'OFFLINE';
    if (broadcastCenter) broadcastCenter.textContent = online ? `● LIVE · ${source || 'API'}` : 'USA · CANADA · MEXICO';
    if (footerUpdated) footerUpdated.textContent = `Last updated: ${liveStatus.lastUpdated.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true, timeZone:'Asia/Kolkata' })} IST · Source: ${source || 'local database'}`;
    DATA_SOURCE.api = online;
    DATA_SOURCE.local = !online;
  }

  function cacheGet(key, ttl) {
    try {
      const raw = localStorage.getItem(CONFIG.cacheKey);
      if (!raw) return null;
      const cache = JSON.parse(raw);
      if (Date.now() - cache.timestamp > (ttl || CONFIG.cacheTTL)) return null;
      return cache.data[key];
    } catch { return null; }
  }
  function cacheSet(key, data) {
    try {
      const raw = localStorage.getItem(CONFIG.cacheKey);
      const cache = raw ? JSON.parse(raw) : { timestamp: Date.now(), data: {} };
      cache.timestamp = Date.now(); cache.data[key] = data;
      localStorage.setItem(CONFIG.cacheKey, JSON.stringify(cache));
    } catch {}
  }

  async function discoverFifaSeason() {
    if (CONFIG.fifaSeason2026) return CONFIG.fifaSeason2026;
    const cached = cacheGet('fifa_season_2026', 86400000);
    if (cached) { CONFIG.fifaSeason2026 = cached; return cached; }
    try {
      const resp = await fetch(`${CONFIG.fifaApiV3}/calendar/matches?competitionId=${CONFIG.fifaCompetitionId}&count=1&language=en-GB`);
      if (!resp.ok) return null;
      const data = await resp.json();
      let token = data.ContinuationToken;
      if (!token) return null;
      let found = null;
      for (let attempt = 0; attempt < 20; attempt++) {
        const r = await fetch(`${CONFIG.fifaApiV3}/calendar/matches?competitionId=${CONFIG.fifaCompetitionId}&count=100&language=en-GB`, {
          headers: { 'ContinuationToken': token }
        });
        if (!r.ok) break;
        const page = await r.json();
        const match = page.Results.find(m => {
          const desc = m.SeasonName?.[0]?.Description || '';
          return desc.includes('2026');
        });
        if (match) { found = match.IdSeason; break; }
        if (!page.ContinuationToken) break;
        if (page.ContinuationToken === token) break;
        token = page.ContinuationToken;
      }
      if (found) {
        CONFIG.fifaSeason2026 = found;
        cacheSet('fifa_season_2026', found);
      }
      return found;
    } catch { return null; }
  }

  async function fetchFifaMatches() {
    const season = await discoverFifaSeason();
    if (!season) return null;
    try {
      const resp = await fetch(`${CONFIG.fifaApiV3}/calendar/matches?idCompetition=${CONFIG.fifaCompetitionId}&idSeason=${season}&language=en-GB&count=300`);
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.Results || null;
    } catch { return null; }
  }

  async function fetchFifaStandings() {
    const season = await discoverFifaSeason();
    if (!season) return null;
    try {
      const resp = await fetch(`${CONFIG.fifaApiV3}/competitions/${CONFIG.fifaCompetitionId}/season/${season}/standings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'en-GB' })
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch { return null; }
  }

  async function fetchCxmMatches() {
    try {
      const resp = await fetch(`${CONFIG.fifaCxmApi}/tournament/mens-world-cup-2026/matches?language=en`);
      if (resp.ok) return await resp.json();
      const resp2 = await fetch(`${CONFIG.fifaCxmApi}/tournaments/mens-world-cup-2026/matches?language=en`);
      if (resp2.ok) return await resp2.json();
      return null;
    } catch { return null; }
  }

  async function fetchCxmStandings() {
    try {
      const resp = await fetch(`${CONFIG.fifaCxmApi}/tournament/mens-world-cup-2026/standings?language=en`);
      if (resp.ok) return await resp.json();
      return null;
    } catch { return null; }
  }

  async function fetchFootbalDataStandings() {
    if (CONFIG.footballApiKey === 'YOUR_FOOTBALL_DATA_API_KEY') return null;
    try {
      const resp = await fetch(`${CONFIG.footballApiBase}/competitions/${CONFIG.competitionCode}/standings`, {
        headers: { 'X-Auth-Token': CONFIG.footballApiKey }
      });
      return resp.ok ? await resp.json() : null;
    } catch { return null; }
  }

  async function fetchFootbalDataMatches() {
    if (CONFIG.footballApiKey === 'YOUR_FOOTBALL_DATA_API_KEY') return null;
    try {
      const resp = await fetch(`${CONFIG.footballApiBase}/competitions/${CONFIG.competitionCode}/matches`, {
        headers: { 'X-Auth-Token': CONFIG.footballApiKey }
      });
      return resp.ok ? await resp.json() : null;
    } catch { return null; }
  }

  async function fetchBroadcasterRosters() {
    const sources = [
      { name: 'FOX Sports', url: 'https://api.foxsports.com/soccer/fifa-world-cup/2026/teams' },
      { name: 'ESPN', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams' },
      { name: 'The Athletic', url: 'https://api.theathletic.com/soccer/world-cup/2026/teams' }
    ];
    for (const s of sources) {
      try {
        const resp = await fetch(s.url, { mode: 'cors' });
        if (resp.ok) {
          const data = await resp.json();
          if (data?.length || data?.teams?.length) return { source: s.name, data };
        }
      } catch {}
    }
    return null;
  }

  function getPlayerImgUrl(playerName, teamCode, size) {
    const s = size || 144;
    const nameSlug = playerName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    return `${CONFIG.playerImgBase}/fifa-${s}-${s}/${nameSlug}`;
  }

  function getFifaFlagUrl(countryCode, size) {
    const s = size || 144;
    return `${CONFIG.flagImgBase}/flags-${s}-${s}/${countryCode.toUpperCase()}`;
  }

  function processFifaMatches(fifaResults) {
    if (!fifaResults?.length) return null;
    const matchMap = {};
    fifaResults.forEach(m => {
      const homeName = m.Home?.TeamName?.[0]?.Description || m.PlaceHolderA || '';
      const awayName = m.Away?.TeamName?.[0]?.Description || m.PlaceHolderB || '';
      const date = (m.Date || '').split('T')[0];
      if (!date || !homeName || !awayName) return;
      if (!matchMap[date]) matchMap[date] = [];
      matchMap[date].push({
        home: homeName, away: awayName, date,
        time: (m.Date || '').split('T')[1]?.slice(0, 5) || 'TBD',
        venue: m.Stadium?.Name?.[0]?.Description || 'TBD',
        group: m.GroupName?.[0]?.Description || m.StageName?.[0]?.Description || '',
        status: m.MatchStatus === 0 ? 'SCHEDULED' : m.MatchStatus === 1 ? 'LIVE' : 'FINISHED',
        score: { home: m.HomeTeamScore, away: m.AwayTeamScore },
        homeScore: m.HomeTeamScore, awayScore: m.AwayTeamScore,
        stage: m.StageName?.[0]?.Description || '',
        id: m.IdMatch, winner: m.Winner
      });
    });
    return matchMap;
  }

  function processFifaStandings(standingsData) {
    if (!standingsData?.Results?.length) return null;
    const groupTables = {};
    standingsData.Results.forEach(g => {
      const groupName = g.GroupName?.[0]?.Description || g.IdGroup || '';
      if (g.Teams?.length) {
        groupTables[groupName] = g.Teams.map(row => ({
          name: row.TeamName?.[0]?.Description || '',
          position: row.Position || 0,
          played: row.Played || 0, won: row.Won || 0,
          drawn: row.Drawn || 0, lost: row.Lost || 0,
          goalsFor: row.GoalsFor || 0, goalsAgainst: row.GoalsAgainst || 0,
          goalDiff: (row.GoalsFor || 0) - (row.GoalsAgainst || 0),
          points: row.Points || 0
        }));
      }
    });
    return groupTables;
  }

  async function refreshLiveData() {
    const start = Date.now();
    let fifaMatches = null, fifaStandings = null;
    let fbMatches = null, fbStandings = null;
    let cxmData = null;
    let usedSource = null;

    try {
      const [fm, fs] = await Promise.all([fetchFifaMatches(), fetchFifaStandings()]);
      if (fm) fifaMatches = processFifaMatches(fm);
      if (fs) fifaStandings = processFifaStandings(fs);
      if (fifaMatches || fifaStandings) usedSource = 'FIFA API';
    } catch {}

    if (!usedSource) {
      try {
        cxmData = await fetchCxmMatches();
        if (cxmData?.matches?.length || cxmData?.data?.length) usedSource = 'FIFA+';
      } catch {}
    }

    if (!usedSource) {
      try {
        const [fbm, fbs] = await Promise.all([fetchFootbalDataMatches(), fetchFootbalDataStandings()]);
        if (fbm?.matches) fbMatches = fbm.matches;
        if (fbs?.standings) fbStandings = fbs.standings;
        if (fbMatches || fbStandings) usedSource = 'football-data.org';
      } catch {}
    }

    if (!usedSource) {
      const bc = await fetchBroadcasterRosters();
      if (bc) usedSource = bc.source;
    }

    if (!usedSource) {
      const cachedMatches = cacheGet('matches_map', 3600000);
      const cachedStandings = cacheGet('standings', 3600000);
      if (cachedMatches || cachedStandings) {
        if (cachedMatches) processLiveMatchMap(cachedMatches);
        if (cachedStandings) renderGroups(cachedStandings);
        setLiveStatus(true, 'cache');
        return;
      }
    }

    if (usedSource) {
      setLiveStatus(true, usedSource);
      if (fifaMatches) {
        cacheSet('matches_map', fifaMatches);
        processLiveMatchMap(fifaMatches);
      } else if (fbMatches) {
        processLiveMatches(fbMatches);
        cacheSet('matches_map', fbMatches);
      }
      if (fifaStandings) {
        cacheSet('standings', fifaStandings);
        renderGroups(fifaStandings);
      } else if (fbStandings) {
        processLiveStandings(fbStandings);
      }
    } else {
      setLiveStatus(false, 'local database');
    }
  }

  function processLiveStandings(standingsData) {
    const groupTables = {};
    standingsData.forEach(table => {
      let groupName = table.group || '';
      const m = groupName.match(/GROUP_([A-Z])/);
      if (m) groupName = `Group ${m[1]}`;
      if (table.table) {
        groupTables[groupName] = table.table.map(row => ({
          name: row.team.name, position: row.position, played: row.playedGames,
          won: row.won, drawn: row.draw, lost: row.lost,
          goalsFor: row.goalsFor, goalsAgainst: row.goalsAgainst,
          goalDiff: row.goalDifference, points: row.points, crest: row.team.crest
        }));
      }
    });
    cacheSet('standings', groupTables);
    renderGroups(groupTables);
  }

  function processLiveMatches(matchesData) {
    const matchMap = {};
    matchesData.forEach(m => {
      const home = m.homeTeam?.name || '', away = m.awayTeam?.name || '';
      const date = (m.utcDate || '').split('T')[0];
      if (!matchMap[date]) matchMap[date] = [];
      matchMap[date].push({
        home, away, date,
        time: (m.utcDate || '').split('T')[1]?.slice(0, 5) || 'TBD',
        venue: m.venue || 'TBD', group: '', status: m.status || 'SCHEDULED',
        score: m.score?.fullTime || {}, homeScore: m.score?.fullTime?.home, awayScore: m.score?.fullTime?.away
      });
    });
    cacheSet('matches_map', matchMap);
    processLiveMatchMap(matchMap);
  }

  function processLiveMatchMap(matchMap) {
    const active = document.querySelector('#filterBar .filter-btn.active[data-filter]');
    renderFixtures(active ? active.dataset.filter : 'all', document.getElementById('fixtureSearch')?.value || '');
  }

  // ══════════════════════════════════════════════════════════
  //  NAVIGATION
  // ══════════════════════════════════════════════════════════

  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navbar = document.getElementById('navbar');

  function closeMobileMenu() {
    navLinksContainer.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    if (mobileOverlay) mobileOverlay.classList.remove('show');
    if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'true');
  }

  function openMobileMenu() {
    navLinksContainer.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    if (mobileOverlay) mobileOverlay.classList.add('show');
    if (mobileOverlay) mobileOverlay.setAttribute('aria-hidden', 'false');
  }

  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      target.style.display = '';
      if (id === 'bracket') { setTimeout(buildBracket, 100); setTimeout(restoreBracketPicksUI, 300); }
      if (id === 'watch') setTimeout(initFallbackSystem, 100);
      if (id === 'stats' && typeof Chart !== 'undefined') setTimeout(initCharts, 100);
    }
    navLinks.forEach(a => { a.classList.toggle('active', a.dataset.section === id); if (a.dataset.section === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    closeMobileMenu();
    if (lenis) lenis.scrollTo(0, { immediate: true });
  }

  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); showSection(el.dataset.section); });
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('open')) closeMobileMenu();
      else openMobileMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  // ══════════════════════════════════════════════════════════
  //  KEYBOARD NAVIGATION
  // ══════════════════════════════════════════════════════════

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
    // Alt + number shortcuts for sections
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const shortcuts = { '1': 'hero', '2': 'fixtures', '3': 'groups', '4': 'bracket', '5': 'predictor', '6': 'quiz', '7': 'teams', '8': 'players', '9': 'venues', '0': 'stats' };
      const id = shortcuts[e.key];
      if (id && document.getElementById(id)) { e.preventDefault(); showSection(id); }
    }
    if (e.altKey && e.key === 't' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      themeToggle.click();
    }
  });

  // ══════════════════════════════════════════════════════════
  //  COUNTDOWN
  // ══════════════════════════════════════════════════════════

  function updateCountdown() {
    const matchDate = new Date('2026-06-11T19:00:00Z');
    const diff = matchDate - Date.now();
    if (diff <= 0) { ['days','hours','mins','secs'].forEach(id => { const el = document.getElementById('cd-'+id); if (el) el.textContent='00'; }); return; }
    const daysEl = document.getElementById('cd-days'), hoursEl = document.getElementById('cd-hours'), minsEl = document.getElementById('cd-mins'), secsEl = document.getElementById('cd-secs');
    if (daysEl) daysEl.textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
    if (hoursEl) hoursEl.textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
    if (minsEl) minsEl.textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    if (secsEl) secsEl.textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ══════════════════════════════════════════════════════════
  //  HERO TICKER
  // ══════════════════════════════════════════════════════════

  function buildTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    const allFixtures = [];
    Object.values(GROUPS).forEach(g => g.fixtures.forEach(f => allFixtures.push({...f, group: g.name})));
    const items = allFixtures.slice(0, 24).map(f =>
      `<span class="ticker-item">${getFlagSmall(f.home)} ${f.home} <span class="ticker-vs">vs</span> ${f.away} ${getFlagSmall(f.away)} <span class="ticker-group">${f.group}</span></span>`
    ).join('');
    track.innerHTML = items + items;
  }
  buildTicker();

  // ══════════════════════════════════════════════════════════
  //  HERO MATCH DAY
  // ══════════════════════════════════════════════════════════

  function renderHeroMatchDay() {
    const el = document.getElementById('heroMatchDay');
    if (!el) return;
    el.innerHTML = `
      <div class="hmd-badge">⚽ OPENING MATCH</div>
      <div class="hmd-teams"><span class="hmd-team">${getFlag('Mexico', 22)} Mexico</span><span class="hmd-vs">vs</span><span class="hmd-team">South Africa ${getFlag('South Africa', 22)}</span></div>
      <div class="hmd-meta">Estadio Azteca · June 11 · <span class="ist-time">00:30 IST</span> <span class="et-note">(15:00 ET)</span></div>
    `;
  }
  renderHeroMatchDay();

  // ══════════════════════════════════════════════════════════
  //  BROADCAST BOTTOM TICKER
  // ══════════════════════════════════════════════════════════

  function buildBroadcastTicker() {
    const track = document.getElementById('bbTrack');
    if (!track) return;
    const items = [];
    TEAMS.forEach(t => items.push(`<span class="bb-item">${getFlagSmall(t.name)} <span class="bb-accent">${t.name}</span> <span class="bb-sep">|</span> FIFA #${t.fifaRank} <span class="bb-sep">·</span> ${t.confederation}</span>`));
    items.push(`<span class="bb-item"><span class="bb-accent">⚽ 104 MATCHES</span> <span class="bb-sep">·</span> 48 TEAMS <span class="bb-sep">·</span> 16 VENUES <span class="bb-sep">·</span> 3 NATIONS</span>`);
    items.push(...items.map(i => i));
    track.innerHTML = items.join('');
  }
  buildBroadcastTicker();

  // ══════════════════════════════════════════════════════════
  //  FIXTURES
  // ══════════════════════════════════════════════════════════

  function renderFixtures(filter = 'all', search = '') {
    const container = document.getElementById('fixturesContainer');
    if (!container) return;
    const allFixtures = [];
    Object.entries(GROUPS).forEach(([key, g]) => g.fixtures.forEach(f => allFixtures.push({...f, group: g.name, groupKey: key})));
    const liveMatchMap = cacheGet('matches_map');
    let filtered = (filter === 'group' || filter === 'all') ? allFixtures : [];
    if (search) { const q = search.toLowerCase(); filtered = filtered.filter(f => f.home.toLowerCase().includes(q) || f.away.toLowerCase().includes(q) || f.venue.toLowerCase().includes(q) || f.group.toLowerCase().includes(q)); }
    const grouped = {};
    filtered.forEach(f => {
      if (!grouped[f.date]) grouped[f.date] = [];
      let scoreDisplay = 'vs', statusText = 'Upcoming';
      if (liveMatchMap?.[f.date]) {
        const live = liveMatchMap[f.date].find(m => m.home === f.home && m.away === f.away);
        if (live) {
          if (live.homeScore !== null && live.awayScore !== null) { scoreDisplay = `${live.homeScore} - ${live.awayScore}`; statusText = live.status === 'FINISHED' ? 'FT' : 'Live'; }
          if (live.status === 'FINISHED') statusText = 'FT';
          if (live.status === 'IN_PLAY' || live.status === 'PAUSED') statusText = '⚽ Live';
        }
      }
      grouped[f.date].push({...f, scoreDisplay, statusText});
    });
    const sortedDates = Object.keys(grouped).sort();
    if (sortedDates.length === 0) { container.innerHTML = '<div class="empty-state">No fixtures match your filter.</div>'; return; }
    let html = '';
    sortedDates.forEach(date => {
      const d = new Date(date + 'T12:00:00Z');
      html += `<div class="fixture-date-header">${d.toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric', year:'numeric', timeZone:'Asia/Kolkata' })}</div>`;
      grouped[date].forEach((f, i) => {
        const statusClass = f.statusText.includes('Live') ? 'live' : f.statusText === 'FT' ? 'ft' : '';
        const dispTime = etToIST(f.time);  const timeHTML = dispTime === 'TBD' ? '<span class="time">TBD</span>' : (f.time === dispTime ? `<span class="time">${f.time}</span>` : `<span class="time ist-time">${dispTime}</span> <span class="et-note">(${f.time})</span>`);  html += `<div class="match-card ${statusClass}" style="animation-delay:${(i%8)*60}ms"><div class="match-team home">${getFlagMedium(f.home)}<span>${f.home}</span></div><div class="match-score">${f.scoreDisplay}</div><div class="match-team away"><span>${f.away}</span>${getFlagMedium(f.away)}</div><div class="match-meta"><span class="group-badge">${f.group}</span>${timeHTML}<span class="venue">${f.venue}</span><span class="match-status ${statusClass}">${f.statusText}</span></div></div>`;
      });
    });
    container.innerHTML = html;
  }

  document.querySelectorAll('#filterBar .filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterBar .filter-btn[data-filter]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      renderFixtures(btn.dataset.filter, document.getElementById('fixtureSearch')?.value || '');
    });
  });
  document.getElementById('fixtureSearch')?.addEventListener('input', e => {
    const active = document.querySelector('#filterBar .filter-btn.active[data-filter]');
    renderFixtures(active ? active.dataset.filter : 'all', e.target.value);
  });
  renderFixtures();

  // ══════════════════════════════════════════════════════════
  //  GROUPS / POINTS TABLES
  // ══════════════════════════════════════════════════════════

  function renderGroups(liveTables) {
    const grid = document.getElementById('groupGrid');
    if (!grid) return;
    let html = '';
    Object.keys(GROUPS).forEach((key, gi) => {
      const g = GROUPS[key];
      const teams = g.teams.map(name => {
        const t = getTeam(name);
        let liveData = null;
        if (liveTables) Object.values(liveTables).forEach(table => { const found = table.find(row => row.name === name); if (found) liveData = found; });
        if (liveData) return { name, flag: t?.flag||'', rank: t?.fifaRank||0, p: liveData.played, w: liveData.won, d: liveData.drawn, l: liveData.lost, gf: liveData.goalsFor, ga: liveData.goalsAgainst, gd: liveData.goalDiff, pts: liveData.points };
        return { name, flag: t?.flag||'', rank: t?.fifaRank||0, p:0, w:0, d:0, l:0, gf:0, ga:0, gd:0, pts:0 };
      });
      teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
      html += `<div class="group-card" style="animation-delay:${gi*60}ms"><div class="group-card-title">${g.name}</div><table class="group-table"><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr></thead><tbody>`;
      teams.forEach((t, i) => {
        const posClass = i === 0 || i === 1 ? 'pos-1' : i === 2 ? 'pos-3' : 'pos-4';
        html += `<tr class="${posClass}"><td class="pos-num">${i+1}</td><td><div class="team-name-cell">${getFlagSmall(t.name)} ${t.name}</div></td><td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf}</td><td>${t.ga}</td><td>${t.gd}</td><td class="pts">${t.pts}</td></tr>`;
      });
      html += `</tbody></table></div>`;
    });
    grid.innerHTML = html;
  }
  renderGroups();

  // ══════════════════════════════════════════════════════════
  //  BRACKET — Build + Interactive Picks
  // ══════════════════════════════════════════════════════════

  let bracketPicks = JSON.parse(localStorage.getItem('fifa2026_bracket_picks') || '{}');

  function saveBracketPicks() { localStorage.setItem('fifa2026_bracket_picks', JSON.stringify(bracketPicks)); }

  function restoreBracketPicksUI() {
    document.querySelectorAll('.bm-team').forEach(slot => {
      const bm = slot.closest('.bm'); if (!bm) return;
      const r = parseInt(bm.dataset.round), m = parseInt(bm.dataset.match);
      const bot = slot.classList.contains('bm-bottom');
      const key = `r${r}_m${m}`;
      if (bracketPicks[key] && ((bot && bracketPicks[key].endsWith('_bot')) || (!bot && bracketPicks[key].endsWith('_top')))) {
        slot.classList.add('picked');
      } else slot.classList.remove('picked');
    });
  }

  function buildBracket() {
    const wrapper = document.getElementById('bracketWrapper');
    if (!wrapper) return;
    const ROW = 26, PAD = 18, COL_W = 150, CON_W = 40, TOTAL_SLOTS = 16, HEIGHT = PAD * 2 + TOTAL_SLOTS * ROW;
    function slotY(slot) { return PAD + slot * ROW; }
    function matchCenter(ri, mi) {
      const shift = Math.pow(2, ri) - 1;
      const top = mi * Math.pow(2, ri + 1) + shift;
      return (slotY(top) + slotY(top + 1)) / 2;
    }
    const roundData = [
      { label: 'ROUND OF 32', abbr: 'R32', matches: 8 },
      { label: 'ROUND OF 16', abbr: 'R16', matches: 4 },
      { label: 'QUARTERFINALS', abbr: 'QF', matches: 2 },
      { label: 'SEMIFINALS', abbr: 'SF', matches: 1 },
      { label: 'FINAL', abbr: 'FIN', matches: 1 }
    ];
    function buildPath(label, sub) {
      let h = `<div class="bp"><div class="bp-bar"><span class="bp-bar-label">${label}</span><span class="bp-bar-sub">${sub}</span></div><div class="bp-body">`;
      roundData.forEach((rd, ri) => {
        const isFinal = ri === roundData.length - 1;
        h += `<div class="bc" style="width:${COL_W}px;height:${HEIGHT}px"><div class="bc-header">${rd.abbr}</div><div class="bc-sub">${rd.label}</div>`;
        if (isFinal) {
          const cy = slotY(15) + ROW;
          h += `<div class="b-final" style="top:${cy - 22}px"><div class="b-final-icon">🏆</div><div class="b-final-title">CHAMPION</div><div class="b-final-sub">July 19 · MetLife</div></div>`;
        } else {
          for (let m = 0; m < rd.matches; m++) {
            const cy = matchCenter(ri, m);
            const topSlot = m * Math.pow(2, ri + 1) + Math.pow(2, ri) - 1;
            const t0y = slotY(topSlot);
            h += `<div class="bm" style="top:${t0y}px;height:${ROW * 2}px" data-round="${ri}" data-match="${m}"><div class="bm-team" tabindex="0" role="button">TBD</div><div class="bm-team bm-bottom" tabindex="0" role="button">TBD</div><div class="bm-num">#${m+1}</div>`;
            if (ri < roundData.length - 1 && m % 2 === 0) {
              const bmcy = matchCenter(ri, m + 1);
              const nextCY = matchCenter(ri + 1, Math.floor(m / 2));
              const pairMid = (cy + bmcy) / 2;
              const glowAttr = ri < 3 ? ' filter="url(#neonGlow)"' : '';
              h += `<svg class="bm-con" width="${CON_W}" height="${HEIGHT}" style="left:${COL_W}px;top:${-PAD}px;pointer-events:none;overflow:visible"${glowAttr}><line x1="0" y1="${cy}" x2="${CON_W}" y2="${cy}" stroke="rgba(var(--accent-rgb),0.25)" stroke-width="1.5"/><line x1="0" y1="${bmcy}" x2="${CON_W}" y2="${bmcy}" stroke="rgba(var(--accent-rgb),0.25)" stroke-width="1.5"/><line x1="${CON_W}" y1="${cy}" x2="${CON_W}" y2="${bmcy}" stroke="rgba(var(--accent-rgb),0.15)" stroke-width="1.5"/><line x1="${CON_W}" y1="${pairMid}" x2="${CON_W + 3}" y2="${pairMid}" stroke="rgba(var(--accent-rgb),0.35)" stroke-width="1.5"/></svg>`;
            }
            h += `</div>`;
          }
        }
        h += `</div>`;
        if (!isFinal) h += `<div class="bconn" style="width:${CON_W}px;height:${HEIGHT}px"></div>`;
      });
      h += `</div></div>`;
      return h;
    }
    let html = `<div class="brack"><div class="brack-title"><span class="gold">KNOCKOUT BRACKET</span> — FIFA WORLD CUP 2026</div><div class="brack-sub">ROUND OF 32 → ROUND OF 16 → QUARTERFINALS → SEMIFINALS → FINAL · JULY 19 @ METLIFE STADIUM</div>`;
    html += buildPath('▸ PATH A', 'Spain · Germany · France · Portugal half');
    html += buildPath('▸ PATH B', 'Argentina · Brazil · England · Netherlands half');
    html += `<div class="brack-foot">Click any slot to pick your winner · Your bracket is saved automatically</div></div>`;
    wrapper.innerHTML = html;

    // Re-init card tilt on new bracket elements
    setTimeout(initCardTilt, 400);
  }

  function toggleBracketSlot(slot) {
    const bm = slot.closest('.bm'); if (!bm) return;
    const r = parseInt(bm.dataset.round), m = parseInt(bm.dataset.match);
    const bot = slot.classList.contains('bm-bottom');
    const key = `r${r}_m${m}`;
    const label = bot ? 'TBD_bot' : 'TBD_top';
    if (bracketPicks[key] === label) {
      delete bracketPicks[key];
      slot.classList.remove('picked');
    } else {
      const sib = bot ? bm.querySelector('.bm-team:first-child') : bm.querySelector('.bm-team.bm-bottom');
      if (sib) { sib.classList.remove('picked'); delete bracketPicks[key]; }
      bracketPicks[key] = label;
      slot.classList.add('picked');
    }
    saveBracketPicks();
  }

  document.addEventListener('click', (e) => {
    const slot = e.target.closest('.bm-team');
    if (!slot) return;
    toggleBracketSlot(slot);
  });

  // ══════════════════════════════════════════════════════════
  //  LIVE BRACKET POPULATION — Fetch standings + auto-fill
  // ══════════════════════════════════════════════════════════

  // FIFA 2026 R32 bracket mapping: which group positions → which bracket slots
  // Source: Wikipedia + FIFA official schedule
  const BRACKET_MAP = [
    // PATH A
    {path:'A',slot:0, match:74, a:'1E', b:'3A/B/C/D/F'},
    {path:'A',slot:1, match:77, a:'1I', b:'3C/D/F/G/H'},
    {path:'A',slot:2, match:79, a:'1A', b:'3C/E/F/H/I'},
    {path:'A',slot:3, match:81, a:'1D', b:'3B/E/F/I/J'},
    {path:'A',slot:4, match:75, a:'1F', b:'2C'},
    {path:'A',slot:5, match:76, a:'1C', b:'2F'},
    {path:'A',slot:6, match:85, a:'1B', b:'3E/F/G/I/J'},
    {path:'A',slot:7, match:87, a:'1K', b:'3D/E/I/J/L'},
    // PATH B
    {path:'B',slot:0, match:73, a:'2A', b:'2B'},
    {path:'B',slot:1, match:78, a:'2E', b:'2I'},
    {path:'B',slot:2, match:80, a:'1L', b:'3E/H/I/J/K'},
    {path:'B',slot:3, match:82, a:'1G', b:'3A/E/H/I/J'},
    {path:'B',slot:4, match:84, a:'1H', b:'2J'},
    {path:'B',slot:5, match:86, a:'1J', b:'2H'},
    {path:'B',slot:6, match:83, a:'2K', b:'2L'},
    {path:'B',slot:7, match:88, a:'2D', b:'2G'},
  ];

  // Fetch live group standings from ESPN API
  async function fetchGroupStandings() {
    try {
      const resp = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/soccer/FIFA.WORLD/standings', {
        signal: AbortSignal.timeout(10000)
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      
      const groups = {};
      for (const child of data.children || []) {
        const groupName = child.name || '';
        const entries = child.standings?.entries || [];
        groups[groupName] = entries.map(e => ({
          team: e.team?.displayName || e.team?.shortDisplayName || '',
          abbr: e.team?.abbreviation || '',
          pts: parseInt(e.stats?.find(s => s.name === 'points')?.value || 0),
          gp:  parseInt(e.stats?.find(s => s.name === 'gamesPlayed')?.value || 0),
          gd:  parseInt(e.stats?.find(s => s.name === 'pointDifferential')?.value || 0),
          gs:  parseInt(e.stats?.find(s => s.name === 'goalsFor')?.value || 0),
          rank: parseInt(e.stats?.find(s => s.name === 'rank')?.value || 99),
        }));
      }
      return Object.keys(groups).length > 0 ? groups : null;
    } catch (e) {
      console.log('[FIFA2026] Standings fetch failed:', e.message);
      return null;
    }
  }

  // Determine which teams advance from group standings
  function calculateAdvancingTeams(groups) {
    const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    const winners = {}, runnersUp = {}, thirdPlace = [];
    
    for (const g of groupOrder) {
      const standings = groups[`Group ${g}`] || groups[g] || [];
      if (standings.length >= 2) {
        winners[g] = standings[0];
        runnersUp[g] = standings[1];
      }
      if (standings.length >= 3) {
        thirdPlace.push({ ...standings[2], group: g });
      }
    }
    
    // Sort 3rd place teams by pts, gd, gs
    thirdPlace.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gs - a.gs);
    const bestThirds = thirdPlace.slice(0, 8);
    
    return { winners, runnersUp, bestThirds };
  }

  // Map advancing teams to bracket slots
  function mapTeamsToBracket(advancing, groups) {
    const { winners, runnersUp, bestThirds } = advancing;
    // Sort third place by their group letter to match FIFA's bracket order
    const sortedThirds = [...bestThirds].sort((a, b) => a.group.localeCompare(b.group));
    
    function getTeam(code) {
      // Parse codes like '1E' (winner Group E), '2A' (runner-up A), '3C/D/F' (best 3rd from C/D/F)
      if (code.startsWith('1')) {
        const g = code.substring(1);
        return winners[g] || null;
      }
      if (code.startsWith('2')) {
        const g = code.substring(1);
        return runnersUp[g] || null;
      }
      if (code.startsWith('3')) {
        // Best 3rd place from specified groups
        const groups = code.substring(1).split('/');
        // Find the highest-ranked 3rd place from these groups
        for (const g of groups) {
          const match = bestThirds.find(t => t.group === g);
          if (match) return match;
        }
        return null;
      }
      return null;
    }
    
    const bracketTeams = {};
    for (const m of BRACKET_MAP) {
      const key = `${m.path}_${m.slot}`;
      bracketTeams[key] = {
        top: getTeam(m.a),
        bottom: getTeam(m.b),
        match: m.match,
        desc: `${m.a} vs ${m.b}`
      };
    }
    return bracketTeams;
  }

  // Populate bracket UI with team names
  function populateBracketUI(bracketTeams) {
    // Map team names to flag emojis
    const TEAM_FLAG_MAP = {};
    TEAMS.forEach(t => { TEAM_FLAG_MAP[t.name] = t.flag; });
    
    for (const [key, data] of Object.entries(bracketTeams)) {
      const [path, slotStr] = key.split('_');
      const slot = parseInt(slotStr);
      
      // Find the bracket match element
      // Path A slots are first 8, Path B are next 8 in the DOM
      const allPaths = document.querySelectorAll('.bp');
      const pathIndex = path === 'A' ? 0 : 1;
      const pathEl = allPaths[pathIndex];
      if (!pathEl) continue;
      
      // Find the R32 column (first .bc in this path)
      const bcEls = pathEl.querySelectorAll('.bc');
      const r32Col = bcEls[0];
      if (!r32Col) continue;
      
      // Find the match slots
      const bmEls = r32Col.querySelectorAll('.bm');
      const bmEl = bmEls[slot];
      if (!bmEl) continue;
      
      const topSlot = bmEl.querySelector('.bm-team:first-child');
      const bottomSlot = bmEl.querySelector('.bm-team.bm-bottom');
      
      if (data.top && topSlot) {
        const flag = TEAM_FLAG_MAP[data.top.team] || '';
        topSlot.innerHTML = `${flag} ${data.top.abbr || data.top.team}`;
        topSlot.title = `${data.top.team} — ${data.desc}`;
      }
      if (data.bottom && bottomSlot) {
        const flag = TEAM_FLAG_MAP[data.bottom.team] || '';
        bottomSlot.innerHTML = `${flag} ${data.bottom.abbr || data.bottom.team}`;
        bottomSlot.title = `${data.bottom.team} — ${data.desc}`;
      }
    }
  }

  // Main function: fetch standings and populate bracket
  async function refreshBracket() {
    const groups = await fetchGroupStandings();
    if (!groups) {
      console.log('[FIFA2026] No standings data yet — group stage in progress');
      return false;
    }
    
    const advancing = calculateAdvancingTeams(groups);
    const bracketTeams = mapTeamsToBracket(advancing, groups);
    populateBracketUI(bracketTeams);
    
    console.log('[FIFA2026] Bracket populated from live standings');
    return true;
  }

  // Hook into bracket build: auto-refresh after building
  const origBuildBracket = buildBracket;
  buildBracket = function() {
    origBuildBracket();
    // Auto-fetch standings after bracket renders
    setTimeout(refreshBracket, 500);
  };

  // Keyboard support for bracket
  document.addEventListener('keydown', (e) => {
    const slot = e.target.closest('.bm-team');
    if (!slot) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBracketSlot(slot);
    }
  });

  // ══════════════════════════════════════════════════════════
  //  TEAMS
  // ══════════════════════════════════════════════════════════

  function renderTeams(conf = 'all', search = '') {
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    let filtered = TEAMS;
    if (conf !== 'all') filtered = filtered.filter(t => t.confederation === conf);
    if (search) { const q = search.toLowerCase(); filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.group.toLowerCase().includes(q)); }
    let html = '';
    filtered.forEach((t, i) => {
      const confColor = getConfederationColor(t.confederation);
      html += `<div class="team-card" style="animation-delay:${(i%12)*40}ms"><div class="team-card-flag">${getFlagLarge(t.name)}</div><div class="team-card-name">${t.name}</div><div class="team-card-group">Group ${t.group} · ${t.confederation}</div><div class="team-card-rank">FIFA #${t.fifaRank}</div><div class="team-card-conf" style="background:${confColor}12;color:${confColor};border:1px solid ${confColor}25">${t.confederation}</div>${t.debut ? '<div class="team-card-debut">★ Debutant</div>' : ''}${t.isHost ? '<div class="team-card-debut" style="color:var(--accent)">🏠 Host Nation</div>' : ''}<div class="team-card-best">${t.previousBest || ''}</div></div>`;
    });
    grid.innerHTML = html || '<div class="empty-state">No teams match your filter.</div>';
    const statusEl = document.getElementById('teamSearchStatus');
    if (statusEl) statusEl.textContent = search ? `${filtered.length} team${filtered.length !== 1 ? 's' : ''} found` : '';
    // Re-init tilt for new cards
    setTimeout(initCardTilt, 100);
  }

  document.querySelectorAll('#confFilter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#confFilter .filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      renderTeams(btn.dataset.conf, document.getElementById('teamSearch')?.value || '');
    });
  });
  document.getElementById('teamSearch')?.addEventListener('input', e => {
    const active = document.querySelector('#confFilter .filter-btn.active');
    renderTeams(active ? active.dataset.conf : 'all', e.target.value);
  });
  renderTeams();

  // ══════════════════════════════════════════════════════════
  //  STAR PLAYERS
  // ══════════════════════════════════════════════════════════

  function renderPlayers() {
    const grid = document.getElementById('playerGrid');
    if (!grid || !PLAYERS) return;
    let html = '';
    PLAYERS.forEach((p, i) => {
      const initials = p.name.split(' ').map(w=>w[0]).join('').slice(0,2);
      const headshot = `<div class="player-headshot"><div class="player-headshot-bg" style="background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.3))"></div><span class="player-headshot-initials">${initials}</span><span class="player-headshot-flag">${p.img}</span></div>`;
      html += `<div class="player-card" style="animation-delay:${i*40}ms"><div class="player-rank">#${p.rank}</div>${headshot}<div class="player-name">${p.name}</div><div class="player-team">${p.team} · ${p.pos}</div><div class="player-meta"><span>🎂 ${p.age}</span><span>🏟 ${p.caps} caps</span><span>⚽ ${p.goals} goals</span></div><div class="player-style">${p.style}</div></div>`;
    });
    grid.innerHTML = html;
    setTimeout(initCardTilt, 100);
  }
  renderPlayers();

  // ══════════════════════════════════════════════════════════
  //  HEAD-TO-HEAD COMPARISON
  // ══════════════════════════════════════════════════════════

  function initCompare() {
    const selA = document.getElementById('compareA'), selB = document.getElementById('compareB'), grid = document.getElementById('compareGrid');
    if (!selA || !selB) return;
    function populate() {
      const opts = TEAMS.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
      selA.innerHTML = opts; selB.innerHTML = opts;
      const saved = localStorage.getItem('fifa2026_compare');
      if (saved) { try { const [a,b] = JSON.parse(saved); selA.value = TEAMS.some(t=>t.name===a)?a:'Spain'; selB.value = TEAMS.some(t=>t.name===b)?b:'Argentina'; } catch { selA.value='Spain'; selB.value='Argentina'; } }
      else { selA.value='Spain'; selB.value='Argentina'; }
    }
    populate();
    function render() {
      const a = getTeam(selA.value), b = getTeam(selB.value);
      if (!a||!b) { grid.innerHTML='<div class="compare-empty">Select two teams above to compare them side by side</div>'; return; }
      localStorage.setItem('fifa2026_compare', JSON.stringify([a.name,b.name]));
      const stats = [
        {label:'FIFA Rank',va:a.fifaRank,vb:b.fifaRank,lower:true},{label:'Group',va:a.group,vb:b.group},
        {label:'Confederation',va:a.confederation,vb:b.confederation},{label:'Previous Best',va:a.previousBest||'N/A',vb:b.previousBest||'N/A'},
        {label:'Host Nation',va:a.isHost?'✓':'—',vb:b.isHost?'✓':'—'},{label:'Debutant',va:a.debut?'✓':'—',vb:b.debut?'✓':'—'}
      ];
      let h = `<div class="compare-col"><h4>${getFlagLarge(a.name)}<br>${a.name}</h4>`;
      stats.forEach(s => { const w = s.lower && typeof s.va==='number'&&typeof s.vb==='number'?(s.va<s.vb?'a':s.vb<s.va?'b':''):''; h+=`<div class="${w==='a'?'compare-stat winner':'compare-stat'}"><span class="compare-stat-label">${s.label}</span><span class="compare-stat-val">${s.va}</span></div>`; });
      h+=`</div><div class="compare-divider"></div><div class="compare-col"><h4>${getFlagLarge(b.name)}<br>${b.name}</h4>`;
      stats.forEach(s => { const w = s.lower && typeof s.va==='number'&&typeof s.vb==='number'?(s.va<s.vb?'b':s.vb<s.va?'a':''):''; h+=`<div class="${w==='b'?'compare-stat winner':'compare-stat'}"><span class="compare-stat-label">${s.label}</span><span class="compare-stat-val">${s.vb}</span></div>`; });
      h+=`</div>`; grid.innerHTML = h;
    }
    selA.addEventListener('change', render); selB.addEventListener('change', render); render();
  }
  initCompare();

  // ══════════════════════════════════════════════════════════
  //  MATCH PREDICTOR
  // ══════════════════════════════════════════════════════════

  function initPredictor() {
    const grid = document.getElementById('predGrid');
    const totalEl = document.getElementById('predTotal');
    const correctEl = document.getElementById('predCorrect');
    const pctEl = document.getElementById('predPct');
    const resetBtn = document.getElementById('predReset');
    if (!grid) return;

    let predictions = JSON.parse(localStorage.getItem('fifa2026_predictions') || '{}');

    function updateStats() {
      const total = Object.keys(predictions).length;
      if (totalEl) totalEl.textContent = total;
      const mockResults = {
        'Mexico_South_Africa':'home','South_Korea_Czechia':'away','Canada_Bosnia_and_Herzegovina':'draw','Qatar_Switzerland':'away',
        'Brazil_Morocco':'home','Haiti_Scotland':'away','United_States_Paraguay':'home','Australia_Türkiye':'away',
        'Germany_Curaçao':'home','Ivory_Coast_Ecuador':'draw','Netherlands_Japan':'home','Sweden_Tunisia':'home',
        'Belgium_Egypt':'home','Iran_New_Zealand':'home','Spain_Cape_Verde':'home','Saudi_Arabia_Uruguay':'away',
        'France_Senegal':'home','Iraq_Norway':'away','Argentina_Algeria':'home','Austria_Jordan':'home',
        'Portugal_DR_Congo':'home','Uzbekistan_Colombia':'away','England_Croatia':'home','Ghana_Panama':'home'
      };
      let correct = 0;
      Object.entries(predictions).forEach(([key, pick]) => {
        if (mockResults[key] === pick) correct++;
      });
      if (correctEl) correctEl.textContent = correct;
      if (pctEl) pctEl.textContent = total > 0 ? Math.round((correct / total) * 100) + '%' : '0%';
    }

    function renderPredictor() {
      let html = '';
      Object.entries(GROUPS).forEach(([gk, g]) => {
        g.fixtures.forEach((f) => {
          const key = `${f.home.replace(/\s+/g,'_')}_${f.away.replace(/\s+/g,'_')}`;
          const picked = predictions[key] || '';
          html += `<div class="pred-match"><span class="pred-group">${gk}</span><div class="pred-teams">${getFlagSmall(f.home)} ${f.home} <span class="pred-vs">vs</span> ${f.away} ${getFlagSmall(f.away)}</div><div class="pred-pick"><button class="pred-btn ${picked==='home'?'active':''}" data-key="${key}" data-pick="home">${f.home}</button><button class="pred-btn ${picked==='draw'?'active':''}" data-key="${key}" data-pick="draw">Draw</button><button class="pred-btn ${picked==='away'?'active':''}" data-key="${key}" data-pick="away">${f.away}</button></div></div>`;
        });
      });
      grid.innerHTML = html;

      grid.querySelectorAll('.pred-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          const pick = btn.dataset.pick;
          if (predictions[key] === pick) delete predictions[key];
          else predictions[key] = pick;
          localStorage.setItem('fifa2026_predictions', JSON.stringify(predictions));
          renderPredictor();
          updateStats();
        });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all predictions?')) { predictions = {}; localStorage.removeItem('fifa2026_predictions'); renderPredictor(); updateStats(); }
      });
    }

    renderPredictor();
    updateStats();
  }
  initPredictor();

  // ══════════════════════════════════════════════════════════
  //  TOURNAMENT QUIZ
  // ══════════════════════════════════════════════════════════

  function initQuiz() {
    const qEl = document.getElementById('quizQuestion');
    const optEl = document.getElementById('quizOptions');
    const resultEl = document.getElementById('quizResult');
    const startBtn = document.getElementById('quizStart');
    const progressBar = document.getElementById('quizProgressBar');
    const timerEl = document.getElementById('quizTimer');
    if (!qEl) return;

    const quizData = [
      {q:'Which country has won the most World Cups?', opts:['Brazil','Germany','Italy','Argentina'], ans:0},
      {q:'How many teams are in the 2026 World Cup?', opts:['32','36','48','64'], ans:2},
      {q:'Which stadium hosts the 2026 Final?', opts:['Rose Bowl','SoFi Stadium','AT&T Stadium','MetLife Stadium'], ans:3},
      {q:'Who scored the most World Cup goals all-time?', opts:['Ronaldo','Miroslav Klose','Pelé','Messi'], ans:1},
      {q:'Which confederation has the most 2026 teams?', opts:['CONMEBOL','CAF','UEFA','AFC'], ans:2},
      {q:'What year was the first World Cup?', opts:['1928','1930','1934','1950'], ans:1},
      {q:'Which nation has played in every World Cup?', opts:['Germany','Italy','Brazil','Argentina'], ans:2},
      {q:'Which 2026 host has the most stadiums?', opts:['Canada','Mexico','United States','Costa Rica'], ans:2},
      {q:'Who won the 2022 World Cup?', opts:['France','Argentina','Brazil','Portugal'], ans:1},
      {q:'How many minutes is a standard match?', opts:['80','90','100','120'], ans:1}
    ];

    let state = { active: false, idx: 0, score: 0, timer: 30, timerId: null, answered: false };

    function stopQuiz() {
      state.active = false;
      if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }
    }

    function showQuestion() {
      const q = quizData[state.idx];
      qEl.textContent = q.q;
      optEl.innerHTML = q.opts.map((o, i) => `<div class="quiz-option" data-idx="${i}" tabindex="0" role="button">${o}</div>`).join('');
      resultEl.textContent = '';
      progressBar.style.width = `${((state.idx + 1) / quizData.length) * 100}%`;
      state.timer = 30;
      timerEl.textContent = '⏱ 30';
      timerEl.classList.remove('urgent');
      state.answered = false;

      optEl.querySelectorAll('.quiz-option').forEach(el => {
        el.addEventListener('click', () => handleAnswer(parseInt(el.dataset.idx)));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAnswer(parseInt(el.dataset.idx)); }
        });
      });

      if (state.timerId) clearInterval(state.timerId);
      state.timerId = setInterval(() => {
        state.timer--;
        timerEl.textContent = `⏱ ${state.timer}`;
        if (state.timer <= 5) timerEl.classList.add('urgent');
        if (state.timer <= 0) {
          clearInterval(state.timerId);
          state.timerId = null;
          if (!state.answered) handleAnswer(-1);
        }
      }, 1000);
    }

    function handleAnswer(idx) {
      if (state.answered || !state.active) return;
      state.answered = true;
      if (state.timerId) { clearInterval(state.timerId); state.timerId = null; }

      const q = quizData[state.idx];
      const opts = optEl.querySelectorAll('.quiz-option');
      opts.forEach((el, i) => {
        if (i === q.ans) el.classList.add('correct');
        if (i === idx && idx !== q.ans) el.classList.add('wrong');
      });

      if (idx === q.ans) { state.score++; resultEl.textContent = '✅ Correct!'; }
      else if (idx === -1) resultEl.textContent = `⏰ Time's up! Answer: ${q.opts[q.ans]}`;
      else resultEl.textContent = `❌ Wrong. Answer: ${q.opts[q.ans]}`;

      setTimeout(() => {
        state.idx++;
        if (state.idx >= quizData.length) {
          stopQuiz();
          qEl.textContent = `🏆 Quiz Complete!`;
          optEl.innerHTML = '';
          resultEl.textContent = `You scored ${state.score} / ${quizData.length}!`;
          timerEl.textContent = '🎯';
          progressBar.style.width = '100%';
          startBtn.textContent = 'Play Again';
          state.active = false;
        } else {
          showQuestion();
        }
      }, 1500);
    }

    startBtn.addEventListener('click', () => {
      if (state.active) return;
      stopQuiz();
      state = { active: true, idx: 0, score: 0, timer: 30, timerId: null, answered: false };
      startBtn.textContent = 'In Progress...';
      showQuestion();
    });
  }
  initQuiz();

  // ══════════════════════════════════════════════════════════
  //  NEWS
  // ══════════════════════════════════════════════════════════

  async function fetchNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="news-loading"><div class="loader"></div><span>Fetching latest World Cup news...</span></div>';
    let articles = null;
    try {
      articles = await fetchFifaNews();
      if (!articles) {
        const resp = await fetch(`https://gnews.io/api/v4/search?q=FIFA+World+Cup+2026&lang=en&max=12&token=${CONFIG.gnewsApiKey}`);
        if (resp.ok) { const d = await resp.json(); if (d.articles?.length) articles = d.articles; }
      }
    } catch {}
    if (!articles) { const cached = cacheGet('news'); articles = cached || getMockNews(); }
    cacheSet('news', articles);
    renderNews(articles, grid);
  }

  function getMockNews() {
    const now = Date.now();
    return [
      {title:'World Cup 2026: Complete Group Stage Preview — All 48 Teams Analyzed',description:'With just days until kickoff, we break down every group, key players, and predicted outcomes.',url:'#',image:null,source:{name:'FIFA.com'},publishedAt:new Date(now).toISOString()},
      {title:'Mexico vs South Africa to Open World Cup 2026 at Estadio Azteca',description:'The hosts kick off in front of 87,000 fans at the iconic Mexico City venue.',url:'#',image:null,source:{name:'ESPN'},publishedAt:new Date(now-3600000).toISOString()},
      {title:'MetLife Stadium Ready for Final — 82,500 Capacity Confirmed',description:'New Jersey prepares for the final on July 19 with enhanced security and transport.',url:'#',image:null,source:{name:'BBC Sport'},publishedAt:new Date(now-7200000).toISOString()},
      {title:'Spain Top FIFA Rankings Going into World Cup 2026',description:'La Roja sit atop the world rankings as they seek their second World Cup title.',url:'#',image:null,source:{name:'FIFA.com'},publishedAt:new Date(now-14400000).toISOString()},
      {title:'Four Nations Set for World Cup Debut in 2026',description:'Cape Verde, Curaçao, Jordan, and Uzbekistan debut on the biggest stage.',url:'#',image:null,source:{name:'The Athletic'},publishedAt:new Date(now-21600000).toISOString()},
      {title:'Argentina Aim to Defend Title — Are They Favorites Again?',description:"Scaloni's side come in as reigning champions with Messi's legacy secured.",url:'#',image:null,source:{name:'ESPN'},publishedAt:new Date(now-28800000).toISOString()},
    ];
  }

  function renderNews(articles, grid) {
    if (!articles?.length) { grid.innerHTML = '<div class="empty-state">No news available.</div>'; return; }
    const feature = articles[0], items = articles.slice(1, 7);
    let html = `<a href="${feature.url||'#'}" target="_blank" class="news-feature" rel="noopener"><div class="news-feature-img"><span class="news-img-placeholder">⚽</span></div><div class="news-feature-body"><div class="news-feature-title">${feature.title||''}</div><div class="news-feature-desc">${feature.description||''}</div><div class="news-meta"><span class="news-source">${feature.source?.name||'FIFA.com'}</span><span>${timeAgo(feature.publishedAt)}</span></div></div></a>`;
    items.forEach((item, i) => { html += `<a href="${item.url||'#'}" target="_blank" class="news-item" style="animation-delay:${i*60}ms" rel="noopener"><div class="news-item-img"><span class="news-img-placeholder">⚽</span></div><div class="news-item-title">${item.title||''}</div><div class="news-meta"><span class="news-source">${item.source?.name||'World Cup News'}</span><span>${timeAgo(item.publishedAt)}</span></div></a>`; });
    grid.innerHTML = html;
  }

  function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  }

  fetchNews();
  setInterval(fetchNews, CONFIG.newsRefreshInterval);

  // ══════════════════════════════════════════════════════════
  //  VENUES
  // ══════════════════════════════════════════════════════════

  function renderVenues(country = 'all') {
    const grid = document.getElementById('venueGrid');
    if (!grid) return;
    let filtered = VENUES;
    if (country !== 'all') filtered = VENUES.filter(v => v.country === country);
    let html = '';
    const maxCap = Math.max(...VENUES.map(v => v.capacity));
    filtered.forEach((v, i) => {
      let badge = '';
      if (v.isFinalVenue) badge = '<span class="venue-badge final">🏆 FINAL</span>';
      else if (v.isOpeningVenue) badge = '<span class="venue-badge opening">⚽ OPENER</span>';
      const cn = v.country === 'USA' ? 'United States' : v.country;
      const pct = Math.round((v.capacity / maxCap) * 100);
      html += `<div class="venue-card" style="animation-delay:${(i%8)*60}ms">${badge}<div class="venue-card-top">${getFlagMedium(cn)}<div class="venue-card-name">${v.name}</div></div><div class="venue-card-city">📍 ${v.city}</div><div class="venue-card-stats"><span class="venue-stat">🏟 <strong>${v.capacity.toLocaleString()}</strong></span><span class="venue-stat">📅 <strong>${v.matches}</strong> matches</span></div><div class="venue-card-progress"><div class="venue-card-progress-bar" style="width:${pct}%"></div></div></div>`;
    });
    grid.innerHTML = html || '<div class="empty-state">No venues match.</div>';
    setTimeout(initCardTilt, 100);
  }

  document.querySelectorAll('#countryFilter .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#countryFilter .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVenues(btn.dataset.country);
    });
  });
  renderVenues();

  // ══════════════════════════════════════════════════════════
  //  STATS / CHARTS
  // ══════════════════════════════════════════════════════════

  let chartsInited = false;
  function initCharts() {
    if (chartsInited) return;
    if (typeof Chart === 'undefined') {
      document.querySelectorAll('.chart-container').forEach(el => { if (!el.querySelector('.chart-fallback')) { const fb = document.createElement('div'); fb.className = 'chart-fallback'; fb.textContent = 'Chart library not loaded'; el.appendChild(fb); } });
      return;
    }
    chartsInited = true;
    Chart.defaults.color = '#8892A8';
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    const opts = { responsive: true, maintainAspectRatio: false };

    const c1 = document.getElementById('confChart');
    if (c1) new Chart(c1, { type: 'doughnut', data: { labels: ['UEFA (16)','CAF (9)','AFC (8)','CONMEBOL (6)','CONCACAF (6)','OFC (1)'], datasets: [{ data: [16,9,8,6,6,1], backgroundColor: ['#4361EE','#2ECC71','#FFD700','#E63946','#E67E22','#9B59B6'], borderColor: '#0f1628', borderWidth: 3 }] }, options: { ...opts, plugins: { legend: { position: 'right', labels: { padding: 10, usePointStyle: true, color: '#F0F2F5' } } } } });

    const c2 = document.getElementById('goalsChart');
    if (c2) new Chart(c2, { type: 'bar', data: { labels: Object.keys(GROUPS), datasets: [{ label: 'Avg Goals/Match', data: Object.keys(GROUPS).map(()=>+(Math.random()*2+1.5).toFixed(1)), backgroundColor: 'rgba(var(--accent-rgb),0.6)', borderColor: 'var(--accent)', borderWidth: 1, borderRadius: 4 }] }, options: { ...opts, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } }, x: { grid: { display: false } } } } });

    const c3 = document.getElementById('capacityChart');
    if (c3) { const sorted = [...VENUES].sort((a,b)=>b.capacity-a.capacity).slice(0,10); new Chart(c3, { type: 'bar', data: { labels: sorted.map(v=>v.name.replace(' Stadium','')), datasets: [{ label: 'Capacity', data: sorted.map(v=>v.capacity), backgroundColor: sorted.map(v=>v.isFinalVenue?'rgba(var(--accent-rgb),0.7)':'rgba(67,97,238,0.6)'), borderColor: sorted.map(v=>v.isFinalVenue?'var(--accent)':'#4361EE'), borderWidth: 1, borderRadius: 3 }] }, options: { ...opts, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { grid: { display: false } } } } }); }

    const c4 = document.getElementById('rankingChart');
    if (c4) { const ranges = ['Top 10','11-30','31-50','51-70','71-100']; const counts = [TEAMS.filter(t=>t.fifaRank<=10).length, TEAMS.filter(t=>t.fifaRank>10&&t.fifaRank<=30).length, TEAMS.filter(t=>t.fifaRank>30&&t.fifaRank<=50).length, TEAMS.filter(t=>t.fifaRank>50&&t.fifaRank<=70).length, TEAMS.filter(t=>t.fifaRank>70).length]; new Chart(c4, { type: 'doughnut', data: { labels: ranges.map((r,i)=>`${r} (${counts[i]})`), datasets: [{ data: counts, backgroundColor: ['#E63946','#FFD700','#4361EE','#2ECC71','#8892A8'], borderColor: '#0f1628', borderWidth: 3 }] }, options: { ...opts, plugins: { legend: { position: 'right', labels: { padding: 10, usePointStyle: true, color: '#F0F2F5' } } } } }); }
  }

  // ══════════════════════════════════════════════════════════
  //  TRIVIA
  // ══════════════════════════════════════════════════════════

  function initTrivia() {
    const qEl = document.getElementById('triviaQuestion'), aEl = document.getElementById('triviaAnswer'), hEl = document.getElementById('triviaHint'), revealBtn = document.getElementById('triviaReveal'), prevBtn = document.getElementById('triviaPrev'), nextBtn = document.getElementById('triviaNext'), counter = document.getElementById('triviaCounter');
    if (!qEl || !TRIVIA?.length) return;
    let idx = parseInt(localStorage.getItem('fifa2026_trivia_idx')) || 0, revealed = false;
    function show() {
      const t = TRIVIA[idx % TRIVIA.length];
      qEl.textContent = t.q; aEl.textContent = t.a; aEl.classList.remove('show'); hEl.textContent = ''; revealed = false;
      revealBtn.textContent = 'Reveal Answer';
      counter.textContent = `${(idx % TRIVIA.length) + 1} / ${TRIVIA.length}`;
    }
    revealBtn.addEventListener('click', () => {
      if (!revealed) { aEl.classList.add('show'); hEl.textContent = '💡 ' + TRIVIA[idx % TRIVIA.length].hint; revealBtn.textContent = 'Hide Answer'; revealed = true; }
      else { aEl.classList.remove('show'); hEl.textContent = ''; revealBtn.textContent = 'Reveal Answer'; revealed = false; }
    });
    prevBtn.addEventListener('click', () => { idx = idx > 0 ? idx - 1 : TRIVIA.length - 1; localStorage.setItem('fifa2026_trivia_idx', idx); show(); });
    nextBtn.addEventListener('click', () => { idx = (idx + 1) % TRIVIA.length; localStorage.setItem('fifa2026_trivia_idx', idx); show(); });
    show();
  }
  initTrivia();

  // ══════════════════════════════════════════════════════════
  //  CONFETTI
  // ══════════════════════════════════════════════════════════

  function fireConfetti(count = 50) {
    const colors = ['#FFD700','#E63946','#4361EE','#2ECC71','#FF6B9D','#E67E22','#9B59B6'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;pointer-events:none;z-index:9999;width:${5+Math.random()*5}px;height:${5+Math.random()*5}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};left:${Math.random()*100}vw;top:-10px;opacity:${0.6+Math.random()*0.3};transform:rotate(${Math.random()*360}deg);animation:confettiFall ${2+Math.random()*2}s ease-out forwards;animation-delay:${Math.random()*0.4}s;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }

  if (!document.getElementById('confettiStyle')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'confettiStyle';
    styleSheet.textContent = '@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }';
    document.head.appendChild(styleSheet);
  }

  // ══════════════════════════════════════════════════════════
  //  FIFA NEWS FEED
  // ══════════════════════════════════════════════════════════

  async function fetchFifaNews() {
    try {
      const resp = await fetch('https://api.fifa.com/api/v3/content/articles?competitionId=17&language=en-GB&count=12');
      if (resp.ok) {
        const data = await resp.json();
        const articles = data.Results?.map(a => ({
          title: a.Title?.[0]?.Description || '',
          description: (a.Subtitle?.[0]?.Description || a.Abstract?.[0]?.Description || '').replace(/<[^>]*>/g, ''),
          url: a.Url || `https://www.fifa.com/en/articles/${a.Id}`,
          image: a?.Thumbnail?.Url || a?.Image?.Url || null,
          source: { name: 'FIFA.com' },
          publishedAt: a.Date || new Date().toISOString()
        })).filter(a => a.title);
        if (articles?.length >= 3) return articles;
      }
    } catch {}
    return null;
  }

  function updateBroadcastDataStatus() {
    const now = Date.now();
    const launch = CONFIG.fifaDashboardLaunch.getTime();
    const kickoff = CONFIG.tournamentKickoff.getTime();
    const centerEl = document.getElementById('broadcastCenter');
    if (!centerEl) return;
    if (now >= kickoff) {
      centerEl.textContent = '● TOURNAMENT LIVE';
      centerEl.style.color = 'var(--accent)';
    } else if (now >= launch) {
      centerEl.textContent = '● OFFICIAL DATA ACTIVE';
      centerEl.style.color = 'var(--accent)';
    } else {
      const daysLeft = Math.ceil((launch - now) / 86400000);
      centerEl.textContent = `DASHBOARD LAUNCHES IN ${daysLeft}d`;
      centerEl.style.color = 'rgba(255,255,255,0.2)';
    }
  }

  function scheduleSeasonDiscovery() {
    let attempts = 0;
    const tryDiscover = async () => {
      const season = await discoverFifaSeason();
      if (season) {
        refreshLiveData();
      } else if (attempts < 10) {
        attempts++;
        const delay = Math.min(60000 * Math.pow(2, attempts), 3600000);
        setTimeout(tryDiscover, delay);
      }
    };
    setTimeout(tryDiscover, 10000);
  }

  // ══════════════════════════════════════════════════════════
  //  FOOTBALL TOUCHES — Goal Celebration, Whistle, Chants
  // ══════════════════════════════════════════════════════════

  // Goal Horn / Celebration
  let goalOverlay;
  function fireGoalCelebration(team) {
    if (!goalOverlay) {
      goalOverlay = document.createElement('div');
      goalOverlay.className = 'goal-overlay';
      goalOverlay.innerHTML = '<div class="goal-text">⚽ GOOOAL!</div>';
      document.body.appendChild(goalOverlay);
    }
    goalOverlay.classList.add('fire');
    fireConfetti(80);

    // Whistle sound
    playWhistle();

    setTimeout(() => goalOverlay.classList.remove('fire'), 2500);
  }

  // Whistle Audio
  function playWhistle() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }

  // Global goal celebration hook — press G key or click on any match score
  document.addEventListener('keydown', e => {
    if (e.key === 'g' && !e.target.closest('input,textarea,select')) {
      fireGoalCelebration('Home');
    }
  });

  // Click on match scores to trigger goal celebration
  document.addEventListener('click', e => {
    const score = e.target.closest('.match-score');
    if (score) fireGoalCelebration();
  });

  // Crowd Chant System
  const CHANTS = [
    'Olé, Olé, Olé! 🎵',
    'Vamos, vamos! 🔥',
    'Who are ya? Who are ya? 👀',
    'We are the champions! 🏆',
    'Come on you boys in gold! ⚽',
    'Defense! 🛡️ Defense! 🛡️',
    'Shoot! 💥 Shoot! 💥',
    "You\u2019ll Never Walk Alone! ❤️",
    'Allez, Allez, Allez! 🇫🇷',
    'Samba Brasil! 🇧🇷🎵'
  ];

  function initChantTicker() {
    // Add chant ticker to broadcast bottom
    const bbTrack = document.getElementById('bbTrack');
    if (!bbTrack) return;
    const chantItems = CHANTS.map(c => `<span class="bb-item"><span class="bb-accent">${c}</span></span>`);
    bbTrack.innerHTML = chantItems.join('') + chantItems.join('');
  }
  initChantTicker();

  // Formation Viewer — show team formation on team card hover
  function initFormationViewer() {
    const FORMATIONS = {
      '4-3-3': [
        {x:50,y:82},{x:25,y:65},{x:50,y:58},{x:75,y:65},
        {x:15,y:35},{x:50,y:30},{x:85,y:35},
        {x:25,y:10},{x:50,y:10},{x:75,y:10}
      ],
      '4-4-2': [
        {x:50,y:85},{x:25,y:68},{x:50,y:60},{x:75,y:68},
        {x:12,y:38},{x:38,y:38},{x:62,y:38},{x:88,y:38},
        {x:35,y:12},{x:65,y:12}
      ],
      '3-5-2': [
        {x:50,y:85},{x:22,y:70},{x:50,y:65},{x:78,y:70},
        {x:10,y:40},{x:30,y:35},{x:50,y:32},{x:70,y:35},{x:90,y:40},
        {x:35,y:10},{x:65,y:10}
      ]
    };

    // Add formation to comparison section
    const compareSection = document.querySelector('.compare-section');
    if (!compareSection) return;

    const formationContainer = document.createElement('div');
    formationContainer.className = 'compare-col';
    formationContainer.style.cssText = 'max-width: 320px; margin: 20px auto 0; text-align: center;';
    formationContainer.innerHTML = `
      <h4 style="font-family:'Barlow Condensed',sans-serif; font-size:0.85rem; color:var(--accent); margin-bottom:8px;">⚽ TACTICAL FORMATION (4-3-3)</h4>
      <div class="formation-pitch" id="formationPitch">
        <div class="formation-circle"></div>
      </div>
      <div style="display:flex; gap:6px; justify-content:center; margin-top:10px;">
        <button class="whistle-btn formation-select active" data-formation="4-3-3">4-3-3</button>
        <button class="whistle-btn formation-select" data-formation="4-4-2">4-4-2</button>
        <button class="whistle-btn formation-select" data-formation="3-5-2">3-5-2</button>
      </div>
      <div style="margin-top:12px;">
        <button class="whistle-btn" id="whistleBtn">🔔 WHISTLE</button>
        <button class="whistle-btn" id="goalBtn" style="margin-left:6px;">⚽ GOAL!</button>
      </div>
      <div class="chant-ticker"><span class="chant-text">${CHANTS.join(' · ')}</span></div>
    `;
    compareSection.appendChild(formationContainer);

    // Render formation
    const pitch = document.getElementById('formationPitch');
    let currentFormation = '4-3-3';

    function renderFormation(name) {
      if (!pitch) return;
      const dots = FORMATIONS[name];
      const existing = pitch.querySelectorAll('.formation-dot');
      existing.forEach(d => d.remove());

      dots.forEach((pos, i) => {
        const dot = document.createElement('div');
        dot.className = 'formation-dot';
        dot.style.left = `${pos.x}%`;
        dot.style.top = `${pos.y}%`;
        dot.textContent = i === 0 ? 'GK' : i;
        pitch.appendChild(dot);
      });
    }

    renderFormation('4-3-3');

    // Formation switchers
    document.querySelectorAll('.formation-select').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.formation-select').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFormation = btn.dataset.formation;
        renderFormation(currentFormation);
        const h4 = formationContainer.querySelector('h4');
        if (h4) h4.textContent = `⚽ TACTICAL FORMATION (${currentFormation})`;
      });
    });

    // Whistle button
    document.getElementById('whistleBtn')?.addEventListener('click', playWhistle);

    // Goal button
    document.getElementById('goalBtn')?.addEventListener('click', () => fireGoalCelebration());

    // Random formation on team compare change
    document.getElementById('compareA')?.addEventListener('change', () => {
      const formations = Object.keys(FORMATIONS);
      const random = formations[Math.floor(Math.random() * formations.length)];
      document.querySelector(`.formation-select[data-formation="${random}"]`)?.click();
    });
  }
  initFormationViewer();

  // ── Free Stream Providers (click to open in new tab) ──
  const STREAM_PROVIDERS = [
    { id: 'epicsports', name: 'EpicSports.in',       icon: '⚽', url: 'https://www.epicsports.in/',     type: 'external', tag: 'RECOMMENDED', tagClass: 'live' },
    { id: 'epicsports2',name: 'EpicSports Live',      icon: '📡', url: 'https://live.epicsportss.com/',  type: 'external', tag: 'IST TIMES', tagClass: 'ist' },
    { id: 'cricfree',   name: 'CricFree.live',        icon: '🏏', url: 'https://cricfree.live/',         type: 'external', tag: 'HD', tagClass: 'hd' },
    { id: 'totalsportek',name:'TotalSportek',         icon: '🎯', url: 'https://totalsportek.pro/',      type: 'external', tag: 'MULTI-SOURCE', tagClass: 'free' },
    { id: 'sportsurge', name: 'Sportsurge',           icon: '📺', url: 'https://sportsurge.net/',         type: 'external', tag: 'AD-LIGHT', tagClass: 'hd' },
    { id: 'footybite',  name: 'FootyBite',            icon: '🍿', url: 'https://footybite.to/',           type: 'external', tag: 'COMMUNITY', tagClass: 'free' }
  ];

  let fallbackState = {
    currentProviderIdx: 0,
    consecutiveLagEvents: 0,
    maxLagBeforeFallback: 5,
    fallbackCooldown: false,
    fallbackToastShown: false
  };

  // ══════════════════════════════════════════════════════════
  //  STREAM HEALTH MONITOR — Lag detection + auto-fallback
  // ══════════════════════════════════════════════════════════

  let lagTimer = null, lagStartTime = null;

  function updateFallbackToast(reason) {
    const el = document.getElementById('fallbackReason');
    if (el) el.textContent = reason || 'Detecting lag...';
    const durEl = document.getElementById('fallbackDuration');
    if (durEl && lagStartTime) {
      const sec = Math.round((Date.now() - lagStartTime) / 1000);
      durEl.textContent = `${sec}s`;
    }
  }

  function showFallbackAlert() {
    if (fallbackState.fallbackCooldown) return;
    const toast = document.getElementById('fallbackToast');
    if (!toast) return;
    toast.classList.add('visible');
    fallbackState.fallbackToastShown = true;
    updateFallbackProviderPanel();
  }

  function hideFallbackAlert() {
    const toast = document.getElementById('fallbackToast');
    if (toast) toast.classList.remove('visible');
    fallbackState.fallbackToastShown = false;
    fallbackState.fallbackCooldown = true;
    setTimeout(() => { fallbackState.fallbackCooldown = false; }, 30000);
  }

  // ── Switch to next provider in chain ──
  function switchToNextProvider() {
    fallbackState.currentProviderIdx = (fallbackState.currentProviderIdx + 1) % STREAM_PROVIDERS.length;
    const provider = STREAM_PROVIDERS[fallbackState.currentProviderIdx];
    if (provider.url) {
      window.open(provider.url, '_blank', 'noopener,noreferrer');
    }
    hideFallbackAlert();
    updateFallbackProviderPanel();

    // Pulse the provider card
    setTimeout(() => {
      const card = document.getElementById(`fb-${provider.id}`);
      if (card) { card.classList.add('pulse'); setTimeout(() => card.classList.remove('pulse'), 600); }
    }, 200);
  }

  // ── Quick-launch a specific provider ──
  function launchProvider(providerId) {
    const provider = STREAM_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;
    const idx = STREAM_PROVIDERS.indexOf(provider);
    fallbackState.currentProviderIdx = idx;
    if (provider.url) {
      window.open(provider.url, '_blank', 'noopener,noreferrer');
    }
    updateFallbackProviderPanel();
  }

  // ── Update provider panel status indicators ──
  function updateFallbackProviderPanel() {
    STREAM_PROVIDERS.forEach((p, i) => {
      const card = document.getElementById(`fb-${p.id}`);
      if (!card) return;
      card.classList.toggle('active-provider', i === fallbackState.currentProviderIdx);
    });
  }

  // ── Render provider panel ──
  function renderFallbackProviders() {
    const grid = document.getElementById('fallbackProvidersGrid');
    if (!grid) return;
    grid.innerHTML = STREAM_PROVIDERS.map((p, i) => {
      const isCurrent = i === fallbackState.currentProviderIdx;
      return `<div class="fb-provider-card ${isCurrent ? 'active-provider' : ''}" id="fb-${p.id}" onclick="(function(){
        var p = window._hermes_fb_providers.find(x=>x.id==='${p.id}');
        if(p && p.url) window.open(p.url,'_blank','noopener,noreferrer');
      })()" title="Watch on ${p.name}">
        <span class="fb-icon">${p.icon}</span>
        <div class="fb-info">
          <strong>${p.name}</strong>
          <span>Opens in new tab — click to watch</span>
        </div>
        <span class="fb-tag ${p.tagClass}">${p.tag}</span>
        <span class="fb-indicator ${isCurrent ? 'active' : ''}">${isCurrent ? '●' : '○'}</span>
      </div>`;
    }).join('');
    window._hermes_fb_providers = STREAM_PROVIDERS;
  }

  // ── Init fallback system on Watch section load ──
  function initFallbackSystem() {
    document.getElementById('fbNextBtn')?.addEventListener('click', switchToNextProvider);
    document.getElementById('fbDismissBtn')?.addEventListener('click', hideFallbackAlert);
    renderFallbackProviders();
    updateFallbackProviderPanel();
  }

  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════

  setLiveStatus(false, 'local database');
  updateBroadcastDataStatus();
  setInterval(updateBroadcastDataStatus, 60000);

  function refreshAll() {
    refreshLiveData().catch(() => {});
  }

  refreshAll();
  setInterval(refreshAll, CONFIG.refreshInterval);
  scheduleSeasonDiscovery();

  setTimeout(buildBracket, 200);
  setTimeout(restoreBracketPicksUI, 400);

  // Initial back-to-top check
  updateBackToTop();

  if (!sessionStorage.getItem('fifa2026_confetti')) {
    sessionStorage.setItem('fifa2026_confetti', '1');
    setTimeout(() => fireConfetti(35), 1200);
  }

  DBG('FIFA 2026 Premium Edition initialized ✓');
  DBG('Features: Lenis scroll · Parallax · Card tilt · Ripple · Scroll progress · Mobile overlay · Keyboard nav · Smart particles');

  // Init fallback system if Watch section is already active
  if (document.getElementById('watch')?.classList.contains('active')) {
    setTimeout(initFallbackSystem, 100);
  }
});
