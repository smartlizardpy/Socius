# -*- coding: utf-8 -*-
import json, re, collections
raw=json.load(open("raw_tr.json"))
TIGHT={"halısaha","halı saha","halı saha maç","saha rezervasyon","kadro tamamlama","padel","padel kort",
       "tenis kort rezervasyon","playtomic","basketbol maç bul","amatör futbol","futbol maç organizasyon","spor arkadaşı"}
OK={"Sports","Health & Fitness","Lifestyle","Social Networking","Travel"}
apps=[a for a in raw.values() if (set(a["_terms"])&TIGHT) and a.get("primaryGenreName") in OK]

def norm(s):
    s=(s or "").lower()
    for k,v in {"ı":"i","İ":"i","ş":"s","ğ":"g","ü":"u","ö":"o","ç":"c"}.items(): s=s.replace(k,v)
    return s

# --- exclude pure utilities that aren't matchmaking/booking at all
UTIL = ["lineup","line up","dizilis","taktik","tactic","scoreboard","skorboard","score keeper","scorekeeper",
        "tracker","istatistik","fikstur","canli skor","live score","antrenman","workout","gym","magaza","market",
        "haber","tv","stream","fifa","fc 26","evolutions","card scanner"]
def is_util(a):
    n=norm(a["trackName"]); d=norm(a.get("description",""))[:400]
    return any(u in n for u in UTIL)

core=[a for a in apps if not is_util(a)]

FOOT = ["hali saha","halisaha","saha","kadro","futbol","football","mac","pas","lig","soccer"]
RACK = ["padel","tenis","tennis","kort","court","raket","racket","pickleball"]
def cat(a):
    n=norm(a["trackName"])
    if any(k in n for k in RACK): return "racket"
    if any(k in n for k in FOOT): return "football"
    return "generic/multi-sport"

# --- does the description claim a trust / level mechanic?
LEVEL = ["seviye","level","skill","derece","puan seviye","seviyene","seviyeye"]
TRUST = ["guvenilir","guvenilirlik","katilim orani","gelmeyen","ebe","devamsiz","no-show","no show",
         "reliab","attendance","iptal eden","sozunde","gelmeyenler","katilmayan","kara liste","blacklist"]
RATE  = ["degerlendir","puanla","yildiz","rating","review","yorum yap","oy ver"]

def hits(a, keys):
    t=norm(a["trackName"]+" "+(a.get("description") or ""))
    return sorted({k for k in keys if k in t})

for a in core:
    a["_cat"]=cat(a); a["_level"]=hits(a,LEVEL); a["_trust"]=hits(a,TRUST); a["_rate"]=hits(a,RATE)

json.dump(core, open("core_tr.json","w"), ensure_ascii=False)

print(f"TOTAL matching Avenza's own category terms (Sports-ish genres): {len(apps)}")
print(f"After removing lineup-builders / scoreboards / trackers / news: {len(core)} real matchmaking-or-booking apps\n")

byc=collections.Counter(a["_cat"] for a in core)
for k,v in byc.most_common(): print(f"  {k:<22} {v}")

print("\n--- launch wave (original App Store release date) ---")
years=collections.Counter((a.get("releaseDate") or "")[:4] for a in core)
for y in sorted(years): print(f"  {y}  {'#'*years[y]} {years[y]}")

print("\n--- traction: userRatingCount distribution ---")
def bucket(n):
    n=n or 0
    return "0"     if n==0 else "1-9" if n<10 else "10-49" if n<50 else "50-199" if n<200 else "200+"
b=collections.Counter(bucket(a.get("userRatingCount")) for a in core)
for k in ["0","1-9","10-49","50-199","200+"]: print(f"  {k:<8} {b.get(k,0)}")
tot=sum(a.get('userRatingCount') or 0 for a in core)
print(f"  total ratings across ALL {len(core)} apps: {tot:,}")

print("\n--- MECHANICS claimed in the store description ---")
lv=[a for a in core if a["_level"]]; tr=[a for a in core if a["_trust"]]; rt=[a for a in core if a["_rate"]]
print(f"  mentions a LEVEL / skill tier      {len(lv):>3} / {len(core)}")
print(f"  mentions RELIABILITY / no-show     {len(tr):>3} / {len(core)}")
print(f"  mentions post-game RATING          {len(rt):>3} / {len(core)}")
print(f"  mentions BOTH level AND trust      {len([a for a in core if a['_level'] and a['_trust']]):>3} / {len(core)}")

print("\n  apps claiming a RELIABILITY/no-show mechanic:")
for a in sorted(tr, key=lambda a:-(a.get('userRatingCount') or 0)):
    print(f"    {a['trackName'][:40]:<42} {a.get('userRatingCount',0) or 0:>5}r  {a['_cat']:<20} {a['_trust']}")
print("\n  apps claiming a LEVEL mechanic:")
for a in sorted(lv, key=lambda a:-(a.get('userRatingCount') or 0)):
    print(f"    {a['trackName'][:40]:<42} {a.get('userRatingCount',0) or 0:>5}r  {a['_cat']:<20} {a['_level']}")
