// WUMTECH — shared site behavior
// No build step, no dependencies. Safe to drop into any static host.

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* Data-flow diagram — cycle the "on" node subtly (Data -> Analytics -> AI -> Insight -> Impact) */
  var flow = document.getElementById('flow-diagram');
  if (flow && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var nodes = flow.querySelectorAll('.flow-node');
    var idx = 0;
    setInterval(function () {
      nodes.forEach(function (n) { n.classList.remove('on'); });
      nodes[idx].classList.add('on');
      idx = (idx + 1) % nodes.length;
    }, 1600);
  }

  /* Nav dropdowns (Solutions / Academy) — hover on desktop, tap on mobile */
  document.querySelectorAll('.nav-item').forEach(function (item) {
    var trigger = item.querySelector('a');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      }
    });
  });

  /* EHR simulation shell — sidebar panel switching */
  document.querySelectorAll('.ehr-shell').forEach(function (shell) {
    var items = shell.querySelectorAll('.ehr-nav-item');
    var panels = shell.querySelectorAll('.ehr-panel');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var target = item.getAttribute('data-panel');
        items.forEach(function (i) { i.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        item.classList.add('active');
        var panel = shell.querySelector('.ehr-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* Assignment findings submission (demo) */
  var findingsForm = document.getElementById('findings-form');
  if (findingsForm) {
    findingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = document.getElementById('findings-status');
      if (out) {
        out.textContent = 'Findings submitted. In the full Wumtech Academy environment, this would be scored against the assignment rubric and added to your portfolio.';
        out.className = 'form-status ok';
      }
    });
  }

  /* Method rail — click a step to highlight it (accordion-style emphasis) */
  document.querySelectorAll('[data-accordion]').forEach(function (rail) {
    var steps = rail.querySelectorAll('.method-step');
    steps.forEach(function (step) {
      step.addEventListener('click', function () {
        steps.forEach(function (s) { s.classList.remove('active'); });
        step.classList.add('active');
      });
    });
  });

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------------------------
     AI Visibility Score simulator (client-side demo).
     This produces an illustrative, deterministic-but-varied score
     from the business info entered, so visitors get an immediate,
     personalized-feeling result. Clearly labeled as an estimate.

     TO CONNECT A REAL BACKEND: replace runScoreDemo() with a
     fetch() call to your scoring API / lead endpoint (see README).
  ----------------------------------------------------------- */
  var scoreForm = document.getElementById('score-form');
  if (scoreForm) {
    scoreForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('biz-name').value.trim();
      var website = document.getElementById('biz-website').value.trim();
      var city = document.getElementById('biz-city').value.trim();
      var industry = document.getElementById('biz-industry').value.trim();

      if (!name || !city || !industry) {
        showStatus(scoreForm, 'Please fill in your business name, city and industry.', 'err');
        return;
      }

      // Deterministic pseudo-random seed from the input so the same
      // business gets a stable-feeling demo score across submissions.
      var seed = hashString(name + website + city + industry);
      var rand = mulberry32(seed);

      var metrics = {
        discoverability: 30 + Math.floor(rand() * 55),
        clarity: 30 + Math.floor(rand() * 55),
        trust: 20 + Math.floor(rand() * 55),
        aiPresence: 10 + Math.floor(rand() * 45),
        recommendation: 15 + Math.floor(rand() * 45)
      };
      var overall = Math.round(
        (metrics.discoverability * 0.2) +
        (metrics.clarity * 0.2) +
        (metrics.trust * 0.25) +
        (metrics.aiPresence * 0.2) +
        (metrics.recommendation * 0.15)
      );

      renderScoreResult(name, website ? website : null, overall, metrics);
      showStatus(scoreForm, 'Scan complete — results below.', 'ok');
      var resultEl = document.getElementById('score-result');
      if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function renderScoreResult(name, website, overall, m) {
    var wrap = document.getElementById('score-result');
    if (!wrap) return;
    wrap.hidden = false;

    var opportunities = buildOpportunities(m);

    wrap.innerHTML =
      '<div class="dash">' +
        '<div class="dash-top">' +
          '<div>' +
            '<div class="eyebrow" style="margin-bottom:8px;">SCAN RESULT · ' + escapeHtml(name.toUpperCase()) + '</div>' +
            '<div class="dash-score">' + overall + ' <small>/ 100</small></div>' +
          '</div>' +
          '<div class="gauge-flag">' + opportunityLabel(overall) + ' OPPORTUNITY</div>' +
        '</div>' +
        barRow('Discoverability', m.discoverability) +
        barRow('Business clarity', m.clarity) +
        barRow('Trust signals', m.trust) +
        barRow('AI presence', m.aiPresence) +
        barRow('Recommendation readiness', m.recommendation) +
        '<hr class="hair" style="margin:28px 0;">' +
        '<div class="eyebrow" style="margin-bottom:14px;">TOP OPPORTUNITIES</div>' +
        '<ol style="margin:0; padding-left:20px; color:var(--text-dim); font-size:14.5px;">' +
          opportunities.map(function (o) { return '<li style="margin-bottom:8px;">' + o + '</li>'; }).join('') +
        '</ol>' +
        '<div class="small-print" style="margin-top:20px;">This is an illustrative estimate generated in your browser for demo purposes, not a live scan of ' + (website ? escapeHtml(website) : 'your website') + '. The full Wumtech AI Visibility Diagnostic performs an actual review of your web presence, directory listings and AI-query behavior.</div>' +
        '<div style="margin-top:24px;"><a class="btn btn-primary" href="90-day-plan.html">Get my 90-day plan — $49</a></div>' +
      '</div>';
  }

  function barRow(label, value) {
    return '<div class="bar-row">' +
      '<div class="lbl">' + label.toUpperCase() + '</div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + value + '%;"></div></div>' +
      '<div class="val">' + value + '</div>' +
    '</div>';
  }

  function opportunityLabel(score) {
    if (score < 45) return 'HIGH';
    if (score < 70) return 'MEDIUM';
    return 'LOW';
  }

  function buildOpportunities(m) {
    var items = [
      { key: 'trust', text: 'Strengthen third-party trust signals — reviews, testimonials and citations AI can verify.' },
      { key: 'aiPresence', text: 'Improve AI presence by publishing clear, structured answers to the questions your customers actually ask.' },
      { key: 'clarity', text: 'Sharpen business clarity — make your services, service area and specialty unambiguous on every page.' },
      { key: 'discoverability', text: 'Close discoverability gaps across your website, Google Business Profile and relevant directories.' },
      { key: 'recommendation', text: 'Build the recommendation context AI needs — comparisons, use-cases and specifics competitors are missing.' }
    ];
    items.sort(function (a, b) { return m[a.key] - m[b.key]; });
    return items.slice(0, 3).map(function (i) { return i.text; });
  }

  /* Simple contact/lead form handler (no backend by default) */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showStatus(form, "Thanks — this demo form doesn't send anywhere yet. Connect it to Formspree, Netlify Forms or your CRM (see README.md).", 'ok');
    });
  });

  function showStatus(form, msg, type) {
    var el = form.querySelector('.form-status');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-status';
      form.appendChild(el);
    }
    el.textContent = msg;
    el.className = 'form-status ' + type;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function hashString(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
});
