(function(){
  "use strict";

  /* ---------- ARTICLES DATA (now loaded from data.json, not data.js) ---------- */
  var articles = [];

  /* ---------- BASE PATH ----------
     On the real domain (Hostinger, trendmintmedia.com) the site is hosted
     at the root. On GitHub Pages it's served under a /trendmintmedia
     project subpath instead, so every link, pushState path, fetch and
     image src that isn't already relative-safe needs this prefix.
     Update the repo-name check below if the repo is ever renamed. */
  var BASE_PATH = /(^|\.)github\.io$/.test(location.hostname) ? '/trendmintmedia' : '';
  window.BASE_PATH = BASE_PATH;

  /* ---------- RELATIVE TIME ("5 min ago", "3 hours ago"...) ---------- */
  function timeAgo(iso){
    if(!iso) return '';
    var then = new Date(iso).getTime();
    if(isNaN(then)) return '';
    var diffSec = Math.floor((Date.now() - then) / 1000);
    if(diffSec < 60) return 'Just now';
    var diffMin = Math.floor(diffSec / 60);
    if(diffMin < 60) return diffMin + ' min ago';
    var diffHr = Math.floor(diffMin / 60);
    if(diffHr < 24) return diffHr + (diffHr === 1 ? ' hour ago' : ' hours ago');
    var diffDay = Math.floor(diffHr / 24);
    if(diffDay < 7) return diffDay + (diffDay === 1 ? ' day ago' : ' days ago');
    return new Date(iso).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
  }
  window.timeAgo = timeAgo;

  /* ---------- ROUTER ---------- */
  var pages = document.querySelectorAll('.page');
  var navLinksAll = document.querySelectorAll('[data-route]');
  var titles = {
    home:'TrendMint Media | Celebrity, Business, Politics & World News',
    about:'About — TrendMint Media',
    services:'Services — TrendMint Media',
    listings:'Latest Stories — TrendMint Media',
    contact:'Contact — TrendMint Media'
  };

  function pushRoute(path){
    var full = BASE_PATH + path;
    if(location.pathname !== full){ history.pushState({path:full}, '', full); }
  }

  function showPage(id, filter){
    pages.forEach(function(p){ p.classList.toggle('is-active', p.id === id); });
    navLinksAll.forEach(function(a){
      if(a.closest('.nav-list') || a.closest('.mobile-nav')){
        a.classList.toggle('active', a.getAttribute('data-route') === id);
      }
    });
    if(titles[id]) document.title = titles[id];
    closeMobileNav();
    window.scrollTo({top:0, behavior:'auto'});
    if(id === 'listings'){ applyFilter(filter || 'All'); }
    revealOnScroll();
  }

  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-route]');
    if(!el) return;
    e.preventDefault();
    var id = el.getAttribute('data-route');
    showPage(id, el.getAttribute('data-filter'));
    pushRoute(id === 'home' ? '/' : '/' + id);
  });

  /* ---------- MOBILE NAV ---------- */
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  function closeMobileNav(){
    hamburger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', function(){
    var open = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true':'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* ---------- HERO KICKER ROTATOR ---------- */
  var kickerWords = ['Celebrity','Business','Politics','Sports','World','Entertainment'];
  var ki = 0;
  var kickerEl = document.getElementById('kicker-word');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(kickerEl && !reduceMotion){
    setInterval(function(){
      ki = (ki+1) % kickerWords.length;
      kickerEl.style.opacity = 0;
      setTimeout(function(){
        kickerEl.textContent = kickerWords[ki];
        kickerEl.style.opacity = 1;
      }, 300);
    }, 2600);
  }

  /* ---------- SCROLL REVEAL ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var observer = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); }
    });
  }, {threshold:0.12}) : null;
  function revealOnScroll(){
    if(!observer) return;
    revealEls.forEach(function(el){ observer.observe(el); });
  }
  revealOnScroll();

  /* ---------- RENDER LISTINGS (with pagination) ---------- */
  var grid = document.getElementById('listingGrid');
  var ITEMS_PER_PAGE = 9;
  var currentPage = 1;
  var currentFilter = 'All';

  function cardHTML(a, idx){
    return '<article class="listing-card" data-cat="'+a.cat+'" data-idx="'+idx+'">' +
      '<div class="frame"><span class="corner-a"></span><span class="corner-b"></span><span class="tag">'+a.cat+'</span>' +
      '<img src="'+BASE_PATH+a.img+'" alt="'+a.title.replace(/"/g,'')+'" loading="lazy" onerror="this.style.opacity=\'0\'"></div>' +
      '<div class="listing-body">' +
        '<div class="listing-meta"><span>'+timeAgo(a.publishedAt)+'</span><span>·</span><span>'+a.read+'</span></div>' +
        '<h3>'+a.title+'</h3>' +
        '<p>'+a.excerpt+'</p>' +
        '<div class="listing-foot"><button class="read-btn" data-idx="'+idx+'">Read Article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button></div>' +
      '</div>' +
    '</article>';
  }
function parseArticleDate(dateStr){
  var parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function getFilteredIndexes(){
  return articles
    .map(function(a, idx){ return {a: a, idx: idx}; })
    .filter(function(item){ return currentFilter === 'All' || item.a.cat === currentFilter; })
    .sort(function(x, y){ return parseArticleDate(y.a.publishedAt || y.a.date) - parseArticleDate(x.a.publishedAt || x.a.date); });
}

  function renderPagination(totalItems){
    var totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    var pagEl = document.getElementById('pagination');
    if(!pagEl) return;

    if(totalPages <= 1){
      pagEl.innerHTML = '';
      return;
    }

    var html = '';
    html += '<button class="page-btn page-nav" data-page="' + (currentPage - 1) + '" ' + (currentPage === 1 ? 'disabled' : '') + '>&larr;</button>';
    for(var i = 1; i <= totalPages; i++){
      html += '<button class="page-btn' + (i === currentPage ? ' is-active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    html += '<button class="page-btn page-nav" data-page="' + (currentPage + 1) + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>&rarr;</button>';

    pagEl.innerHTML = html;

    pagEl.querySelectorAll('.page-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var p = parseInt(btn.getAttribute('data-page'), 10);
        if(p >= 1 && p <= totalPages){
          currentPage = p;
          renderGrid();
          grid.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });
  }

  function renderGrid(){
    var filtered = getFilteredIndexes();
    var start = (currentPage - 1) * ITEMS_PER_PAGE;
    var visible = filtered.slice(start, start + ITEMS_PER_PAGE);

    grid.innerHTML = visible.map(function(item){ return cardHTML(item.a, item.idx); }).join('');

    renderPagination(filtered.length);
    revealOnScroll();
  }

  /* ---------- HOMEPAGE: "EDITOR'S PICK" HERO + "JUST PUBLISHED" GRID ---------- */
  /* Always reflects the real, most recently published articles — sorted by
     publishedAt, newest first. A newly added article with a newer
     publishedAt automatically surfaces here without any other change. */
  function renderHomeFeatured(){
    var sorted = articles
      .map(function(a, idx){ return {a:a, idx:idx}; })
      .sort(function(x, y){ return new Date(y.a.publishedAt || y.a.date) - new Date(x.a.publishedAt || x.a.date); });
    if(!sorted.length) return;

    var top = sorted[0];
    var heroLink = document.getElementById('heroPick');
    if(heroLink){
      heroLink.href = BASE_PATH + '/article/' + top.a.slug;
      heroLink.setAttribute('data-article-slug', top.a.slug);
      document.getElementById('heroPickTag').textContent = top.a.cat;
      var heroImg = document.getElementById('heroPickImg');
      heroImg.src = BASE_PATH + top.a.img;
      heroImg.alt = top.a.title;
      document.getElementById('heroPickTitle').textContent = top.a.title;
      document.getElementById('heroPickExcerpt').textContent = top.a.excerpt;
    }

    var homeGrid = document.getElementById('homeLatestGrid');
    if(homeGrid){
      var latest = sorted.slice(1, 7);
      homeGrid.innerHTML = latest.map(function(item){ return cardHTML(item.a, item.idx); }).join('');
    }

    var articleCountEl = document.getElementById('statArticleCount');
    if(articleCountEl) articleCountEl.textContent = articles.length + '+';
    var categoryCountEl = document.getElementById('statCategoryCount');
    if(categoryCountEl){
      var uniqueCats = {};
      articles.forEach(function(a){ uniqueCats[a.cat] = true; });
      categoryCountEl.textContent = Object.keys(uniqueCats).length;
    }
  }

  /* ---------- FILTERING ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  function applyFilter(cat){
    currentFilter = cat;
    currentPage = 1;
    filterBtns.forEach(function(b){
      var active = b.getAttribute('data-filter') === cat;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    renderGrid();
  }
  filterBtns.forEach(function(b){ b.addEventListener('click', function(){ applyFilter(b.getAttribute('data-filter')); }); });

  /* ---------- ARTICLE PAGE (rendered client-side — no PHP on GitHub Pages) ---------- */
  function findArticle(slug){
    for(var i=0; i<articles.length; i++){ if(articles[i].slug === slug) return articles[i]; }
    return null;
  }

  function relatedCardHTML(a){
    return '<div class="related-card" data-article-slug="'+a.slug+'">' +
      '<img src="'+BASE_PATH+a.img+'" alt="'+a.title.replace(/"/g,'')+'" loading="lazy" onerror="this.style.opacity=\'0\'">' +
      '<div class="related-card-body"><span class="eyebrow">'+a.cat+'</span><h4>'+a.title+'</h4></div>' +
    '</div>';
  }

  function trendingItemHTML(a, i){
    return '<div class="trending-item" data-article-slug="'+a.slug+'">' +
      '<div class="trending-num">0'+(i+1)+'</div>' +
      '<div><h5>'+a.title+'</h5><span>'+a.cat+' · '+timeAgo(a.publishedAt)+'</span></div>' +
    '</div>';
  }

  function openArticleBySlug(slug){
    var a = findArticle(slug);
    if(!a){ showPage('home'); pushRoute('/'); return; }

    document.getElementById('art-cat').textContent = a.cat;
    document.getElementById('art-title').textContent = a.title;
    document.getElementById('art-meta').textContent = timeAgo(a.publishedAt) + ' · ' + a.read;
    var heroImg = document.getElementById('art-hero-img');
    heroImg.src = BASE_PATH + a.img;
    heroImg.alt = a.title;

    document.getElementById('art-body').innerHTML = a.body.map(function(p){ return '<p>'+p+'</p>'; }).join('');

    var pageUrl = encodeURIComponent(window.location.origin + BASE_PATH + '/article/' + a.slug);
    var pageTitle = encodeURIComponent(a.title);
    document.getElementById('art-share-twitter').href = 'https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + pageTitle;
    document.getElementById('art-share-facebook').href = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;

    var others = articles
      .filter(function(x){ return x.slug !== a.slug; })
      .sort(function(x, y){ return new Date(y.publishedAt || y.date) - new Date(x.publishedAt || x.date); });
    var related = others.slice().sort(function(x, y){
      var xMatch = x.cat === a.cat ? 0 : 1;
      var yMatch = y.cat === a.cat ? 0 : 1;
      return xMatch - yMatch;
    }).slice(0, 3);
    document.getElementById('art-related').innerHTML = related.map(relatedCardHTML).join('');
    document.getElementById('art-trending').innerHTML = others.slice(0, 5).map(trendingItemHTML).join('');

    document.title = a.title + ' — TrendMint Media';
    showPage('article-page');
    pushRoute('/article/' + a.slug);
  }

  var shareCopyEl = document.getElementById('art-share-copy');
  if(shareCopyEl){
    shareCopyEl.addEventListener('click', function(e){
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(function(){ alert('Link copied!'); });
    });
  }

  function openArticle(idx){
    var a = articles[idx];
    if(!a) return;
    openArticleBySlug(a.slug);
  }

  document.addEventListener('click', function(e){
    var artLink = e.target.closest('[data-article-slug]');
    if(artLink){ e.preventDefault(); openArticleBySlug(artLink.getAttribute('data-article-slug')); return; }
    var btn = e.target.closest('.read-btn');
    if(btn){ openArticle(parseInt(btn.getAttribute('data-idx'),10)); return; }
    var card = e.target.closest('.listing-card');
    if(card && !e.target.closest('.read-btn')){ openArticle(parseInt(card.getAttribute('data-idx'),10)); }
  });

  /* ---------- CONTACT FORM ---------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('formSuccess');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(BASE_PATH + '/contact.php', { method: 'POST', body: new FormData(form) })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if(data.success){
          form.classList.add('is-hidden');
          success.classList.add('is-active');
        } else {
          alert(data.error || 'Could not send your message. Please try again.');
        }
      })
      .catch(function(){
        alert('Could not send your message. Please check your connection and try again.');
      })
      .finally(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
  document.getElementById('sendAnother').addEventListener('click', function(){
    form.reset();
    form.classList.remove('is-hidden');
    success.classList.remove('is-active');
  });

  /* ---------- FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- INIT ---------- */
  function routeFromPath(){
    if(!pages.length){ return; }

    // GitHub Pages has no server-side rewrites, so a direct load or
    // refresh of e.g. /trendmintmedia/article/some-slug 404s. 404.html
    // stashes the intended path here before bouncing back to index.html.
    var stashed = sessionStorage.getItem('spa-redirect');
    var rawPath = window.location.pathname;
    if(stashed){
      sessionStorage.removeItem('spa-redirect');
      rawPath = stashed.split('?')[0].split('#')[0];
    }

    var path = rawPath;
    if(BASE_PATH && path.indexOf(BASE_PATH) === 0){ path = path.slice(BASE_PATH.length); }
    path = path.replace(/^\/|\/$/g,'');

    if(path.indexOf('article/') === 0){
      var slug = path.slice('article/'.length);
      if(slug){ openArticleBySlug(slug); return; }
    }

    var validPages = ['home','about','services','listings','contact'];
    var id = validPages.indexOf(path) !== -1 ? path : 'home';
    showPage(id);
    if(stashed){ pushRoute(id === 'home' ? '/' : '/' + id); }
  }

  /* ---------- LOAD ARTICLES FROM data.json, THEN INITIALIZE ---------- */
  fetch(BASE_PATH + '/articles/data.json', { cache: 'no-store' })
    .then(function(r){ return r.json(); })
    .then(function(data){
      articles = data;
      renderGrid();
      renderHomeFeatured();
      routeFromPath();
      window.addEventListener('popstate', routeFromPath);
    })
    .catch(function(err){
      console.error('Could not load articles from data.json:', err);
      if(grid){ grid.innerHTML = '<p style="color:var(--grey);">Could not load stories right now. Please refresh the page.</p>'; }
      routeFromPath();
      window.addEventListener('popstate', routeFromPath);
    });

})();
