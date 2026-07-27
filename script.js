(function(){
  "use strict";

  /* ---------- ARTICLES DATA (now loaded from data.json, not data.js) ---------- */
  var articles = [];

  /* ---------- ROUTER ---------- */
  var pages = document.querySelectorAll('.page');
  var navLinksAll = document.querySelectorAll('[data-route]');
  var titles = {
    home:'TrendMint Media | Celebrity, Entertainment, Business & Tech News',
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

  /* ---------- ANNOUNCEMENT BAR ---------- */
  document.getElementById('announceClose').addEventListener('click', function(){
    document.getElementById('announceBar').setAttribute('hidden','');
  });

  /* ---------- HERO KICKER ROTATOR ---------- */
  var kickerWords = ['Celebrity','Business','Technology','Lifestyle','Entertainment'];
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

  /* ---------- TESTIMONIAL SLIDER ---------- */
  var slides = document.querySelectorAll('.testi-slide');
  var dots = document.querySelectorAll('.testi-dots button');
  var ti = 0;
  function showSlide(i){
    slides.forEach(function(s,idx){ s.classList.toggle('is-active', idx===i); });
    dots.forEach(function(d,idx){ d.classList.toggle('is-active', idx===i); });
    ti = i;
  }
  dots.forEach(function(d){ d.addEventListener('click', function(){ showSlide(parseInt(d.getAttribute('data-i'),10)); }); });
  if(!reduceMotion && slides.length){
    setInterval(function(){ showSlide((ti+1) % slides.length); }, 5500);
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
        '<div class="listing-meta"><span>'+a.date+'</span><span>·</span><span>'+a.read+'</span></div>' +
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
    .sort(function(x, y){ return parseArticleDate(y.a.date) - parseArticleDate(x.a.date); });
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
    form.classList.add('is-hidden');
    success.classList.add('is-active');
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
