(function(){
  "use strict";

  // CURRENT_ARTICLE is embedded server-side by article.php — no fetch, no race condition.
  var a = window.CURRENT_ARTICLE;
  if (!a) return; // article.php already redirects home if slug invalid, this is just a safety net

  /* ---- In-article ad script (must be injected as real <script> tags to execute) ---- */
  var adSlot = document.getElementById('in-article-ad-slot');
  if (adSlot) {
    var cfgScript = document.createElement('script');
    cfgScript.type = 'text/javascript';
    cfgScript.text =
      "atOptions = {" +
      "'key' : '1aaf78dabd68bda04526d4c011e9b607'," +
      "'format' : 'iframe'," +
      "'height' : 90," +
      "'width' : 728," +
      "'params' : {}" +
      "};";
    adSlot.appendChild(cfgScript);

    var invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/1aaf78dabd68bda04526d4c011e9b607/invoke.js';
    adSlot.appendChild(invokeScript);
  }

  /* ---- Share links ---- */
  var pageUrl = encodeURIComponent(window.location.href);
  var pageTitle = encodeURIComponent(a.title);
  var twEl = document.getElementById('share-twitter');
  var fbEl = document.getElementById('share-facebook');
  if (twEl) twEl.href = 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle;
  if (fbEl) fbEl.href = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
  var copyEl = document.getElementById('share-copy');
  if (copyEl) {
    copyEl.addEventListener('click', function(e){
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(function(){
        alert('Link copied!');
      });
    });
  }

  /* ---- Related + trending: fetch the full list once, filter out current article ---- */
  fetch(window.ALL_ARTICLES_URL, { cache: 'no-store' })
    .then(function(r){ return r.json(); })
    .then(function(articles){
      var others = articles.filter(function(x){ return x.slug !== a.slug; });

      var related = others.slice(0, 3);
      var relEl = document.getElementById('relatedGrid');
      if (relEl) {
        relEl.innerHTML = related.map(function(r){
          return '<div class="related-card" onclick="window.location.href=\'/article/' + r.slug + '\'">' +
            '<img src="' + r.img + '" alt="' + r.title.replace(/"/g,'') + '" loading="lazy">' +
            '<div class="related-card-body">' +
              '<span class="eyebrow">' + r.cat + '</span>' +
              '<h4>' + r.title + '</h4>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      var trending = others.slice(0, 5);
      var trendEl = document.getElementById('trendingList');
      if (trendEl) {
        trendEl.innerHTML = trending.map(function(r, i){
          return '<div class="trending-item" onclick="window.location.href=\'/article/' + r.slug + '\'">' +
            '<div class="trending-num">0' + (i+1) + '</div>' +
            '<div><h5>' + r.title + '</h5><span>' + r.cat + ' · ' + r.date + '</span></div>' +
          '</div>';
        }).join('');
      }
    })
    .catch(function(err){ console.warn('Could not load related/trending articles:', err); });

  /* ---- Mobile nav ---- */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* ---- Announce close ---- */
  var announceClose = document.getElementById('announceClose');
  if (announceClose) {
    announceClose.addEventListener('click', function(){
      document.getElementById('announceBar').style.display = 'none';
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
