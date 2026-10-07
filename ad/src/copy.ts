/**
 * Every Turkish string that appears in this ad.
 *
 * The `ui` block is app copy — each line is the Turkish the app itself renders,
 * lifted from mobile/src/generated/strings.gen.ts (which is generated from
 * design/strings.json). The English key each one answers to is kept in the
 * comment so a translator change over there can be found over here.
 *
 * The `vo` and `stamp` blocks are ad copy: the spoken script and the oversized
 * words the brief allows behind the interface. Those are the only strings in
 * this project that are not already in the product.
 */

/** App interface copy. Turkish, because the ad is Turkish. */
export const ui = {
  /* Discover ------------------------------------------------------------- */
  brand: 'socius',
  city: 'Kadıköy', //                                            "Kadıköy"
  headlineTop: 'Bu akşam ne', //                                 "What are you"
  headlineBottom: 'oynuyorsun?', //                              "playing tonight?"
  nearbyCount: 'Bu hafta Kadıköy çevresinde 5 km içinde 11 etkinlik',
  //                    "{n} activities within 5 km of {city} this week"
  filters: {
    all: 'Tüm sporlar', //                                       "All sports"
    padel: 'Padel', //                                           "Padel"
    football: 'Futbol', //                                       "Football"
    tennis: 'Tenis', //                                          "Tennis"
    run: 'Koşu', //                                              "Run"
  },
  alsoNearYou: 'YAKININDA AYRICA', //                            "ALSO NEAR YOU"

  /* The padel match Discover features under "Tüm sporlar" ------------------ */
  padel: {
    title: 'Padel · Çiftler', //                                 "Padel · Doubles"
    whenLine: 'Bu akşam 19.30', //                               "Tonight" + formatTime
    venue: 'Caddebostan',
    price: '₺180',
    matchPill: 'Padel seviyene uygun', //                        "Matches your padel level"
  },

  /* The match ------------------------------------------------------------ */
  title: 'Halı saha · Dostluk maçı', //                          "5-a-side · Friendly match"
  headline: "Moda Halı Saha'da 5'li maç", //                     "5-a-side at Moda Halı Saha"
  venue: 'Moda Halı Saha',
  whenLine: 'Per 21.00', //                                      "Thu" + formatTime
  dateTimeLine: '28 Ağu Per · 21.00–22.00', //                   "Thu 28 Aug · 21:00–22:00"
  price: '₺120',
  perPerson: 'kişi başı', //                                     "per person"
  priceNote: 'saha 10 kişiye bölündü', //                        "pitch split 10 ways"
  allLevels: 'Her seviye', //                                    "All levels"
  spotsLeft: (n: number) => `${n} KİŞİLİK YER`, //               "{n} SPOTS LEFT"
  full: 'DOLU', //                                               "FULL"
  hosts: (name: string) => `Ev sahibi ${name}`, //               "{name} hosts"
  reliable: (n: number) => `%${n} güvenilir`, //                 "{n}% reliable"
  join: 'Katıl', //                                              "Join"
  joinGame: 'Maça katıl', //                                     "Join game"
  youreIn: 'KATILDIN', //                                        "YOU'RE IN"
  whosPlaying: 'KİMLER OYNUYOR', //                              "WHO'S PLAYING"
  /** ofInLabel(n, cap, 'tr') — "{cap} kişiden {n}{suffix}" */
  ofIn: (n: number, cap: number) => `${cap} kişiden ${n}${TR_OF_SUFFIX[n] ?? "'i"}`,
  host: 'EV SAHİBİ', //                                          "HOST"
  everyoneWelcome: 'Herkes katılabilir', //                      "Everyone welcome"
  venueFull: 'Moda Halı Saha',
  venueAddress: 'Moda Cd. 44, Kadıköy',
  travel: 'bisikletle 12 dk', //                                 "12 min by bike"
  distance: '2,4 km',
  safety:
    'Maça 6 saat kalana kadar ücretsiz çıkabilirsin. Son anda bırakmak güvenilirlik puanını düşürür.',
  //                    "Free to leave up to 6 hours before…"
  joinedToast: 'Katıldın — orada görüşürüz', //                  "You're in — see you there"

  /* "Sana uygun" — why this match fits, before you look at who is on it --- */
  fit: {
    head: 'SANA UYGUN', //                                       "You're a match"
    when: 'Per 21.00–22.00', //     seed `timeRange`, at the app's tr separator
    yourHours: 'Hafta içi akşamları, 19.00–22.00',
    //                    "Weekday evenings, 19:00–22:00" — `you.playsWhen`
  },

  /* Reliability ---------------------------------------------------------- */
  reliability: 'GÜVENİLİRLİK', //                                "RELIABILITY"
  turnedUp: (a: number, b: number) => `${b} maçın ${a} tanesine geldi`,
  //                    "turned up to {a} of {b} games"
  inARow: (n: number) => `üst üste ${n}`, //                     "{n} in a row"
  since: 'Eyl 2025', //                                          "Sep 2025"
  today: 'bugün', //                                             "today"

  /** the "you" marker beside the level rail — mobile/src/i18n.tsx, youLevel */
  you: 'sen', //                                                 "you"

  /* Players list — app/players.tsx ---------------------------------------- */
  ratingReliable: (rating: string, rel: number) => `${rating} · %${rel} güvenilir`,
  //                    "{rating} · {rel} reliable"
} as const;

