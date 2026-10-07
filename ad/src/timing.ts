/**
 * The single timing source of truth for the whole ad.
 *
 * Every beat in every scene is derived from the numbers in this file. Nothing
 * else in `src/` may contain a bare frame number — if a moment needs to move,
 * it moves here and the composition follows.
 *
 * The values below are **measured off the delivered voiceover**
 * (`public/audio/voiceover.mp3`) with `tools/measure-voiceover.sh`, not the
 * script estimates the ad was cut to first.
 *
 * That file is no longer the raw ElevenLabs render. The delivered read is the
 * right performance at the wrong pace — a few phrases rushed, and most of the
 * pauses of the read before it gone, including the beat that turns the hook and
 * the one that lets the brand tag land. `tools/build-voiceover.sh` cuts it into
 * its fourteen phrases, slows only the rushed ones, and lays them back down with
 * deliberate pauses so the ad lands on exactly 30.000s. The raw render is kept
 * at `raw/voiceover-elevenlabs-raw.mp3`.
 *
 * Re-recording the voice means re-cutting that script and re-measuring here.
 * Nothing else needs to move, because every beat in every scene is stated as an
 * offset from its own line rather than as a position on the timeline.
 */

/** Frames per second. One place, so `sec()` and the composition cannot drift. */
export const FPS = 30;

/**
 * Spoken line windows, in seconds from the top of the ad.
 *
 * Line 1  0.67–4.35   "Halı saha yapmak istiyorsun… ama yine iki kişi eksik, değil mi?"
 * Line 2  5.43–9.80   "Socius'ta yakınındaki halı saha maçlarını buluyorsun."
 * Line 3  11.05–18.81 "Katılmadan önce kimlerin geleceğini, gerçekten gelip gelmediğini görüyorsun."
 * Line 4  19.77–22.93 "Sana uyan maça tek dokunuşla katılıyorsun."
 * Line 5  23.89–28.41 "Grubun tamamlanmasını bekleme. Maçını bul, sahaya çık."
 *
 * The four pauses between the lines are 1.08, 1.25, 0.96 and 0.96 seconds —
 * every one longer than in the read before it, which is most of where the ad
 * grew from 27.6s to 30s. The words themselves only account for about a second
 * of it.
 */
export const TIMING = {
  introStart: 0.67,
  introEnd: 4.35,

  nearbyStart: 5.43,
  nearbyEnd: 9.8,

  reliabilityStart: 11.05,
  reliabilityEnd: 18.81,

  joinStart: 19.77,
  joinEnd: 22.93,

  outroStart: 23.89,
  outroEnd: 28.41,
} as const;

/**
 * Held after the last spoken word, so the end card can breathe before the cut.
 *
 * 1.59s puts the total at exactly 900 frames — the 30.000s slot the ad is cut
 * for — and gives the brand lock-up a second and a half of silence to sit in,
 * which the 0.5s of the previous cut never did.
 */
export const TAIL = 1.59;

/** Seconds → frames. The only conversion in the project. */
export const sec = (seconds: number) => Math.round(seconds * FPS);

/**
 * Scene boundaries.
 *
 * A scene owns the airtime from where its picture starts to where the next
 * one's does — which is *not* the same as its line's window. Voice and picture
 * are deliberately offset: the visual for a line lands slightly before the
 * voice reaches it, and the previous shot is still on screen during the gap
 * between lines. That gap is where the transitions live.
 *
 * `lineStart` / `lineEnd` stay attached so a scene can emphasise the exact
 * moment its own words are spoken.
 */
type Scene = {
  /** where the picture cuts in, in seconds from the top */
  start: number;
  /** where the next picture cuts in */
  end: number;
  /** when the voice starts this line */
  lineStart: number;
  /** when the voice finishes it */
  lineEnd: number;
};

/** How long a cut is covered by the outgoing shot. Shared by every transition. */
export const CROSS = 0.45;

export const SCENES = {
  /** UGC hook. Runs from frame 0 — the picture is up before the first word. */
  hook: {
    start: 0,
    end: TIMING.nearbyStart - 0.35,
    lineStart: TIMING.introStart,
    lineEnd: TIMING.introEnd,
  },
  /** Discover: the football filter, and the halı saha matches near you. */
  nearby: {
    start: TIMING.nearbyStart - 0.35,
    end: TIMING.reliabilityStart - 0.4,
    lineStart: TIMING.nearbyStart,
    lineEnd: TIMING.nearbyEnd,
  },
  /** Who is playing, and whether they actually turn up. The trust beat. */
  reliability: {
    start: TIMING.reliabilityStart - 0.4,
    end: TIMING.joinStart - 0.4,
    lineStart: TIMING.reliabilityStart,
    lineEnd: TIMING.reliabilityEnd,
  },
  /** One tap. The last two slots fill and the state flips to KATILDIN. */
  join: {
    start: TIMING.joinStart - 0.4,
    end: TIMING.outroStart - 0.4,
    lineStart: TIMING.joinStart,
    lineEnd: TIMING.joinEnd,
  },
  /** Back to the pitch, then the mark and the one CTA. */
  outro: {
    start: TIMING.outroStart - 0.4,
    end: TIMING.outroEnd + TAIL,
    lineStart: TIMING.outroStart,
    lineEnd: TIMING.outroEnd,
  },
} satisfies Record<string, Scene>;

export type SceneName = keyof typeof SCENES;

/** A scene's length in frames, for `<Sequence durationInFrames>`. */
export const sceneFrames = (name: SceneName) =>
  sec(SCENES[name].end) - sec(SCENES[name].start);

/** A scene's first frame, for `<Sequence from>`. */
export const sceneFrom = (name: SceneName) => sec(SCENES[name].start);

/**
 * A beat inside a scene, expressed in absolute seconds, converted to the
 * scene-relative frame `useCurrentFrame()` reports inside that `<Sequence>`.
 *
 * This is what keeps the scenes retimable: a scene says "the chip selects when
 * the voice reaches 'halı saha'", not "on frame 214".
 */
export const beat = (name: SceneName, atSeconds: number) =>
  sec(atSeconds) - sec(SCENES[name].start);

/**
 * A beat stated as an offset from the moment its scene's line is spoken.
 *
 * This is the one that keeps the ad retimable. A scene says "the chip fills
 * nine tenths of a second after the voice starts this line", not "at 5.85
 * seconds on the timeline" — so when a new recording moves the line, every beat
 * in that scene moves with it and no scene file has to be edited.
 *
 * Offsets are often negative: a picture usually needs to be up before the words
 * that describe it.
 */
export const fromLine = (name: SceneName, offsetSeconds: number) =>
  SCENES[name].lineStart + offsetSeconds;

/** Total ad length. */
export const DURATION = sec(SCENES.outro.end);
