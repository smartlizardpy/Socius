import React from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../theme';
import { Icon } from '../Icon';
import { Txt, SectionHead } from './Txt';
import {
  Avatar,
  AvatarStack,
  Card,
  TapCard,
  MetaPill,
  StatePill,
  UrgencyPill,
  YouAvatar,
  StarRange,
  LevelStars,
  ReliabilityStrip,
} from './ui';
import { PressScale } from './motion';
import { useI18n, formatTime, formatDecimal, formatPercent, ofInLabel } from '../i18n';
import { useStore } from '../store';
import {
  people,
  personReliability,
  spotsLeft,
  starBand,
  starsOf,
  sportLabel,
  streakOf,
  turnedUpOf,
  type Activity,
  type Person,
} from '../data/seed';


/* ----------------------------------------------------------- reliability -- */

/**
 * "Will this person turn up?", answered once.
 *
 * Your profile and every player profile drew this card from their own copy of
 * the same markup, which is why they carried the same four faults each. What was
 * wrong with it:
 *
 * - **It said one fact four times.** `100%`, `turned up to 12 of 12 games`,
 *   `12 IN A ROW`, and `no missed games` are the same sentence.
 * - **The streak was drawn as a full-width blue slab with the words inside it.**
 *   It read as a progress bar at 100%, or as a button. It was neither: the
 *   strip's "nothing missed" case replaced the ticks with a rail, on the
 *   reasoning that identical ticks are decoration pretending to be data. But the
 *   ticks are not identical to each other in the only way that matters — there
 *   are twelve of them, and the axis under them dates the span. The rail is what
 *   threw that away.
 * - **The date axis had no chart left to date**, and a colour legend explained a
 *   colour that was not distinguishing anything.
 * - **Everyone got a gold medal**, including the three seeded players who have
 *   missed a game. It was a raster rosette with gloss and a drop shadow, drawn
 *   in nothing like the app's flat house style, and it was the loudest thing on
 *   a card whose whole point is a number.
 *
 * So: the ticks are always real, the streak is only stated when it is not
 * already implied by the percentage, and the legend appears only when there is
 * an orange tick to explain.
 */
export function ReliabilityCard({
  person,
  since,
}: {
  person: { gamesPlayed: number; noShowAt: number };
  /** the left end of the axis — when they joined */
  since: string;
}) {
  const { t, tf, lang } = useI18n();

  const played = person.gamesPlayed;
  const turnedUp = turnedUpOf(person);
  const missed = person.noShowAt >= 0;
  const streak = streakOf(person);

  // A clean run is worth stating only when the percentage does not already say
  // it. At 12 of 12 "12 in a row" is the same sentence twice; at 40 of 41 the
  // fact that the miss was fourteen games ago is the thing a host wants.
  const showStreak = missed && streak > 0;

  return (
    <Card r={22} style={{ paddingTop: 18, paddingHorizontal: 16, paddingBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <SectionHead>{t('RELIABILITY')}</SectionHead>
        {showStreak ? (
          <View
            style={{
              height: 22,
              paddingHorizontal: 9,
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Icon name="lightning" size={12} color={color.blueDeep} />
            <Txt f="bold" size={11} c={color.blueDeep}>
              {tf('{n} in a row', { n: streak })}
            </Txt>
          </View>
        ) : null}
      </View>

      {/* 54px Bricolage needs more than a 1.02 line box or the glyphs are cut,
          and less than 1.3 or they climb into the head above */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 4 }}>
        <Txt f="display" size={54} em={-0.05} lh={1.18}>
          {formatPercent(personReliability(person), lang)}
        </Txt>
        <Txt
          f="medium"
          size={12.5}
          lh={1.35}
          c={color.inkMuted}
          style={{ paddingBottom: 6, flexShrink: 1 }}
        >
          {tf('turned up to {a} of {b} games', { a: turnedUp, b: played })}
        </Txt>
      </View>

      <View style={{ marginTop: 14 }}>
        <ReliabilityStrip games={played} noShowAt={person.noShowAt} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 9,
        }}
      >
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {t(since)}
        </Txt>
        {/* the legend earns its place only when there is an orange tick above it */}
        {missed ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: color.orange }} />
            <Txt f="semibold" size={11.5} c={color.orangeDeep}>
              {t('1 no-show')}
            </Txt>
          </View>
        ) : null}
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {t('today')}
        </Txt>
      </View>
    </Card>
  );
}