/** ofInLabel's Turkish ordinal suffixes, from mobile/src/i18n.tsx. */
const TR_OF_SUFFIX: Record<number, string> = {
  1: "'i", 2: "'si", 3: "'ü", 4: "'ü", 5: "'i",
  6: "'sı", 7: "'si", 8: "'i", 9: "'u", 10: "'u",
};

/**
 * The spoken script.
 *
 * Nothing renders this: the ad carries no on-screen text over the product, and
 * the narration is the only place these words are heard. It is kept here as the
 * reference the beats in `timing.ts` were cut against — when the final recording
 * arrives, this is what it should be read against line for line.
 *
 * `hot` marks the words the brief asks the delivery to lean on.
 */
export const vo = {
  line1: [
    { text: 'Halı saha yapmak istiyorsun…' },
    { text: 'ama yine ' },
    { text: 'iki kişi eksik', hot: true },
    { text: ', değil mi?' },
  ],
  line2: [
    { text: "Socius'ta " },
    { text: 'yakınındaki', hot: true },
    { text: ' halı saha maçlarını buluyorsun.' },
  ],
  line3: [
    { text: 'Katılmadan önce ' },
    { text: 'kimlerin geleceğini', hot: true },
    { text: ', gerçekten gelip gelmediğini görüyorsun.' },
  ],
  line4: [
    { text: 'Sana uyan maça ' },
    { text: 'tek dokunuşla', hot: true },
    { text: ' katılıyorsun.' },
  ],
  line5: [
    // rendered as two captions in the closing shot, so neither carries a
    // leading space of its own
    { text: 'Grubun tamamlanmasını bekleme.' },
    { text: 'Maçını bul, sahaya çık.' },
  ],
} as const;

export type CaptionRun = { text: string; hot?: boolean };

/**
 * The oversized Turkish words the brief allows behind the interface.
 *
 * Not currently used: the product section reads better with the interface
 * carrying the frame alone. Kept because the brief calls for them and they are
 * a one-line reinstatement if the cut wants one back.
 */
export const stamp = {
  nearby: 'YAKININDA',
  who: 'KİM GELİYOR?',
  oneTap: 'TEK DOKUNUŞ',
} as const;

/**
 * The group chat the ad opens on.
 *
 * Ad copy, not app copy — the product has no messaging screen and this is not
 * pretending it does. It is the conversation that happens *before* somebody
 * opens Socius, which is the only reason the rest of the ad has a subject.
 *
 * `who` names the person who sends it, by the id they have in the seed, so the
 * faces on the chat are the same four faces that turn up on the roster later.
 * `you` messages have no sender: you do not label your own.
 *
 * Read in order it is one story — you ask, three people fall out, you count
 * what is left. The last line is the one the app answers, so it is the one
 * drawn in the app's blue.
 */
export const chat = {
  thread: [
    { side: 'you', text: 'Bugün kim geliyor?' }, //          "Who's coming today?"
    { side: 'them', who: 'mert', text: 'Ben gelemiyorum' }, //   "I can't make it"
    { side: 'them', who: 'ayca', text: 'Bende iş çıktı' }, //    "Something came up"
    { side: 'them', who: 'deniz', text: 'Ben kesin değilim' }, // "I'm not sure yet"
    { side: 'them', who: 'selin', text: 'Maç iptal mi?' }, //    "Is the game off?"
    { side: 'you', text: '+2 lazım', accent: true }, //          "need +2"
  ],
  /** the problem, at the size the problem deserves */
  hero: { top: '2 KİŞİ', bottom: 'EKSİK' }, //                 "2 PLAYERS SHORT"
} as const;

export type ChatMessage = (typeof chat.thread)[number];

/**
 * The close.
 *
 * `line` is spoken and never drawn — the ad carries no captions over the
 * product and the close does not start one. What is drawn is the two-line
 * answer, set as the hook's two-line problem was, ink over orange, so the two
 * ends of the film rhyme.
 *
 * Note what the answer deliberately is not. The script's own words are "grubun
 * tamamlanmasını bekleme" — *don't* wait for your group to fill — so the close
 * cannot resolve by filling the group from the hook. It resolves by leaving it.
 */
export const outro = {
  line: 'Grubun tamamlanmasını bekleme.', //   spoken only
  emphasis: 'Maçını bul, sahaya çık.', //      spoken only
  hero: { top: 'MAÇINI BUL.', bottom: 'SAHAYA ÇIK.' },
  cta: "Socius'ta bul.",
} as const;
