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
<link rel="stylesheet" href="/article.css">
<script async src="https://pl30102985.effectivecpmnetwork.com/2e/02/a6/2e02a66c06765e4f5a6c763cd52845a1.js"></script>

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
        <p>Curated celebrity, business, politics, sports, and world coverage — written with editorial care, for readers who are tired of the noise.</p>
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
