# adtrim.gitlab.io

Source for the [AdTrim](https://gitlab.com/adtrim/adtrim) project
website, published at <https://adtrim.gitlab.io/>.

Static one-page site — plain HTML/CSS/JS, no build step. Open `index.html`
directly in a browser to preview locally.

## How a deploy happens

- **Push to `main`** in this repo → GitLab CI runs the `pages` job and
  publishes whatever is committed.
- **Release tag in the program repo** (e.g. `v1.0.0039`) → its CI fires a
  downstream pipeline here with `$VERSION` set, which re-templates the
  version string in `index.html` before deploying. This keeps the site's
  download link and version chip in sync with the latest release without
  needing a commit here.

## Layout

- `index.html`, `styles.css`, `app.js` — the page
- `assets/icon-512.png` — app icon used in nav + favicon + Open Graph
- `assets/screenshots/` — UI screenshots used on the page (versioned here, not
  in the program repo)
- `assets/fonts/` — self-hosted Inter + JetBrains Mono (latin subset)

## Updating the screenshot

Capture a fresh PNG of the running app, drop it into
`assets/screenshots/timeline-hero.png` (same dimensions, same filename), and
commit. Pages redeploys on push.

## License

The website source is MIT licensed for ease of forking the layout.
The program it advertises is [GPLv3](https://gitlab.com/adtrim/adtrim/-/blob/main/LICENSE).
