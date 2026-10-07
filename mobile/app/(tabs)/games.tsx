import React, { useMemo, useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  Segmented,
  Card,
  TapCard,
  AvatarStack,
  EmptyState,
  useTopPad,
} from '../../src/components/ui';
import { GameCard } from '../../src/components/cards';
import { PressScale, EnterUp } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import type { Activity } from '../../src/data/seed';
import { people, pastGames, you } from '../../src/data/seed';
import { useAllActivities, useHostedIds } from '../../src/data/activities';

/** Source: design/src/Games.body.html */
export default function Games() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();

  const joined = useStore((s) => s.joined);
  const ratedGames = useStore((s) => s.ratedGames);
  const [tab, setTab] = useState<'upcoming' | 'played'>('upcoming');

  const all = useAllActivities();
  const hosted = useHostedIds();

  // Your games are the ones you joined AND the ones you published. Publishing
  // used to write to the store and show up nowhere you could tap — the event
  // existed, but "where is the event I created?" was a fair question.
  const mine = useMemo(() => {
    const ids = new Set([...hosted, ...joined]);
    return all.filter((a) => ids.has(a.id)).sort((a, b) => a.daysAway - b.daysAway);
  }, [all, hosted, joined]);

  // this week is everything inside seven days; the rest falls under "later"
  const thisWeek = mine.filter((a) => a.daysAway <= 6);
  const later = mine.filter((a) => a.daysAway > 6);

  const toRate = pastGames.filter((g) => !g.rated && !ratedGames.includes(g.id));
  const played = pastGames.filter((g) => g.rated || ratedGames.includes(g.id));

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
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
          <Txt f="display" size={28} em={-0.035}>
            {t('Your games')}
          </Txt>
          <RoundButton icon="calendar-blank" size={19} label={t('Calendar')} />
        </View>

        <View style={{ marginTop: 8, marginHorizontal: gutter }}>
          <Segmented
            options={[
              { key: 'upcoming', label: t('Upcoming') },
              { key: 'played', label: t('Played') },
            ]}
            value={tab}
            onChange={(k) => setTab(k as 'upcoming' | 'played')}
          />
        </View>

        {/* the outstanding rating always sits at the top, whichever tab you are on */}
        {toRate.length ? (
          <EnterUp index={0}>
            <RatePrompt
              faces={toRate[0].players.slice(0, 2).map((p) => people[p].face)}
              count={toRate[0].players.length}
              title={t(toRate[0].promptTitle)}
              onPress={() => router.push('/rate')}
            />
          </EnterUp>
        ) : null}

        {tab === 'upcoming' ? (
          <Upcoming
            thisWeek={thisWeek}
            later={later}
            hosted={hosted}
            onFind={() => router.push('/(tabs)')}
          />
        ) : (
          <Played games={played} onRate={() => router.push('/rate')} />
        )}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------- upcoming -- */

function Upcoming({
  thisWeek,
  later,
  hosted,
  onFind,
}: {
  thisWeek: Activity[];
  later: Activity[];
  hosted: string[];
  onFind: () => void;
}) {
  const { t, tf } = useI18n();

  if (!thisWeek.length && !later.length) {
    return (
      <EmptyState
        icon="calendar-plus"
        title={t('No games booked yet')}
        body={t('Join one from Discover and it lands here, with everything you need on the night.')}
        action={t('Find a game')}
        onAction={onFind}
      />
    );
  }

  return (
    <>
      {thisWeek.length ? (
        <>
          <Head
            label={t('THIS WEEK')}
            right={thisWeek.length === 1 ? t('1 game') : tf('{n} games', { n: thisWeek.length })}
          />
          <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
            {thisWeek.map((a, i) => (
              <EnterUp key={a.id} index={i + 1}>
                <GameCard activity={a} raised={i === 0} hosting={hosted.includes(a.id)} />
              </EnterUp>
            ))}
          </View>
        </>
      ) : null}

      {later.length ? (
        <>
          <Head label={t('LATER')} />
          <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
            {later.map((a, i) => (
              <EnterUp key={a.id} index={i + 1}>
                <GameCard activity={a} hosting={hosted.includes(a.id)} />
              </EnterUp>
            ))}
          </View>
        </>
      ) : null}

    </>
  );
}

/* ---------------------------------------------------------------- played -- */

function Played({
  games,
  onRate,
}: {
  games: typeof pastGames;
  onRate: () => void;
}) {
  const { t, tf } = useI18n();

  if (!games.length) {
    return (
      <EmptyState
        icon="trophy"
        title={t('Nothing played yet')}
        body={t('Once a game is done it moves here, and the people you played with can rate you.')}
      />
    );
  }

  return (
    <>
      <Head label={t('LAST WEEK')} />
      <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
        {games.map((g, i) => (
          <EnterUp key={g.id} index={i + 1}>
            <TapCard onPress={onRate} label={g.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
              <Image
                source={g.thumb}
                style={{ width: 52, height: 52, borderRadius: radius.tile }}
                resizeMode="cover"
              />
              <View style={{ flexGrow: 1, flexShrink: 1 }}>
                <Txt f="bold" size={15} em={-0.01}>
                  {t(g.title)}
                </Txt>
                <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
                  {`${t(g.dateLine)} · ${g.venue}`}
                </Txt>
              </View>
              <Icon name="seal-check" size={20} color={color.blue} />
            </TapCard>
          </EnterUp>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 18,
          paddingHorizontal: gutter,
        }}
      >
        <Icon name="trophy" size={15} color={color.inkMuted} />
        <Txt f="semibold" size={12.5} c={color.inkMuted}>
          {tf('{n} games played since {month}', {
            n: you.gamesPlayed + games.length,
            month: t(you.memberSince),
          })}
        </Txt>
      </View>
    </>
  );
}

/* ----------------------------------------------------------------- parts -- */

function Head({ label, right }: { label: string; right?: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingTop: 22,
        paddingHorizontal: gutter,
      }}
    >
      <SectionHead>{label}</SectionHead>
      {right ? (
        <Txt f="semibold" size={13} c={color.inkMuted}>
          {right}
        </Txt>
      ) : null}
    </View>
  );
}

/**
 * The orange-tint prompt at the top of Games. Orange fills carry ink, never white
 * — and this is the one place on the screen the accent is spent.
 */
function RatePrompt({
  faces,
  count,
  title,
  onPress,
}: {
  faces: any[];
  count: number;
  title: string;
  onPress: () => void;
}) {
  const { t, tf } = useI18n();
  return (
    <PressScale
      onPress={onPress}
      to={0.985}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
        marginHorizontal: gutter,
        padding: 14,
        backgroundColor: color.orangeTint,
        borderRadius: radius.card,
      }}
    >
      <AvatarStack faces={faces} size={38} ring={color.orangeTint} overlap={14} />
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <Txt f="bold" size={14} em={-0.01}>
          {title}
        </Txt>
        <Txt f="medium" size={12.5} style={{ marginTop: 3 }}>
          {tf('{n} players waiting · takes 20 seconds', { n: count })}
        </Txt>
      </View>
      <View
        style={{
          height: 36,
          paddingHorizontal: 14,
          borderRadius: radius.pill,
          backgroundColor: color.ink,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Txt f="bold" size={13} c={color.surface}>
          {t('Rate')}
        </Txt>
      </View>
    </PressScale>
  );
}
