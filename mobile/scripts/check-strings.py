#!/usr/bin/env python3
"""Report every translatable string in the app that has no entry in design/strings.json.

Three sources, because the app has three:

  1. literal t('...') calls in the screens
  2. literal tf('...', {...}) calls — the same thing with holes to fill
  3. the copy fields in src/data/seed.ts, which reach the UI as t(activity.title)

The third is why "Mo Tu We" and "Tonight · 19:30" shipped untranslated: the
checker only ever read the first, so anything that lived in the data was invisible
to it and passed silently. The second was the same blind spot one letter along —
every templated sentence in the app went unchecked.

Misses are not always bugs — numbers, prices, levels, personal names, place names
and the wordmark stay literal in both languages by design. This just makes the
list visible so each one is a decision rather than an accident.
"""
import json, re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
STRINGS = json.loads((ROOT / "design/strings.json").read_text())
APP = ROOT / "mobile"

call = re.compile(r"\bt\(\s*(['\"])((?:\\.|(?!\1).)*)\1\s*\)")
# tf() takes a second argument, so the closing paren is not the delimiter
templ = re.compile(r"\btf\(\s*(['\"])((?:\\.|(?!\1).)*)\1\s*,")

# the seed fields whose values are rendered through t()
SEED_FIELDS = (
    "title", "headline", "whenPrefix", "dayShort", "dateLine", "dateTimeLine",
    "feedLine", "travel", "priceNote", "levelLabel", "matchReason",
    "question", "head", "label", "blurb", "matchNote", "promptTitle",
    "playsWhen", "memberSince", "text", "when", "body", "kind", "schedule",
    "runs", "levelNote", "priceNote", "cancelNote", "coachLine", "billedNote",
    "badge",
)
seed_field = re.compile(
    r"\b(?:" + "|".join(SEED_FIELDS) + r"): (['\"])((?:\\.|(?!\1).)*)\1"
)
# array-of-string copy: includes: [...], ratingTags, tags
seed_list = re.compile(r"\b(?:includes|tags|ratingTags): \[([^\]]*)\]", re.S)

# `kind` is a copy field on a course ("COURSE") and a discriminant on a level
# scale ("rating" | "pace"). The discriminants are code, not copy.
IGNORE = {"rating", "pace"}
list_item = re.compile(r"(['\"])((?:\\.|(?!\1).)*)\1")

missing = {}
for f in list(APP.glob("app/**/*.tsx")) + list(APP.glob("src/**/*.tsx")) + list(APP.glob("src/**/*.ts")):
    if "node_modules" in str(f):
        continue
    text = f.read_text()
    for rx in (call, templ):
        for m in rx.finditer(text):
            s = m.group(2).replace("\\'", "'").replace('\\"', '"')
            if s not in STRINGS:
                missing.setdefault(s, []).append(f.relative_to(APP).as_posix())

    # the data the screens render through t()
    if f.name in ("seed.ts",):
        for m in seed_field.finditer(text):
            s = m.group(2).replace("\\'", "'").replace('\\"', '"')
            if s and not s[0].isdigit() and s not in IGNORE and s not in STRINGS:
                missing.setdefault(s, []).append(f.relative_to(APP).as_posix())
        for m in seed_list.finditer(text):
            for item in list_item.finditer(m.group(1)):
                s = item.group(2).replace("\\'", "'").replace('\\"', '"')
                if s and s not in STRINGS:
                    missing.setdefault(s, []).append(f.relative_to(APP).as_posix())

# A Turkish case ending welded onto a {hole} — "{city}'e" — is right for one
# name in four. That hole takes 60-odd semt names now, and the suffix has to
# obey vowel harmony and take a buffer letter after a vowel: Kadıköy'E but
# Beşiktaş'A, Moda'YA, Şişli'YE. Use a postposition instead (çevresinde,
# yakınında, tarafında) — it inflects nothing and is right for every name.
suffixed = re.compile(r"\{[a-zA-Z]+\}['\u2019][a-zçğıöşü]{1,3}\b")
welded = {en: tr for en, tr in STRINGS.items() if suffixed.search(tr)}

if welded:
    print(f"{len(welded)} Turkish string(s) weld a case ending onto a hole:\n")
    for en, tr in sorted(welded.items()):
        print(f"  {tr!r}\n      for {en!r}")
    print()

if not missing:
    if welded:
        sys.exit(1)
    print("all t() and tf() strings resolve")
    sys.exit(0)

print(f"{len(missing)} string(s) with no Turkish entry:\n")
for s, files in sorted(missing.items()):
    print(f"  {s!r}\n      {', '.join(sorted(set(files)))}")