/* ------------------------------------------------------------------ join -- */

/**
 * One entry point for joining, so every Join button in the app behaves the same:
 * a paid game goes through Confirm and pay, a free one joins on the spot.
 */
export function useJoinFlow() {
  const router = useRouter();
  const join = useStore((s) => s.join);

  return React.useCallback(
    (activity: Activity) => {
      if (activity.price != null) {
        router.push(`/pay/${activity.id}`);
        return 'pay' as const;
      }
      join(activity.id);
      return 'joined' as const;
    },
    [join, router],
  );
}

/* ----------------------------------------------------------------- labels -- */

/**
 * The mockups write the featured pill in caps ("1 SPOT LEFT") and the list pills in
 * lower case ("2 spots left"). Both forms are in strings.json for the counts the
 * seeded activities actually reach.
 */
export function spotsLabel(n: number, t: (s: string) => string, caps = false) {
  const fill = (key: string) => t(key).split('{n}').join(String(n));

  if (n <= 0) return caps ? t('FULL') : t('Full');
  if (caps) return n === 1 ? t('1 SPOT LEFT') : fill('{n} SPOTS LEFT');
  return n === 1 ? t('1 spot left') : fill('{n} spots left');
}

/* -------------------------------------------------------- activity cards -- */

/**
 * The list card the Search results and the saved list use: 68px thumb, title and
 * price on one line, two fact pills, and a hairline footer carrying the host.
 * Source: design/src/Search.body.html
 */
export function ActivityListCard({ activity }: { activity: Activity }) {
  const router = useRouter();
  const { t, tf, lang } = useI18n();
  const joined = useStore((s) => s.joined.includes(activity.id));
  const spots = spotsLeft(activity, joined);
  const host = people[activity.hostId];
  const faces = activity.joined.slice(0, 3).map((id) => people[id].face);

  return (
    <TapCard
      onPress={() => router.push(`/activity/${activity.id}`)}
      label={t(activity.title)}
      style={{ padding: 12 }}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Image
          source={activity.thumb}
          style={{ width: 68, height: 68, borderRadius: radius.mediaLarge }}
          resizeMode="cover"
        />
        <View style={{ flexGrow: 1, flexShrink: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flexShrink: 1 }}>
              <Txt f="bold" size={15} em={-0.01}>
                {t(activity.title)}
              </Txt>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 5 }}>
                {`${t(activity.whenPrefix)} ${formatTime(activity.time, lang)} · ${activity.venue}`}
              </Txt>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Txt f="display" size={17} em={-0.02} lh={1}>
                {activity.price != null ? `₺${activity.price}` : t('Free')}
              </Txt>
              {activity.price != null ? (
                <Txt f="semibold" size={10.5} c={color.inkMuted} style={{ marginTop: 3 }}>
                  {t('per person')}
                </Txt>
              ) : null}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            <LevelPill activity={activity} />
            {joined ? (
              <StatePill label={t("YOU'RE IN")} height={24} size={10.5} />
            ) : (
              <MetaPill label={spotsLabel(spots, t)} tone="orange" />
            )}
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 9,
          marginTop: 11,
          paddingTop: 11,
          borderTopWidth: 1,
          borderTopColor: color.lineOnSurface,
        }}
      >
        <AvatarStack faces={faces} size={22} ring={color.surface} overlap={8} />
        <Txt f="medium" size={11.5} c={color.inkMuted} style={{ flexGrow: 1 }}>
          {tf('{name} hosts', { name: host.first })}
        </Txt>
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {tf('{n} km away', { n: formatDecimal(activity.distanceKm, lang) })}
        </Txt>
      </View>
    </TapCard>
  );
}

/**
 * The level a game asks for. A rated game shows the star band; an open one keeps
 * its own words ("All levels", "All paces", "Sub-5:00 pace").
 */
