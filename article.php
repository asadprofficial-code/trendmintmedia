<?php
// ============================================================
//  TrendMint Media — article.php
//  Replaces article.html. Reads /articles/data.json on the
//  SERVER (before any JS runs) so Facebook/Twitter/Google see
//  the correct title, description and image immediately.
// ============================================================

// ---- 1. Get slug from the URL (/article/slug-name) ----
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/article/', $path);
$slug = isset($parts[1]) ? rtrim($parts[1], '/') : '';
$slug = urldecode($slug);

// ---- 2. Load articles from data.json ----
$jsonPath = __DIR__ . '/articles/data.json';
$articles = [];
if (file_exists($jsonPath)) {
    $raw = file_get_contents($jsonPath);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) { $articles = $decoded; }
}

// ---- 3. Find the matching article ----
$article = null;
foreach ($articles as $a) {
    if (isset($a['slug']) && $a['slug'] === $slug) { $article = $a; break; }
}

// ---- 4. If no slug / no match -> send home (302, not a JS redirect) ----
if (!$slug || !$article) {
    header('Location: /', true, 302);
    exit;
}

// ---- 5. Prepare safe values for meta tags ----
$title       = htmlspecialchars($article['title'] . ' — TrendMint Media', ENT_QUOTES, 'UTF-8');
$description = htmlspecialchars($article['excerpt'], ENT_QUOTES, 'UTF-8');
$image       = htmlspecialchars($article['img'], ENT_QUOTES, 'UTF-8');
// Make image absolute if it's a relative /images/... path
if (strpos($image, 'http') !== 0) {
    $image = 'https://trendmintmedia.com' . $image;
}
$canonical = 'https://trendmintmedia.com/article/' . htmlspecialchars($slug, ENT_QUOTES, 'UTF-8');
$articleJson = htmlspecialchars(json_encode($article), ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo $title; ?></title>
<meta name="description" content="<?php echo $description; ?>">
<link rel="canonical" href="<?php echo $canonical; ?>">

<meta property="og:type" content="article">
<meta property="og:title" content="<?php echo $title; ?>">
<meta property="og:description" content="<?php echo $description; ?>">
<meta property="og:image" content="<?php echo $image; ?>">
<meta property="og:url" content="<?php echo $canonical; ?>">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo $title; ?>">
<meta name="twitter:description" content="<?php echo $description; ?>">
<meta name="twitter:image" content="<?php echo $image; ?>">

<meta name="theme-color" content="#0a0a0c">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230a0a0c'/%3E%3Ctext x='50' y='68' font-size='58' font-family='Georgia,serif' fill='%23c9a44c' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4GHT2M9X1X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-4GHT2M9X1X');
</script>

<link rel="stylesheet" href="/style.css">
<script async src="https://pl30102985.effectivecpmnetwork.com/2e/02/a6/2e02a66c06765e4f5a6c763cd52845a1.js"></script>

<style>
/* ============================================================
   ARTICLE-PAGE-SPECIFIC STYLES
   (site-wide tokens/header/footer come from style.css above —
   these rules only apply to elements unique to the article page)
   ============================================================ */
.announce{background:var(--black);border-bottom:1px solid var(--line);position:relative;overflow:hidden;}
.announce-inner{max-width:var(--maxw);margin:0 auto;padding:9px 46px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:12.5px;letter-spacing:0.04em;color:var(--grey);text-align:center;}
.announce-inner strong{color:var(--gold-bright);font-weight:700;}
.announce-close{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--grey-dim);width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:color .25s,background .25s;}
.announce-close:hover{color:var(--gold-bright);background:rgba(244,239,226,0.06);}
.announce-close svg{width:11px;height:11px;}
@media(max-width:560px){.announce-inner{padding:9px 40px;font-size:11px;line-height:1.4;}}

.article-header{padding:48px 0 32px;border-bottom:1px solid var(--line-soft);}
.article-header .eyebrow{margin-bottom:16px;}
.article-header h1{font-size:clamp(24px,6vw,48px);max-width:900px;color:var(--cream);}
.article-header .art-meta{margin-top:16px;font-size:12.5px;color:var(--grey-dim);letter-spacing:0.05em;}
@media(max-width:768px){.article-header{padding:28px 0 20px;}}

