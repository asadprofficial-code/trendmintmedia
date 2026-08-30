# images/

This folder is where article and homepage cover images belong (referenced as
`/images/<filename>` throughout `index.html` and `articles/data.json`).

None of these image files exist in the repository yet — they need to be added
here (matching filenames exactly) before the site will show real photos
instead of broken/blank images.

## Deploy note (Hostinger)

`images/**` is excluded in `.github/workflows/deploy-hostinger.yml`. The
Hostinger FTP deploy action mirrors the repo to the server and deletes
anything on the server that isn't in the repo — without this exclude, any
image uploaded manually via FTP/hosting file manager (not committed to git)
would get wiped on the next push to `main`. With the exclude in place, this
folder on the live Hostinger site is managed entirely by hand via
FTP/file manager; pushes never touch it (add, overwrite, or delete). Images
committed here still deploy fine to GitHub Pages (`pages.yml` uploads the
whole repo with no exclude), just not to Hostinger — upload them there
yourself too if you want both hosts in sync.

## Referenced by index.html ("What We Cover" tiles)
(all 4 now present — see below)

## Referenced by articles/data.json (article cover images)
- washington-post-reinstates-karen-attiah.png
- hawk-fire-reno-nevada-evacuation.png
- us-canada-tariff-war-2026.png
- texas-data-center-moratorium-grid-audit.png
- alex-jones-sandy-hook-judgment-reduced.png
- tropical-storm-moke-hawaii-flooding.png
- alpha-gal-syndrome-tick-meat-allergy.png
- viral-cash-drop-trend-hidden-money.png
- freedom-250-grand-prix-recap-national-mall.png
- anthropic-ipo-record-spacex-october-2026.png
- nevada-approves-8000-robotaxis-las-vegas.png
- trump-iran-economic-isolation-new-phase.png
- freedom-250-grand-prix-national-mall.png
- uae-suspends-trade-iran-missile-attack-strait-hormuz.png
- moderna-merck-melanoma-vaccine-phase3-trial-shares-surge.png
- tupac-shakur-murder-trial-duane-keffe-d-davis-testimony.png
- marilyn-monroe-barbie-100th-birthday-doll.png
- 155million.png
- benny.png
- candida-auris-fungus-outbreak.png
- cher-mary-bono-legal-ruling.png
- death.png
- election.png
- fans-defend-celebrity-online.png
- haitian-tps-protections-end.png
- iran.png
- jada.png
- kris-jenner-robert-kardashian.png
- liive.png
- love.png
- oprah-real-name-orpah.png
- royal-baby-tradition.png
- ronaldo.png
- sabsing-dating-trend.png
- salad-and-go-closure.png
- simon.png
- stewart-rhodes-jan6-dismissed.png
- the.png
- trump.png
- war.png
- joe-serafini-frankie-rodriguez-engaged.png
- cristiano-ronaldo-georgina-rodriguez-wedding.png
- belgium-high-fens-wildfire-2026.png

Already present (added):
- ferry-capsizes-northern-cyprus-passengers-rescue.png
- pakistan-england-lords-test-day-three-series-on-line.png
- gta-6-extended-look-netflix-blockbuster-demand.png
- grand-ole-opry-dolly-parton-tribute-show-nashville.png
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
- homepage-og-cover.png (homepage social share preview — og:image / twitter:image in index.html `<head>`)
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
- milo-yiannopoulos-arrested-ice-deportation.png
- nvidia-earnings-beat-ai-boom-wall-street-rally.png
- nepal-china-border-flood-disaster-missing-search.png
- trump-mail-in-voting-order-injunction-lifted-midterms.png
- dolly-parton-dead-at-80-tributes-legacy.png
- target-halloween-costume-pulled-racist-backlash.png
- dangerous-wrong-way-driving-trend-uk-ireland.png
- federal-judge-strikes-down-visa-ban-75-countries.png

Tip: `this.style.opacity='0'` (`onerror` handler) on `<img>` tags means a
missing image silently disappears instead of showing a broken-image icon —
so on a live check, missing files here look like "empty" blocks, not obvious
errors.
