#!/usr/bin/env python3
"""Rebuild avenza-mobile-app.html — the design canvas published as an artifact.

The canvas page carries its own editable state: one <script type="application/json"
id="appifact-doc"> block holding the title, every .dc.html artboard, canvas.json and
the images they reference. The editor code around it comes from the artifact runtime
and is never regenerated here — it is copied from whatever version is live.

    python3 design/build-artboards.py --default-en     # design/src/*.body.html -> *.dc.html
    python3 design/build-canvas.py <live-page.html>    # *.dc.html + canvas.json -> the bundle

<live-page.html> is the artifact as served (Artifact action:"read" saves one). Its frame
runtime prelude and closing wrapper are stripped so the shell is the published source and
nothing gets double-wrapped. Pass nothing to reuse the shell already in the bundle.

Only images actually referenced by an artboard are carried, so a dropped screen takes its
assets with it.
"""
import base64, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "design/assets/img"
OUT = ROOT / "avenza-mobile-app.html"
TITLE = "Avenza Mobile App"

DOC_RE = re.compile(r'(<script[^>]*id="appifact-doc"[^>]*>)(.*?)(</script>)', re.S)


def shell(source: pathlib.Path) -> str:
    """The published page with any serving wrapper removed.

    Both boundaries have a trap. The editor's bundled JS carries "<!doctype html>"
    and "</html>" as string literals, so scanning forwards from the top lands inside
    the editor and throws the document away, and taking the first "</html>" after the
    doc block truncates the editor mid-file. Instead: the nearest doctype *before* the
    block starts the document, and the *last* "</html>" ends it — less the one the
    serving wrapper appends, which is only there when something preceded the doctype.
    """
    html = source.read_text()
    doc = DOC_RE.search(html)
    if not doc:
        sys.exit(f"no appifact-doc block in {source}")

    start = html.rfind("<!doctype html>", 0, doc.start())
    if start < 0:
        start = html.rfind("<!DOCTYPE html>", 0, doc.start())
    if start < 0:
        sys.exit(f"no doctype before the doc block in {source}")

    close = html.rfind("</html>")
    if start > 0:  # served: drop the wrapper's own close, keep the document's
        close = html.rfind("</html>", 0, close)
    if close < doc.end():
        sys.exit(f"could not find the document's closing tag in {source}")
    end = close + len("</html>")

    # whatever is dropped off the end must be the wrapper and nothing else
    dropped = re.sub(r"</?(?:body|html)>|\s+", "", html[end:])
    if dropped:
        sys.exit(f"unexpected content after the document in {source}: {dropped[:80]!r}")
    return html[start:end]


def files() -> dict:
    """Every artboard, the layout, and only the images they ask for."""
    out = {}
    for dc in sorted(ROOT.glob("*.dc.html")):
        out[dc.name] = dc.read_text()
    out["canvas.json"] = (ROOT / "canvas.json").read_text()

    placed = {a["file"] for a in json.loads(out["canvas.json"])["artboards"]}
    missing = placed - set(out)
    if missing:
        sys.exit(f"canvas.json places artboards that do not exist: {sorted(missing)}")
    unplaced = {n for n in out if n.endswith(".dc.html")} - placed
    if unplaced:
        sys.exit(f"artboards built but not placed on the canvas: {sorted(unplaced)}")

    wanted = set()
    for name, body in out.items():
        if name.endswith(".dc.html"):
            wanted |= set(re.findall(r'src="([\w\-]+\.(?:jpg|png|svg))"', body))
    for name in sorted(wanted):
        f = IMG / name
        if not f.exists():
            sys.exit(f"missing image: {name}")
        out[name] = base64.b64encode(f.read_bytes()).decode()
    return out


def main() -> None:
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else OUT
    html = shell(src)
    body = files()
    doc = {"title": TITLE, "content": {"files": body}, "comments": []}

    # every "<" is escaped, so an artboard's own </script> cannot close the block
    payload = json.dumps(doc, ensure_ascii=False).replace("<", "\\u003c")
    html = DOC_RE.sub(lambda m: m.group(1) + payload + m.group(3), html, count=1)
    OUT.write_text(html + "\n")

    boards = sum(1 for n in body if n.endswith(".dc.html"))
    images = sum(1 for n in body if not n.endswith((".dc.html", ".json")))
    print(f"{OUT.name}  {len(html) // 1024} KB  ({boards} artboards, {images} images)")


if __name__ == "__main__":
    main()