.article-hero{width:100%;max-height:520px;overflow:hidden;border-bottom:1px solid var(--line-soft);background:#000;}
.article-hero img{width:100%;height:520px;object-fit:contain;display:block;}
@media(max-width:768px){.article-hero img{height:230px;}}

.article-layout{display:grid;grid-template-columns:1fr 320px;gap:50px;padding:60px 0 100px;align-items:start;width:100%;}
@media(max-width:1024px){.article-layout{grid-template-columns:1fr 280px;gap:36px;}}
@media(max-width:768px){.article-layout{grid-template-columns:1fr;gap:0;padding:36px 0 60px;}}

.article-body p{font-size:17px;line-height:1.85;color:var(--grey);margin-bottom:24px;font-family:var(--sans);overflow-wrap:break-word;word-break:break-word;}
.article-body p:first-child{font-size:19px;color:var(--cream);font-weight:500;line-height:1.7;}
@media(max-width:480px){.article-body p{font-size:15.5px;}.article-body p:first-child{font-size:17px;}}
.article-body h2,.article-body h3{font-family:var(--serif);color:var(--cream);margin:40px 0 16px;font-size:24px;}
.article-body strong{color:var(--cream);}
.article-body em{color:var(--gold);font-style:italic;}
.article-body a{color:var(--gold);border-bottom:1px solid var(--line);transition:color .25s;word-break:break-word;}
.article-body a:hover{color:var(--gold-bright);}
.article-divider{border:none;border-top:1px solid var(--line-soft);margin:40px 0;}

.back-bar{display:flex;align-items:center;gap:12px;margin-bottom:32px;}
.back-bar a{font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--grey);display:inline-flex;align-items:center;gap:8px;transition:color .25s;}
.back-bar a:hover{color:var(--gold-bright);}
.back-bar svg{width:14px;height:14px;flex:none;}

.share-row{display:flex;align-items:center;gap:12px;margin-top:48px;padding-top:30px;border-top:1px solid var(--line-soft);flex-wrap:wrap;}
.share-row span{font-size:11.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--grey-dim);}
.share-btn{width:36px;height:36px;border:1px solid var(--line-soft);display:flex;align-items:center;justify-content:center;color:var(--grey);transition:border-color .3s,color .3s;flex-shrink:0;}
.share-btn:hover{border-color:var(--gold);color:var(--gold-bright);}
.share-btn svg{width:15px;height:15px;flex:none;}

.related-section{margin-top:60px;padding-top:40px;border-top:1px solid var(--line-soft);}
.related-section h3{font-size:20px;margin-bottom:24px;}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
@media(max-width:640px){.related-grid{grid-template-columns:1fr;}}
.related-card{border:1px solid var(--line-soft);background:rgba(244,239,226,0.015);transition:transform .35s var(--ease),border-color .35s;cursor:pointer;}
.related-card:hover{transform:translateY(-4px);border-color:var(--line);}
.related-card img{width:100%;aspect-ratio:16/9;object-fit:cover;}
.related-card-body{padding:14px 16px 18px;}
.related-card-body .eyebrow{font-size:10px;margin-bottom:8px;}
.related-card-body h4{font-size:14px;font-weight:600;line-height:1.35;color:var(--cream);}

.article-sidebar{position:sticky;top:100px;min-width:0;}
@media(max-width:768px){.article-sidebar{position:static;margin-top:50px;padding-top:40px;border-top:1px solid var(--line-soft);}}

