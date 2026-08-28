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

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* -----------------------------------------------------------
     Note: the old client-side "AI Visibility Score simulator" that
     used to live here has been removed. score.html and the homepage's
     embedded score form now redirect to the real Wumtech AI Visibility
     Diagnostic app (see WUMTECH_APP_URL in those pages' inline scripts)
     instead of generating a fake demo score in the browser.
  ----------------------------------------------------------- */

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
});