function LevelPill({ activity }: { activity: Activity }) {
  const { t } = useI18n();
  const band = starBand(activity.levelMin, activity.levelMax);

  if (!band) return <MetaPill label={t(activity.levelLabel)} />;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        paddingHorizontal: 9,
        borderRadius: radius.pill,
        backgroundColor: color.paper,
        borderWidth: 1,
        borderColor: color.lineOnSurface,
      }}
    >
      <StarRange lo={band.lo} hi={band.hi} />
    </View>
  );
}

/** The compact "also near you" row on Discover. */
export function ActivityRow({ activity }: { activity: Activity }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const joined = useStore((s) => s.joined.includes(activity.id));
  const spots = spotsLeft(activity, joined);

  return (
    <TapCard
      onPress={() => router.push(`/activity/${activity.id}`)}
      label={t(activity.title)}
      style={{ flexDirection: 'row', gap: 12, padding: 12 }}
    >
      <Image
        source={activity.thumb}
        style={{ width: 68, height: 68, borderRadius: radius.media }}
        resizeMode="cover"
      />
      <View style={{ flexGrow: 1, flexShrink: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Txt f="bold" size={15} em={-0.01} numberOfLines={1} style={{ flexShrink: 1 }}>
            {t(activity.title)}
          </Txt>
          {joined ? <StatePill label={t("YOU'RE IN")} height={20} size={9.5} /> : null}
        </View>
        <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 5 }}>
          {`${t(activity.whenPrefix)} ${formatTime(activity.time, lang)} · ${activity.venue}`}
        </Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 }}>
          <Icon name="users-three" size={14} color={color.inkMuted} />
          <Txt f="semibold" size={11.5} c={spots === 1 ? color.orangeDeep : color.inkMuted}>
            {spotsLabel(spots, t)}
          </Txt>
        </View>
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Txt f="display" size={16} em={-0.02}>
          {activity.price != null ? `₺${activity.price}` : t('Free')}
        </Txt>
      </View>
    </TapCard>
  );
}

/**
 * The Games "this week" card: a date tile instead of a photo, because the list is
 * read by when, not by what it looks like.
 * Source: design/src/Games.body.html
 */
export function GameCard({
  activity,
  raised = false,
  hosting = false,
}: {
  activity: Activity;
  raised?: boolean;
  hosting?: boolean;
}) {
  const router = useRouter();
  const { t, tf, lang } = useI18n();
  const joined = useStore((s) => s.joined.includes(activity.id));
  const spots = spotsLeft(activity, joined);
  const faces = activity.joined.slice(0, 3).map((id) => people[id].face);
  const inCount = activity.joined.length + (joined ? 1 : 0);

  return (
    <TapCard
      onPress={() => router.push(`/activity/${activity.id}`)}
      raised={raised}
      label={t(activity.title)}
      style={{ flexDirection: 'row', gap: 12, padding: 12 }}
    >
      <View
        style={{
          width: 52,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          paddingVertical: 8,
          borderRadius: radius.tile,
          backgroundColor: raised ? color.blueTint : color.paper,
        }}
      >
        <Txt f="bold" size={10.5} em={0.06} c={raised ? color.blueDeep : color.inkMuted}>
          {t(activity.dayShort)}
        </Txt>
        <Txt f="display" size={21} em={-0.03} lh={1} c={raised ? color.blueDeep : color.ink}>
          {activity.dayNum}
        </Txt>
      </View>

      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <Txt f="bold" size={15} em={-0.01} numberOfLines={1} style={{ flexShrink: 1 }}>
            {t(activity.title)}
          </Txt>
          {hosting ? (
            <StatePill label={t('HOSTING')} height={20} size={9.5} tone="orangeTint" />
          ) : (
            <StatePill label={t("YOU'RE IN")} height={20} size={9.5} />
          )}
        </View>

        <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 5 }}>
          {`${formatTime(activity.time, lang)} · ${activity.venue}`}
        </Txt>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 }}>
          {spots > 0 ? (
            <>
              <AvatarStack faces={faces} size={26} ring={color.surface} overlap={9} />
              <Txt f="semibold" size={12} c={color.orangeDeep}>
                {spots === 1 ? t('1 spot still open') : tf('{n} spots still open', { n: spots })}
              </Txt>
            </>
          ) : (
            <>
              <Icon name="users-three" size={15} color={color.inkMuted} />
              <Txt f="semibold" size={12} c={color.inkMuted}>
                {ofInLabel(inCount, activity.capacity, lang, t)}
              </Txt>
            </>
          )}
        </View>
      </View>
    </TapCard>
  );
}

