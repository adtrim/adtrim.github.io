# adtrim.github.io

Source for the [AdTrim](https://github.com/adtrim/adtrim) project
website, published at <https://adtrim.github.io/>.

Static one-page site — plain HTML/CSS/JS, no build step. Open `index.html`
directly in a browser to preview locally.

## How a deploy happens

Every deploy resolves a real program version and `sed`-templates it
into `index.html` before publishing, so the deployed site's version
chip and download URLs are always in sync with the program's latest
release — regardless of what triggered the deploy.

The version is resolved from one of three places, in this order:

- **`repository_dispatch` (`program-released`)** — fired by the
  program repo's `release-trigger.yml` on tag push. The dispatch
  payload carries the just-released version; we use it directly
  (more authoritative than the Releases API, which can lag a few
  seconds after publish).
- **`workflow_dispatch` with a `version` input** — manual run from
  the Actions tab. Use this to pin the deployed site to a specific
  version on demand.
- **Anything else** (push to `main`, blank `workflow_dispatch`) —
  the workflow queries
  `https://api.github.com/repos/adtrim/adtrim/releases/latest` and
  templates that.

The `v1.0.0000` strings in `index.html` are local-preview
placeholders that should never reach the deployed site. If you ever
see `v1.0.0000` on adtrim.github.io, the resolve step failed.

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
