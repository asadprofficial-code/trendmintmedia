(function(){
  "use strict";

  // CURRENT_ARTICLE is embedded server-side by article.php — no fetch, no race condition.
  var a = window.CURRENT_ARTICLE;
  if (!a) return; // article.php already redirects home if slug invalid, this is just a safety net

  /* ---- Relative time ("5 min ago", "3 hours ago"...) — script.js isn't loaded on article pages ---- */
  function timeAgo(iso){
    if (!iso) return '';
    var then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    var diffSec = Math.floor((Date.now() - then) / 1000);
    if (diffSec < 60) return 'Just now';
    var diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return diffMin + ' min ago';
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + (diffHr === 1 ? ' hour ago' : ' hours ago');
    var diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return diffDay + (diffDay === 1 ? ' day ago' : ' days ago');
    return new Date(iso).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  }

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
      var others = articles
        .filter(function(x){ return x.slug !== a.slug; })
        .sort(function(x, y){ return new Date(y.publishedAt || y.date) - new Date(x.publishedAt || x.date); });

      var related = others.slice().sort(function(x, y){
        var xMatch = x.cat === a.cat ? 0 : 1;
        var yMatch = y.cat === a.cat ? 0 : 1;
        return xMatch - yMatch;
      }).slice(0, 3);
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
            '<div><h5>' + r.title + '</h5><span>' + r.cat + ' · ' + timeAgo(r.publishedAt) + '</span></div>' +
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
