"""Stage the public site with content-addressed static assets."""
import hashlib
from pathlib import Path
import re
import shutil
import sys


def build(root, output):
    output.mkdir(parents=True, exist_ok=False)
    urls = {}

    def asset(relative, data):
        path = Path(relative)
        digest = hashlib.sha256(data).hexdigest()[:16]
        name = path.with_name(f"{path.stem}.{digest}{path.suffix}")
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        urls[relative] = name.as_posix()

    for path in sorted((root / "assets").rglob("*")):
        if path.is_file():
            asset(path.relative_to(root).as_posix(), path.read_bytes())

    css = (root / "styles.css").read_text(encoding="utf-8")
    css = re.sub(r"url\((['\"]?)([^)'\"]+)\1\)",
                 lambda m: f"url({m[1]}{urls.get(m[2], m[2])}{m[1]})", css)
    asset("styles.css", css.encode("utf-8"))
    asset("app.js", (root / "app.js").read_bytes())

    html = (root / "index.html").read_text(encoding="utf-8")
    html = re.sub(r'(\b(?:src|href|content)=")([^"]+)(")',
                  lambda m: m[1] + urls.get(m[2], m[2]) + m[3], html)
    (output / "index.html").write_text(html, encoding="utf-8")
    # Signed announcements must retain their exact bytes and stable URLs.
    for name in ("updates.json", "updates.json.sig", "update-public-key.pem"):
        shutil.copyfile(root / name, output / name)


if __name__ == "__main__":
    build(Path.cwd(), Path(sys.argv[1] if len(sys.argv) > 1 else "_site"))
