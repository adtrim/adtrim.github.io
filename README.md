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
  program repo's `release-trigger.yml` when a release is published. The dispatch
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

With the desktop source checked out beside this repository as `program`, run from
this repository on Windows:

```powershell
dotnet run --project ../program/tools/AdTrim.Smoke -c Release -- --website "<path-to-bbb_sunflower_2160p_60fps_normal.mp4>" assets/screenshots
```

The capture mode copies the supplied Big Buck Bunny recording into a disposable
workspace, uses isolated settings with automatic update checks off, and captures
the open, edit, and export screens at 1440 by 900. It checks the original file's
SHA-256 before and after capture and removes the disposable copy. No sidecar is
created beside the original. Native player frames are captured through mpv and
composited into their actual WPF host bounds. The export screen uses fixed example
progress, not a benchmark or a running encode.

Review all three `walkthrough-*.png` images and `timeline-hero.png` before committing.
The editor frames at 2:59.700 show adjacent-frame head and ear movement. The hero
shows three excluded sections, mixed marker statuses, and a selected split with
its editing actions. Keep the Big Buck Bunny attribution and CC BY 3.0 link with the
walkthrough. The footage is copyright 2008 Blender Foundation:
https://peach.blender.org/about/.

Screenshot refreshes do not authorize pushing or publishing the site.

## License

The website source is MIT licensed for ease of forking the layout.
The program it advertises is [GPLv3](https://github.com/adtrim/adtrim/blob/main/LICENSE).