/** The Discover people rail card. */
export function PlayerCard({ person }: { person: Person }) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const main = person.sports[0];
  const stars = main?.level ? starsOf(Number(main.level)) : null;

  return (
    <TapCard
      onPress={() => router.push(`/player/${person.id}`)}
      label={person.name}
      r={18}
      style={{ width: 138, padding: 12 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Avatar source={person.face} size={40} />
        {person.verified ? <Icon name="seal-check" size={18} color={color.blue} /> : null}
      </View>
      <Txt f="bold" size={14} em={-0.01} style={{ marginTop: 8 }}>
        {person.short}
      </Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
        <Txt f="medium" size={12} c={color.inkMuted}>
          {t(sportLabel(main.sport))}
        </Txt>
        {stars != null ? <LevelStars n={stars} size={10} gap={1} /> : null}
      </View>
      <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 3 }}>
        {`${formatDecimal(person.distanceKm, lang)} km`}
      </Txt>
    </TapCard>
  );
}

/** The 52px roster tile on the activity screen and the create form. */
export function RosterSlot({
  person,
  isHost,
  isYou,
  levelText,
  onPress,
}: {
  person?: Person;
  isHost?: boolean;
  isYou?: boolean;
  levelText?: string;
  onPress?: () => void;
}) {
  const { t } = useI18n();
  return (
    <PressScale
      onPress={onPress}
      to={0.94}
      haptic="none"
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={person?.name ?? t('You')}
      style={{ flexGrow: 1, flexBasis: 0, minWidth: 0, alignItems: 'center', gap: 7 }}
    >
      <View style={{ width: 52, height: 52 }}>
        {isYou || !person ? <YouAvatar size={52} /> : <Avatar source={person.face} size={52} />}
        {isHost ? (
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 20,
              height: 20,
              borderRadius: radius.pill,
              backgroundColor: color.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="seal-check" size={16} color={color.blue} />
          </View>
        ) : null}
      </View>
      <Txt f="semibold" size={12} numberOfLines={1}>
        {isYou ? t('You') : (person?.first ?? '')}
      </Txt>
      {isHost ? (
        <Txt f="bold" size={10} em={0.06} c={color.orangeDeep}>
          {t('HOST')}
        </Txt>
      ) : (
        <Txt f="semibold" size={10} c={color.inkMuted}>
          {levelText ?? ''}
        </Txt>
      )}
    </PressScale>
  );
}

/** The review card on a profile. */
export function ReviewCard({
  by,
  when,
  text,
  tags,
}: {
  by: Person;
  when: string;
  text: string;
  tags: string[];
}) {
  const { t } = useI18n();
  return (
    <Card style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar source={by.face} size={32} />
        <Txt f="bold" size={13} style={{ flexGrow: 1 }}>
          {by.short}
        </Txt>
        <Txt f="medium" size={11.5} c={color.inkMuted}>
          {t(when)}
        </Txt>
      </View>
      <Txt f="medium" size={13.5} lh={1.45} style={{ marginTop: 10 }}>
        {t(text)}
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
        {tags.map((tag) => (
          <View
            key={tag}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              height: 26,
              paddingHorizontal: 10,
              borderRadius: radius.pill,
              backgroundColor: color.paper,
              borderWidth: 1,
              borderColor: color.lineOnSurface,
            }}
          >
            <Icon name="check" size={13} color={color.ink} />
            <Txt f="semibold" size={11.5}>
              {t(tag)}
            </Txt>
          </View>
        ))}
      </View>
    </Card>
  );
}

export const cardGutter = gutter;
