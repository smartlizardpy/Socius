import json
raw=json.load(open("raw_tr.json"))
TIGHT={"halısaha","halı saha","halı saha maç","saha rezervasyon","kadro tamamlama","padel","padel kort",
       "tenis kort rezervasyon","playtomic","basketbol maç bul","amatör futbol","futbol maç organizasyon","spor arkadaşı"}
OK={"Sports","Health & Fitness","Lifestyle","Social Networking","Travel"}
rows=[]
for tid,a in raw.items():
    if not (set(a["_terms"]) & TIGHT): continue
    if a.get("primaryGenreName") not in OK: continue
    rows.append(a)
rows.sort(key=lambda a:-(a.get("userRatingCount",0) or 0))
print(f"{len(rows)} candidates\n")
for a in rows:
    print(f"{a['trackId']:<12} {a['trackName'][:44]:<46} {a.get('sellerName','')[:24]:<26} "
          f"{a.get('userRatingCount',0) or 0:>6}r {a.get('averageUserRating',0) or 0:>4.1f}★ "
          f"{(a.get('currentVersionReleaseDate') or '')[:10]}  {len(a.get('screenshotUrls',[])):>2}sh  {a.get('primaryGenreName','')}")
