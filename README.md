# adtrim.github.io

Source for the [AdTrim](https://github.com/adtrim/adtrim) project
website, published at <https://adtrim.github.io/>.

Static one-page site — plain HTML/CSS/JS, no build step. Open `index.html`
directly in a browser to preview locally.

## How a deploy happens

- **Push to `main`** in this repo → `.github/workflows/deploy.yml` runs
  and publishes whatever is committed.
- **Release tag in the program repo** (e.g. `v1.0.0040`) → that repo's
  `release-trigger.yml` fires a `repository_dispatch` event here. Our
  deploy workflow picks it up, `sed`-templates the new version string
  into `index.html`, then publishes. This keeps the site's download link
  and version chip in sync with the latest release without needing a
  commit here.

## Layout

- `index.html`, `styles.css`, `app.js` — the page
- `assets/icon-512.png` — app icon used in nav + favicon + Open Graph
- `assets/screenshots/` — UI screenshots used on the page (versioned
  here, not in the program repo)
- `assets/fonts/` — self-hosted Inter + JetBrains Mono (latin subset)

## Updating the screenshot

Capture a fresh PNG of the running app, drop it into
`assets/screenshots/timeline-hero.png` (same dimensions, same filename),
and commit. Pages redeploys on push.

## License

The website source is MIT licensed for ease of forking the layout.
The program it advertises is [GPLv3](https://github.com/adtrim/adtrim/blob/main/LICENSE).