.ad-box{border:1px solid var(--line-soft);background:rgba(244,239,226,0.02);padding:16px;margin-bottom:24px;max-width:100%;overflow:hidden;}
.ad-box-label{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--grey-dim);margin-bottom:12px;text-align:center;}
.ad-unit-300x250{width:100%;min-height:250px;background:rgba(244,239,226,0.03);display:flex;align-items:center;justify-content:center;color:var(--grey-dim);font-size:12px;border:1px dashed rgba(201,164,76,0.15);max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
.ad-unit-300x600{width:100%;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
.ad-box iframe,.in-article-ad iframe,#in-article-ad-slot iframe{max-width:100%;}

.sidebar-trending{margin-bottom:30px;}
.sidebar-trending h4{font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--grey-dim);margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid var(--line-soft);}
.trending-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line-soft);cursor:pointer;transition:opacity .25s;}
.trending-item:hover{opacity:0.75;}
.trending-item:last-child{border-bottom:none;}
.trending-num{font-family:var(--serif);font-size:22px;font-weight:300;color:var(--gold-deep);min-width:28px;line-height:1;}
.trending-item h5{font-size:13px;font-weight:600;line-height:1.4;color:var(--cream);}
.trending-item span{font-size:11px;color:var(--grey-dim);margin-top:4px;display:block;}

.sidebar-newsletter{border:1px solid var(--line);background:rgba(201,164,76,0.04);padding:22px 18px;margin-top:24px;}
.sidebar-newsletter h4{font-size:16px;margin-bottom:8px;}
.sidebar-newsletter p{font-size:13px;color:var(--grey);margin-bottom:16px;}
.sidebar-newsletter input{width:100%;background:rgba(244,239,226,0.04);border:1px solid var(--line-soft);color:var(--cream);padding:11px 14px;font-size:16px;font-family:var(--sans);margin-bottom:10px;}
.sidebar-newsletter input:focus{border-color:var(--gold);outline:none;}
.sidebar-newsletter .btn{width:100%;justify-content:center;font-size:12px;padding:12px;}

.in-article-ad{margin:40px 0;padding:20px;border:1px solid var(--line-soft);background:rgba(244,239,226,0.02);text-align:center;max-width:100%;overflow-x:auto;}
.in-article-ad .ad-label{font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--grey-dim);margin-bottom:10px;}
</style>

<!-- Article data is now embedded server-side. No fetch/race-condition possible. -->
<script>
  var CURRENT_ARTICLE = <?php echo $articleJson; ?>;
  var ALL_ARTICLES_URL = '/articles/data.json';
</script>
</head>
<body>

<!-- ANNOUNCEMENT BAR -->
<div class="announce" id="announceBar">
  <div class="announce-inner">
    <span><strong>Trending now:</strong> The AI feature everyone's suddenly using without noticing — read today's top story.</span>
  </div>
  <button class="announce-close" id="announceClose" aria-label="Dismiss">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</div>

<!-- HEADER -->
<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo"><b>TrendMint</b><span class="logo-dot"></span><span>Media</span></a>
    <nav class="nav-list">
      <a href="/">Home</a>
      <a href="/#about">About</a>
      <a href="/#services">Services</a>
      <a href="/#listings">Listings</a>
      <a href="/#contact">Contact</a>
    </nav>
    <div class="header-actions">
      <a href="/#contact" class="btn btn-primary btn-small">Get In Touch</a>
      <button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav" id="mobileNav">
  <a href="/">Home</a>
  <a href="/#about">About</a>
  <a href="/#services">Services</a>
  <a href="/#listings">Listings</a>
  <a href="/#contact">Contact</a>
</div>

<!-- ARTICLE HEADER -->
<div class="article-header container">
  <span class="eyebrow" id="hero-cat"><?php echo htmlspecialchars($article['cat'], ENT_QUOTES, 'UTF-8'); ?></span>
  <h1 id="hero-title"><?php echo htmlspecialchars($article['title'], ENT_QUOTES, 'UTF-8'); ?></h1>
  <div class="art-meta" id="hero-meta"><?php echo htmlspecialchars($article['date'] . ' · ' . $article['read'], ENT_QUOTES, 'UTF-8'); ?></div>
</div>

<div class="article-hero" id="articleHero">
  <img src="<?php echo $image; ?>" alt="" class="hero-bg-blur" aria-hidden="true">
  <img id="hero-img" src="<?php echo $image; ?>" alt="<?php echo htmlspecialchars($article['title'], ENT_QUOTES, 'UTF-8'); ?>">
</div>

