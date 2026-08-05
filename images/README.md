# images/

This folder is where article and homepage cover images belong (referenced as
`/images/<filename>` throughout `index.html` and `articles/data.json`).

None of these image files exist in the repository yet — they need to be added
here (matching filenames exactly) before the site will show real photos
instead of broken/blank images.

## Referenced by index.html ("What We Cover" tiles)
- cli.png
- news.png
- sport.png
- trending.png

## Referenced by articles/data.json (article cover images)
- 155million.png
- benny.png
- cher-mary-bono-legal-ruling.png
- death.png
- election.png
- fans-defend-celebrity-online.png
- iran.png
- jada.png
- kris-jenner-robert-kardashian.png
- liive.png
- love.png
- oprah-real-name-orpah.png
- royal-baby-tradition.png
- ronaldo.png
- sabsing-dating-trend.png
- simon.png
- the.png
- trump.png
- war.png

Already present (added):
- clueless-cast-reboot-2026.jpg
- death-investigator-rigor-mortis.jpg
- kim-kardashian-lewis-hamilton-halo.jpg
- lorenzo-alessi-vogue-love-island.jpg

Tip: `this.style.opacity='0'` (`onerror` handler) on `<img>` tags means a
missing image silently disappears instead of showing a broken-image icon —
so on a live check, missing files here look like "empty" blocks, not obvious
errors.
