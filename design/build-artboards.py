#!/usr/bin/env python3
"""Build Avenza artboards, bilingual (English / Türkçe).

Sources: design/src/<Name>.body.html — screen markup only, with [[icon:name:size]] tokens.
Strings: design/strings.json — a flat English -> Turkish map. Any text node whose text appears
in that map becomes a {{t.kN}} hole driven by a `lang` tweak on the artboard; anything not in
the map (numbers, names, place names) stays literal.

Emits:
  <Name>.dc.html            — a Design Component artboard with a Language tweak
  design/preview/index.html — all screens in English, for a browser look
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ICONS = ROOT / "design/assets/icons"
SRC = ROOT / "design/src"
PREVIEW = ROOT / "design/preview"
STRINGS = json.loads((ROOT / "design/strings.json").read_text())

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&'
         'family=Instrument+Sans:wght@400;500;600;700&display=swap" />')

BASE_CSS = """
    body { margin: 0; background: #FBF8F3; }
    * { box-sizing: border-box; }
    a { color: #1350C8; text-decoration: none; }
    a:hover { color: #0B2E7A; }
"""

path_re = re.compile(r'<path fill="currentColor" d="([^"]*)"')
icon_tok = re.compile(r"\[\[icon:([a-z0-9\-]+):(\d+)\]\]")
mixed_node = re.compile(r">([^<>]*\[\[icon:[a-z0-9\-]+:\d+\]\][^<>]*)<")
text_node = re.compile(r">([^<>]+)<")


def icon_svg(name, size):
    f = ICONS / f"{name}.svg"
    if not f.exists():
        sys.exit(f"missing icon: {name}")
    ds = path_re.findall(f.read_text())
    if not ds:
        sys.exit(f"no path data in icon: {name}")
    paths = "".join(f'<path fill="currentColor" d="{d}"></path>' for d in ds)
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 256 256" '
            f'style="display: block; flex-shrink: 0">{paths}</svg>')


def wrap_mixed(body):
    """Text sitting directly beside an icon token gets its own <span>, so it is a clean node."""
    def one(m):
        out, pos = [], 0
        inner = m.group(1)
        for t in icon_tok.finditer(inner):
            chunk = inner[pos:t.start()]
            out.append(f"<span>{chunk.strip()}</span>" if chunk.strip() else chunk)
            out.append(t.group(0))
            pos = t.end()
        tail = inner[pos:]
        out.append(f"<span>{tail.strip()}</span>" if tail.strip() else tail)
        return ">" + "".join(out) + "<"
    prev = None
    while prev != body:
        prev, body = body, mixed_node.sub(one, body)
    return body


def translate(body, keys):
    """Swap known English text nodes for {{t.kN}} holes; record what each key holds."""
    def one(m):
        raw = m.group(1)
        txt = raw.strip()
        if txt not in STRINGS:
            return m.group(0)
        key = keys.setdefault(txt, f"k{len(keys)}")
        lead = raw[:len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()):]
        return f">{lead}{{{{t.{key}}}}}{trail}<"
    return text_node.sub(one, body)


def lang_pills(body):
    """The in-screen language control reflects the artboard's language tweak."""
    body = body.replace('" data-lang-en>', ' {{t.enPill}}">')
    body = body.replace('" data-lang-tr>', ' {{t.trPill}}">')
    body = body.replace('<span data-flag-en>', '<span style="{{t.flagEn}}">')
    body = body.replace('<span data-flag-tr>', '<span style="{{t.flagTr}}">')
    return body


def expand_icons(body):
    out = icon_tok.sub(lambda m: icon_svg(m.group(1), int(m.group(2))), body)
    left = re.findall(r"\[\[[^\]]+\]\]", out)
    if left:
        sys.exit(f"unexpanded tokens: {set(left)}")
    return out


built, previews, report = 0, {}, []
for src in sorted(SRC.glob("*.body.html")):
    name = src.name.replace(".body.html", "")
    raw = wrap_mixed(src.read_text().rstrip())

    keys = {}
    body = lang_pills(translate(raw, keys))

    en = {k: t for t, k in keys.items()}
    tr = {k: STRINGS[t] for t, k in keys.items()}
    en["flagEn"] = "display: flex;"
    en["flagTr"] = "display: none;"
    tr["flagEn"] = "display: none;"
    tr["flagTr"] = "display: flex;"
    en["menuEn"] = "background: #FBF8F3;"
    en["menuTr"] = "background: transparent;"
    en["checkEn"] = "display: flex;"
    en["checkTr"] = "display: none;"
    tr["menuEn"] = "background: transparent;"
    tr["menuTr"] = "background: #FBF8F3;"
    tr["checkEn"] = "display: none;"
    tr["checkTr"] = "display: flex;"
    en["enPill"] = "background: #101A2B; color: #FFFFFF;"
    en["trPill"] = "background: transparent; color: #5A6172;"
    tr["enPill"] = "background: transparent; color: #5A6172;"
    tr["trPill"] = "background: #101A2B; color: #FFFFFF;"

    opens_in = "English" if "--default-en" in sys.argv else "T\\u00fcrk\\u00e7e"
    props = ('{"lang":{"editor":"enum","options":["English","T\\u00fcrk\\u00e7e"],'
             '"default":"' + opens_in + '","section":"Language"},'
             '"$preview":{"width":390,"height":844}}')
    logic = (f"const S = {{\n  English: {json.dumps(en, ensure_ascii=False)},\n"
             f"  \"Türkçe\": {json.dumps(tr, ensure_ascii=False)}\n}};")

    fallback_js = json.dumps(opens_in.encode().decode("unicode_escape"))
    dc = f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  {FONTS}
  <style>{BASE_CSS}  </style>
</helmet>
{expand_icons(body)}
</x-dc>
<script data-dc-script data-props='{props}'>
{logic}
class Component extends DCLogic {{
  renderVals() {{
    return {{ t: S[this.props.lang] || S[{fallback_js}] }};
  }}
}}
</script>
</body>
</html>
"""
    (ROOT / "design/canvas" / f"{name}.dc.html").write_text(dc)

    # preview renders the English strings literally so a browser screenshot is accurate
    prev = body
    for k, v in (tr if "--tr" in sys.argv else en).items():
        prev = prev.replace(f"{{{{t.{k}}}}}", v)
    previews[name] = expand_icons(prev)
    built += 1
    report.append(f"{name}.dc.html  {len(dc)//1024} KB  ({len(keys)} strings)")

untranslated = set()
for src in SRC.glob("*.body.html"):
    for m in text_node.finditer(wrap_mixed(src.read_text())):
        t = m.group(1).strip()
        if t and t not in STRINGS and not t.startswith("[[icon:"):
            untranslated.add(t)

print("\n".join(report))
print(f"{built} artboards built")
if untranslated:
    print(f"left as-is in both languages ({len(untranslated)}): "
          + ", ".join(sorted(untranslated)[:40]))

PREVIEW.mkdir(exist_ok=True)
LEAD = ["Welcome", "Sports", "Level", "Ready", "Main", "Activity", "Profile", "Bulletin", "Story"]
order = [n for n in LEAD if n in previews] + [n for n in previews if n not in set(LEAD)]


def local(body):
    body = re.sub(r'src="([\w\-]+\.jpg)"', r'src="../assets/img/\1"', body)
    body = re.sub(r'src="([\w\-]+\.png)"', r'src="../assets/img/\1"', body)
    return re.sub(r'src="([\w\-]+\.svg)"', r'src="../assets/illustrations/\1"', body)


cards = "\n".join(f'<div><div class="cap">{n}</div>{local(previews[n])}</div>' for n in order)
(PREVIEW / "index.html").write_text(f"""<!doctype html>
<html><head><meta charset="utf-8"><title>Avenza screens</title>
{FONTS}
<style>{BASE_CSS}
  body {{ background: #DED8CD; padding: 40px; }}
  .row {{ display: flex; gap: 48px; align-items: flex-start; }}
  .cap {{ font: 600 13px/1 'Instrument Sans', system-ui, sans-serif;
         color: #4A5163; margin-bottom: 10px; letter-spacing: .04em; }}
</style></head>
<body><div class="row">{cards}</div></body></html>
""")
print(f"preview: {PREVIEW/'index.html'} ({len(order)} screens)")