<main>
  <div class="container">
    <div class="article-layout">

      <div style="min-width:0;">
        <div class="back-bar">
          <a href="/#listings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to Stories
          </a>
        </div>

        <div class="article-body" id="articleBody">
          <?php foreach ($article['body'] as $i => $p): ?>
            <p><?php echo $p; ?></p>
            <?php if ($i === 2): ?>
              <div id="in-article-ad-slot" style="margin:30px 0;text-align:center;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
                <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--grey-dim);margin-bottom:10px;">Advertisement</div>
              </div>
            <?php endif; ?>
          <?php endforeach; ?>
        </div>

        <div class="share-row">
          <span>Share</span>
          <a class="share-btn" id="share-twitter" href="#" target="_blank" rel="noopener" aria-label="Share on Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-2.9-1.3-2.2 0-4 1.8-4 4 0 .3 0 .6.1.9-3.3-.2-6.2-1.8-8.2-4.2-.3.6-.5 1.3-.5 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.9-.5 0 1.9 1.4 3.5 3.2 3.9-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8-1.4 1.1-3.1 1.7-5 1.7-.3 0-.6 0-1-.1 1.8 1.2 4 1.8 6.3 1.8 7.5 0 11.6-6.3 11.6-11.7v-.5c.8-.6 1.5-1.3 2-2.1z"/></svg>
          </a>
          <a class="share-btn" id="share-facebook" href="#" target="_blank" rel="noopener" aria-label="Share on Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.5-3h-3V8.2c0-.9.3-1.5 1.6-1.5h1.5V4.1C16 4 15 4 13.9 4c-2.4 0-4 1.5-4 4.1v2.4H7.4v3H10V21h3.5z"/></svg>
          </a>
          <a class="share-btn" id="share-copy" href="#" aria-label="Copy link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </a>
        </div>

        <div class="related-section">
          <h3>More Stories</h3>
          <div class="related-grid" id="relatedGrid"></div>
        </div>
      </div>

      <aside class="article-sidebar">
        <div class="ad-box">
          <div class="ad-box-label">Advertisement</div>
          <div class="ad-unit-300x250">
            <script>
              atOptions = { 'key':'18612ad2f918c261fc3c810221ffcc48','format':'iframe','height':250,'width':300,'params':{} };
            </script>
            <script type='text/javascript' src='//www.highperformanceformat.com/18612ad2f918c261fc3c810221ffcc48/invoke.js'></script>
          </div>
        </div>

        <div class="sidebar-trending">
          <h4>Trending Now</h4>
          <div id="trendingList"></div>
        </div>

        <div class="ad-box">
          <div class="ad-box-label">Advertisement</div>
          <div class="ad-unit-300x600" style="display:flex; justify-content:center;">
            <script>
              atOptions = { 'key':'42bcf176aba7ffacb80a25d2186376e5','format':'iframe','height':600,'width':160,'params':{} };
            </script>
            <script src="https://www.highperformanceformat.com/42bcf176aba7ffacb80a25d2186376e5/invoke.js"></script>
          </div>
        </div>

        <div class="sidebar-newsletter">
          <h4>Weekly Roundup</h4>
          <p>Get the biggest stories in your inbox every Friday.</p>
          <input type="email" placeholder="you@email.com">
          <a href="/#contact" class="btn btn-primary btn-small">Subscribe Free</a>
        </div>
      </aside>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo"><b>TrendMint</b><span class="logo-dot"></span><span>Media</span></a>
        <p>Curated celebrity, entertainment, business, and technology coverage — written with editorial care, for readers who are tired of the noise.</p>
      </div>
      <div class="footer-col">
        <h5>Quick Links</h5>
        <a href="/">Home</a>
        <a href="/#about">About</a>
        <a href="/#services">Services</a>
        <a href="/#listings">Listings</a>
        <a href="/#contact">Contact</a>
      </div>
      <div class="footer-col">
        <h5>Contact</h5>
        <p>hello@trendmintmedia.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year"></span> TrendMint Media. All rights reserved.</span>
    </div>
  </div>
</footer>

<script src="/articles/article-render.js"></script>
<script src="https://pl30102987.effectivecpmnetwork.com/ac/1b/d3/ac1bd399daea1d930325984a436d8399.js"></script>

</body>
</html>
