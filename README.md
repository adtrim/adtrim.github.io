# adtrim.github.io

Source for the [AdTrim](https://github.com/adtrim/adtrim) project
website, published at <https://adtrim.github.io/>.

Static site, plain HTML/CSS/JS: the home page and a What's new page.
Preview it with a local server from the repository root, for example
`python -m http.server 8767 --bind 127.0.0.1`, because the What's new page
uses site-root paths.

## How a deploy happens

Every deploy resolves a real program version and `sed`-templates it
into `index.html` and `whats-new/index.html` before publishing, so the deployed site's version
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

The `v0.0.0` strings in both pages are local-preview
placeholders that should never reach the deployed site. If you ever
see `v0.0.0` on adtrim.github.io, the resolve step failed.

## Layout

Deployment stages the public files in `_site/` with `.github/scripts/build-site.py`.
CSS, JavaScript, images, and fonts receive filenames containing a hash of their
contents. Changed assets get new URLs; unchanged assets stay cacheable. Screenshot
viewer links use the same hashed images as their thumbnails. The signed update
feed keeps its stable URLs and exact bytes. No browser storage or service worker
is involved. A browser still needs to refresh the HTML to discover a deployment.

Run `python .github/scripts/build-site.py` from a clean checkout to inspect the
staged output. The script refuses to overwrite an existing output directory.

- `index.html`, `styles.css`: the home page and the shared stylesheet
- `whats-new/index.html`, `whats-new.js`: the What's new page. AdTrim 2.0 and
  later open it as `whats-new/#from=<installed>&to=<new>`; the script shows the
  releases in between. The versions stay in the URL fragment, which browsers
  do not send to the server. Add an entry for each release with user-facing
  changes; releases without one show "Fixes and security updates".
- `assets/icon-512.png`: app icon used in the nav, favicon and Open Graph
- `assets/screenshots/`: UI screenshots used on the pages (versioned
  here, not in the program repo)
- `assets/fonts/`: self-hosted Inter and JetBrains Mono (latin subset)

## Updating the screenshot

With the desktop source checked out beside this repository as `program`, run from
this repository on Windows:

```powershell
dotnet run --project ../program/tools/AdTrim.Smoke -c Release -- --website "<path-to-bbb_sunflower_2160p_60fps_normal.mp4>" assets/screenshots
```

The capture mode copies the supplied Big Buck Bunny recording into a disposable
workspace, uses isolated settings with automatic update checks off, and captures
the open, edit, and export screens at 1440 by 900, after the thumbnail strip and
waveform have finished loading. It also saves 2x close-ups: `timeline.png`,
`timeline-detail.png` (zoomed in on the second excluded scene) and
`analyze-toolbar.png`. It checks the original file's
SHA-256 before and after capture and removes the disposable copy. No sidecar is
created beside the original. Native player frames are captured through mpv and
composited into their actual WPF host bounds. The export screen uses fixed example
progress, not a benchmark or a running encode.

Review every captured image before committing.
The editor frames at 2:59.700 show adjacent-frame head and ear movement. The hero
shows three excluded sections, mixed marker statuses, and a selected split with
its editing actions. Keep the Big Buck Bunny attribution and CC BY 3.0 link on both pages. The footage is copyright 2008 Blender Foundation:
https://peach.blender.org/about/.

Screenshot refreshes do not authorize pushing or publishing the site.

## License

The website source is MIT licensed for ease of forking the layout.
The program it advertises is [GPLv3](https://github.com/adtrim/adtrim/blob/main/LICENSE).
