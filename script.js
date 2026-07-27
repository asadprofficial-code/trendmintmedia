(function(){
  "use strict";

  /* ---------- ARTICLES DATA (now loaded from data.json, not data.js) ---------- */
  var articles = [];

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
    var path = (id === 'home') ? '/' : '/' + id;
    if(location.pathname !== path){ history.pushState({page:id}, '', path); }
    revealOnScroll();
  }

  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-route]');
    if(!el) return;
    e.preventDefault();
    showPage(el.getAttribute('data-route'), el.getAttribute('data-filter'));
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
      '<img src="'+a.img+'" alt="'+a.title.replace(/"/g,'')+'" loading="lazy" onerror="this.style.opacity=\'0\'"></div>' +
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
      heroLink.href = '/article/' + top.a.slug;
      document.getElementById('heroPickTag').textContent = top.a.cat;
      var heroImg = document.getElementById('heroPickImg');
      heroImg.src = top.a.img;
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

  /* ---------- ARTICLE PAGE ---------- */
  function openArticle(idx){
    var a = articles[idx];
    if(!a) return;
    window.location.href = '/article/' + a.slug;
  }

  document.addEventListener('click', function(e){
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

    fetch('/contact.php', { method: 'POST', body: new FormData(form) })
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
    var path = window.location.pathname.replace(/^\/|\/$/g,'');
    if(path.indexOf('article/') === 0){ return; }
    if(!pages.length){ return; }
    var validPages = ['home','about','services','listings','contact'];
    showPage(validPages.indexOf(path) !== -1 ? path : 'home');
  }

  /* ---------- LOAD ARTICLES FROM data.json, THEN INITIALIZE ---------- */
  fetch('/articles/data.json', { cache: 'no-store' })
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
