import json, urllib.parse, urllib.request, time, sys

API="https://itunes.apple.com"
def get(u):
    req=urllib.request.Request(u, headers={"User-Agent":"recon/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r: return json.load(r)

TERMS = ["halısaha","halı saha","halı saha maç","maç bul","saha rezervasyon","kadro tamamlama",
         "spor arkadaşı","padel","padel kort","tenis kort rezervasyon","basketbol maç bul",
         "voleybol maç","playtomic","spor sosyal","amatör futbol","futbol maç organizasyon",
         "pickup soccer","find football game","play sport with people"]

seen={}
for t in TERMS:
    q=urllib.parse.quote(t)
    try:
        d=get(f"{API}/search?term={q}&entity=software&country=tr&limit=25")
    except Exception as e:
        print("ERR",t,e,file=sys.stderr); continue
    for a in d.get("results",[]):
        tid=a["trackId"]
        if tid not in seen:
            seen[tid]=a
            seen[tid]["_terms"]=[t]
        else:
            seen[tid]["_terms"].append(t)
    time.sleep(0.4)

json.dump(seen, open("raw_tr.json","w"), ensure_ascii=False)
print(f"{len(seen)} unique apps across {len(TERMS)} Turkish-storefront searches\n")
rows=[]
for tid,a in seen.items():
    rows.append((a.get("userRatingCount",0) or 0, tid, a.get("trackName",""), a.get("sellerName",""),
                 a.get("primaryGenreName",""), a.get("averageUserRating",0) or 0,
                 (a.get("currentVersionReleaseDate") or "")[:10], len(a.get("screenshotUrls",[])),
                 ",".join(a["_terms"][:2])))
rows.sort(reverse=True)
print(f"{'ratings':>8} {'id':<12} {'name':<40} {'genre':<14} {'★':>4} {'updated':<11} shots  matched")
for r in rows[:60]:
    print(f"{r[0]:>8} {r[1]:<12} {r[2][:38]:<40} {r[4][:12]:<14} {r[5]:>4.1f} {r[6]:<11} {r[7]:>4}  {r[8][:28]}")
