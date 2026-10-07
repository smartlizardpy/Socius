import React, { useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  PrimaryButton,
  GhostButton,
  Card,
  StatCard,
  StarRow,
  SportLevel,
  ReliabilityStrip,
  WeekBars,
  SectionRow,
  BottomBar,
  Avatar,
  Toast,
  useToast,
  useTopPad,
} from '../../src/components/ui';
import { ReviewCard, ActivityRow } from '../../src/components/cards';
import { EnterUp } from '../../src/components/motion';
import { ReliabilityCard } from '../../src/components/cards';
import { useI18n, formatPercent, formatDecimal, weekDays } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  img,
  people,
  reviewsFor,
  activities,
  levelScales,
  sportLabel,
  sportIcon,
  starsOf,
  type PersonId,
  personReliability,} from '../../src/data/seed';

/** Source: design/src/Profile.body.html — another player's profile. */
export default function Player() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const [toast, showToast] = useToast();

  const following = useStore((s) => s.following);
  const toggleFollow = useStore((s) => s.toggleFollow);

  const person = people[String(id) as PersonId];
  if (!person) return <View style={{ flex: 1, backgroundColor: color.paper }} />;

  const isFollowing = following.includes(person.id);
  const reviews = reviewsFor[person.id] ?? [];
  const hosting = activities.filter((a) => a.hostId === person.id);

  // the tags this player is cited for most
  const topTags = useMemo(() => {
    const count = new Map<string, number>();
    reviews.forEach((r) => r.tags.forEach((t2) => count.set(t2, (count.get(t2) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t2]) => t2);
  }, [reviews]);

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 48,
            paddingTop: top,
            paddingHorizontal: gutter,
          }}
        >
          <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <RoundButton
              icon="share-network"
              size={19}
              label={t('Share')}
              onPress={() => showToast(tf('{name} — profile link copied', { name: person.first }))}
            />
            <RoundButton
              icon="dots-three"
              label={t('More')}
              onPress={() => showToast(t('Report and block land here in the next build'))}
            />
          </View>
        </View>

        {/* identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 14, paddingHorizontal: gutter }}>
          <View style={{ width: 74, height: 74 }}>
            <Avatar source={person.face} size={74} />
            {person.verified ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -3,
                  width: 26,
                  height: 26,
                  borderRadius: radius.pill,
                  backgroundColor: color.paper,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="seal-check" size={22} color={color.blue} />
              </View>
            ) : null}
          </View>

          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <Txt f="display" size={26} em={-0.035} lh={1.1}>
              {person.name}
            </Txt>
            <Txt f="medium" size={13} c={color.inkMuted} style={{ marginTop: 5 }}>
              {`${person.handle} · ${person.area}`}
            </Txt>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
              <Stat n={person.followers + (isFollowing ? 1 : 0)} label={t('followers')} />
              <Stat n={person.hosted} label={t('hosted')} />
            </View>
          </View>
        </View>

        {/* their levels */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 16, paddingHorizontal: gutter }}
        >
          {person.sports.map((s, i) => {
            const scale = levelScales[s.sport];
            const stars = scale?.kind === 'rating' && s.level ? starsOf(Number(s.level)) : null;
            return (
              <View
                key={s.sport}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  height: 36,
                  paddingHorizontal: 13,
                  borderRadius: radius.pill,
                  backgroundColor: i === 0 ? color.blueTint : color.surface,
                  ...(i === 0 ? null : { borderWidth: 1, borderColor: color.lineOnPaper }),
                }}
              >
                <Icon
                  name={sportIcon(s.sport)}
                  size={16}
                  color={i === 0 ? color.blueDeep : color.inkMuted}
                />
                <SportLevel
                  label={t(sportLabel(s.sport))}
                  stars={stars}
                  c={i === 0 ? color.blueDeep : color.ink}
                  starSize={11}
                />
              </View>
            );
          })}
        </ScrollView>

        {/* reliability */}
        <EnterUp index={0} style={{ marginTop: 20, marginHorizontal: gutter }}>
          <ReliabilityCard person={person} since="Sep 2025" />
        </EnterUp>

        {/* rating + when they play */}
        {/* alignItems stretch: the two cards hold different amounts of copy and
            were ending at different heights, leaving a ragged bottom edge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: 12,
            marginTop: 10,
            marginHorizontal: gutter,
          }}
        >
          <EnterUp index={1} style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
            <StatCard head={t('RATING')} style={{ flexGrow: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <Txt f="display" size={26} em={-0.03} lh={1}>
                  {formatDecimal(person.rating, lang)}
                </Txt>
                <StarRow value={person.rating} />
              </View>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 7 }}>
                {tf('from {n} players', { n: person.ratingCount })}
              </Txt>

              {/* the card was stretched to match its neighbour and left half
                  empty; what players actually said fills it with substance */}
              <View style={{ gap: 6, marginTop: 12 }}>
                {topTags.map((tag) => (
                  // two lines, not one: the card is half-width and the Turkish
                  // for "Fun to play with" overruns it. Truncating a three-word
                  // phrase to "Birlikte oynaması ke…" says less than wrapping.
                  <View key={tag} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                    <Icon name="check" size={13} color={color.blue} />
                    <Txt
                      f="semibold"
                      size={11.5}
                      lh={1.25}
                      c={color.inkMuted}
                      numberOfLines={2}
                      style={{ flexShrink: 1 }}
                    >
                      {t(tag)}
                    </Txt>
                  </View>
                ))}
              </View>
            </StatCard>
          </EnterUp>

          <EnterUp index={2} style={{ flexGrow: 1, flexBasis: 0, minWidth: 0 }}>
            <StatCard head={t('PLAYS ON')} style={{ flexGrow: 1 }}>
              <View style={{ marginTop: 10 }}>
                <WeekBars values={person.playsOn} days={weekDays(lang)} />
              </View>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 8 }} numberOfLines={2}>
                {t(person.playsWhen)}
              </Txt>
            </StatCard>
          </EnterUp>
        </View>

        {/* what they host */}
        {hosting.length ? (
          <>
            <SectionRow
              head={tf('{name} IS HOSTING', {
                name: person.first.toLocaleUpperCase(lang === 'tr' ? 'tr' : 'en'),
              })}
            />
            <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
              {hosting.slice(0, 2).map((a) => (
                <ActivityRow key={a.id} activity={a} />
              ))}
            </View>
          </>
        ) : null}

        {/* reviews */}
        {reviews.length ? (
          <>
            <SectionRow
              head={t('WHAT PLAYERS SAY')}
              action={tf('All {n}', { n: person.ratingCount })}
              onAction={() => showToast(t('All reviews land here in the next build'))}
            />
            <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
              {reviews.map((r) => (
                <ReviewCard key={r.id} by={people[r.by]} when={r.when} text={r.text} tags={r.tags} />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <Toast message={toast} bottom={110} />

      <BottomBar bg={color.surface} top={14} border>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {isFollowing ? (
            <GhostButton
              label={t('Following')}
              icon="check"
              onPress={() => toggleFollow(person.id)}
              style={{ flexGrow: 1, flexBasis: 0 }}
            />
          ) : (
            <PrimaryButton
              label={t('Follow')}
              icon={null}
              height={52}
              onPress={() => {
                toggleFollow(person.id);
                showToast(tf('Now following {name}', { name: person.first }));
              }}
              style={{ flexGrow: 1, flexBasis: 0 }}
            />
          )}
          <GhostButton
            label={t('Invite')}
            icon="plus"
            onPress={() => showToast(tf('{name} invited to your next game', { name: person.first }))}
            style={{ flexGrow: 1, flexBasis: 0 }}
          />
        </View>
      </BottomBar>
    </View>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
      <Txt f="bold" size={12.5}>
        {String(n)}
      </Txt>
      <Txt f="medium" size={12.5} c={color.inkMuted}>
        {label}
      </Txt>
    </View>
  );
}
