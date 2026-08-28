# images/

This folder is where article and homepage cover images belong (referenced as
`/images/<filename>` throughout `index.html` and `articles/data.json`).

Every image currently referenced by `index.html` and `articles/data.json`
exists in this folder. When adding a new article, give it an `img` path
under `/images/` and add a matching file here in the same commit — otherwise
the cover silently disappears on the live site (see the `onerror` note
below).

## Placeholder covers

Some article covers below are on-brand generated graphics (dark background,
gold accent, serif headline) rather than real photos — added as an interim
fix for slugs whose `img` path had no file behind it, which made those
listing cards render blank. Swap any of these for a real sourced photo at
any time; just keep the filename identical so `articles/data.json` doesn't
need to change.

- dolly-parton-dead-at-80-tributes-legacy.png
- target-halloween-costume-pulled-racist-backlash.png
- dangerous-wrong-way-driving-trend-uk-ireland.png (file: dangerous-wrong-way-driving-social-media-trend-uk-ireland.png)
- federal-judge-strikes-down-visa-ban-75-countries.png (file: federal-judge-strikes-down-trump-visa-ban-75-countries.png)
- washington-post-reinstates-karen-attiah.png (file: washington-post-reinstates-karen-attiah-arbitration.png)
- hawk-fire-reno-nevada-evacuation.png (file: hawk-fire-reno-nevada-evacuation-90000.png)
- us-canada-tariff-war-50-percent-wine-furniture-hockey.png
- texas-data-center-moratorium-grid-audit-abbott.png
- alex-jones-sandy-hook-judgment-reduced-appeals-court.png
- tropical-storm-moke-hawaii-flooding-hurricane-lala.png
- alpha-gal-syndrome-tick-bite-meat-allergy-surge-2026.png
- viral-cash-drop-trend-hidden-money-tiktok-2026.png
- freedom-250-grand-prix-recap-record-crowds-national-mall.png
- anthropic-ipo-record-spacex-october-2026.png
- nevada-approves-8000-robotaxis-las-vegas-tesla-uber-waymo.png
- trump-iran-economic-isolation-new-phase-vance-bessent.png
- freedom-250-grand-prix-indycar-national-mall-washington.png
- uae-suspends-trade-iran-missile-attack-strait-hormuz.png
- moderna-merck-melanoma-vaccine-phase3-trial-shares-surge.png
- tupac-shakur-murder-trial-duane-keffe-d-davis-testimony.png
- marilyn-monroe-barbie-100th-birthday-doll.png
- belgium-high-fens-wildfire-2026.png
- cristiano-ronaldo-georgina-rodriguez-wedding.png

## Real photos already present

- clueless-cast-reboot-2026.jpg
- death-investigator-rigor-mortis.jpg
- kim-kardashian-lewis-hamilton-halo.jpg
- lorenzo-alessi-vogue-love-island.jpg
- nigel-farage-clacton-byelection-2026.png
- kim-kardashian-lewis-hamilton-photos.png
- aubrey-plaza-first-child-christopher-abbott.png
- andrew-tristan-tate-arrested-extradition.png
- england-france-world-cup-bronze-saka.png
- spotify-ai-persona-badge-artists.png
- colombia-earthquake-death-toll-rescue.png
- total-solar-eclipse-europe-august-2026.png
- nirmal-purja-avalanche-broad-peak.png
- pakistan-west-indies-test-series-drawn.png
- cli.png (homepage "What We Cover" tile: Celebrity)
- news.png (homepage "What We Cover" tile: Business)
- sport.png (homepage "What We Cover" tile: Sport)
- trending.png (homepage "What We Cover" tile: World)
- premier-league-2026-27-season-preview.png
- spider-man-brand-new-day-record.png
- spacex-nvidia-exclusive-partnership.png
- amazon-3-trillion-market-cap.png
- jorge-messi-father-dies.png
- spider-man-brand-new-day-box-office.png
- the-odyssey-billion-dollar-record.png
- uber-pony-ai-robotaxis-europe.png
- liam-payne-investigation-documents.png
- san-francisco-rent-ai-boom.png
- oil-prices-strait-of-hormuz-deadlock.png
- iran-us-ceasefire-expires-trump-threatens-oman-hormuz.webp
- princess-eugenie-reveals-daughter-adelaide-name-portugal.webp
- magnus-carlsen-esports-world-cup-2026-chess-title-defense.webp
- openai-launches-chatgpt-for-teens-parental-controls.webp

Tip: `this.style.opacity='0'` (`onerror` handler) on `<img>` tags means a
missing image silently disappears instead of showing a broken-image icon —
so on a live check, missing files here look like "empty" blocks, not obvious
errors.
