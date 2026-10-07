import React, { useMemo, useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  Card,
  StatCard,
  StarRow,
  LevelStars,
  SportLevel,
  Chip,
  RowGroup,
  ListRow,
  ReliabilityStrip,
  WeekBars,
  Sheet,
  SheetOption,
  YouAvatar,
  SectionRow,
  Toast,
  useToast,
  useTopPad,
} from '../../src/components/ui';
import { ReviewCard } from '../../src/components/cards';
import { PressScale, EnterUp } from '../../src/components/motion';
import { ReliabilityCard } from '../../src/components/cards';
import { useI18n, formatPercent, formatDecimal, weekDays } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  img,
  you,
  people,
  reviewsOfYou,
  levelScales,
  sportLabel,
  sportIcon,
  starsOf,
  cities,
  reliabilityOf,} from '../../src/data/seed';

/** Source: design/src/Profile.body.html — recast as your own profile. */
export default function Profile() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang, setLang } = useI18n();
  const [toast, showToast] = useToast();

  const sports = useStore((s) => s.sports);
  const levels = useStore((s) => s.levels);
  const joined = useStore((s) => s.joined);
  const saved = useStore((s) => s.saved);
  const following = useStore((s) => s.following);
  const city = useStore((s) => s.city);
  const region = useStore((s) => s.region);
  const account = useStore((s) => s.account);
  const signOut = useStore((s) => s.signOut);
  const setCity = useStore((s) => s.setCity);
  const resetDemo = useStore((s) => s.resetDemo);

  const [langSheet, setLangSheet] = useState(false);
  const [citySheet, setCitySheet] = useState(false);

  // games you have PLAYED — a game you joined for next Tuesday is neither one
  // you turned up to nor one you missed, so it cannot sit in this denominator

  // the tags players cite most, straight off the reviews already on this screen
  const topTags = useMemo(() => {
    const count = new Map<string, number>();
    reviewsOfYou.forEach((r) => r.tags.forEach((t2) => count.set(t2, (count.get(t2) ?? 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t2]) => t2);
  }, []);

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
            {t('You')}
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <RoundButton
              icon="share-network"
              size={19}
              label={t('Share')}
              onPress={() => showToast(t('Profile link copied'))}
            />
            <RoundButton icon="gear-six" size={20} label={t('Settings')} onPress={() => setLangSheet(true)} />
          </View>
        </View>

        {/* identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 14, paddingHorizontal: gutter }}>
          <View style={{ width: 74, height: 74 }}>
            <YouAvatar size={74} />
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
          </View>

          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Txt f="display" size={26} em={-0.035} lh={1.1}>
                {t('You')}
              </Txt>
            </View>
            <Txt f="medium" size={13} c={color.inkMuted} style={{ marginTop: 5 }}>
              {`${you.handle} · ${[city, region].filter(Boolean).join(', ')}`}
            </Txt>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 8 }}>
              <Stat n={you.followers} label={t('followers')} />
              <Stat n={following.length} label={t('following')} />
              <Stat n={you.hosted} label={t('hosted')} />
            </View>
          </View>
        </View>

        {/* your levels, as stars */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 16, paddingHorizontal: gutter }}
        >
          {sports.map((key, i) => {
            const scale = levelScales[key];
            const value = levels[key];
            const stars = scale?.kind === 'rating' && value ? starsOf(Number(value)) : null;
            return (
              <PressScale
                key={key}
                onPress={() => router.push('/onboarding/level')}
                to={0.97}
                accessibilityRole="button"
                accessibilityLabel={t(sportLabel(key))}
                drawnHeight={36}
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
                  name={sportIcon(key)}
                  size={16}
                  color={i === 0 ? color.blueDeep : color.inkMuted}
                />
                <SportLevel
                  label={t(sportLabel(key))}
                  stars={stars}
                  c={i === 0 ? color.blueDeep : color.ink}
                  starSize={11}
                />
                {scale?.kind === 'pace' && value ? (
                  <Txt f="semibold" size={12} c={color.inkMuted}>
                    {value}
                  </Txt>
                ) : null}
              </PressScale>
            );
          })}
          <Chip label={t('Edit')} icon="pencil-simple" onPress={() => router.push('/onboarding/sports')} />
        </ScrollView>

        {/* reliability */}
        <EnterUp index={0} style={{ marginTop: 20, marginHorizontal: gutter }}>
          <ReliabilityCard person={you} since={you.memberSince} />
        </EnterUp>

        {/* rating + when you play */}
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
                  {formatDecimal(you.rating, lang)}
                </Txt>
                <StarRow value={you.rating} />
              </View>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 7 }}>
                {tf('from {n} players', { n: you.ratingCount })}
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
                <WeekBars values={you.playsOn} days={weekDays(lang)} />
              </View>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 8 }} numberOfLines={2}>
                {t(you.playsWhen)}
              </Txt>
            </StatCard>
          </EnterUp>
        </View>

        {/* reviews */}
        <SectionRow
          head={t('WHAT PLAYERS SAY')}
          action={tf('All {n}', { n: you.ratingCount })}
          onAction={() => showToast(t('All reviews land here in the next build'))}
        />
        <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
          {reviewsOfYou.map((r) => (
            <ReviewCard key={r.id} by={people[r.by]} when={r.when} text={r.text} tags={r.tags} />
          ))}
        </View>

        {/* settings */}
        <SectionRow head={t('SETTINGS')} />
        <RowGroup style={{ marginTop: 12, marginHorizontal: gutter }}>
          {/* signing in during onboarding has to show up somewhere, or the step
              was theatre — this is where it lands, and where it comes undone */}
          <ListRow
            icon={account ? 'seal-check' : 'user'}
            label={t('Account')}
            value={
              account
                ? account.provider === 'google'
                  ? t('Signed in with Google')
                  : t('Signed in with Apple')
                : t('Not signed in')
            }
            onPress={() => {
              if (!account) {
                router.push('/onboarding/account');
                return;
              }
              signOut();
              showToast(t('Signed out'));
            }}
          />
          <ListRow
            icon="globe-hemisphere-west"
            label={t('Language')}
            value={lang === 'tr' ? 'Türkçe' : 'English'}
            onPress={() => setLangSheet(true)}
          />
          <ListRow
            icon="map-pin-area"
            label={t('Neighbourhood')}
            value={city}
            onPress={() => setCitySheet(true)}
          />
          <ListRow
            icon="bookmark-simple"
            label={t('Saved games')}
            value={String(saved.length)}
            onPress={() => router.push('/saved')}
          />
          <ListRow
            icon="bell"
            label={t('Notifications')}
            onPress={() => router.push('/notifications')}
          />
          <ListRow
            icon="arrow-clockwise"
            label={t('Reset the demo')}
            onPress={() => {
              resetDemo();
              showToast(t('Demo reset — joins, ratings and saves cleared'));
            }}
            danger
            last
          />
        </RowGroup>

        <View style={{ alignItems: 'center', paddingTop: 22 }}>
          <Image source={img.mark} style={{ width: 26, height: 26, opacity: 0.5 }} resizeMode="contain" />
          <Txt f="medium" size={11.5} c={color.inkMuted} style={{ marginTop: 8 }}>
            {`avenza · ${t('demo build')}`}
          </Txt>
        </View>
      </ScrollView>

      <Toast message={toast} bottom={16} />

      <Sheet open={langSheet} onClose={() => setLangSheet(false)} title={t('Language')}>
        <SheetOption
          label="English"
          sub="United States"
          selected={lang === 'en'}
          onPress={() => {
            setLang('en');
            setLangSheet(false);
          }}
        />
        <SheetOption
          label="Türkçe"
          sub="Türkiye"
          selected={lang === 'tr'}
          onPress={() => {
            setLang('tr');
            setLangSheet(false);
          }}
        />
      </Sheet>

      <Sheet open={citySheet} onClose={() => setCitySheet(false)} title={t('Neighbourhood')}>
        {cities.map((c) => (
          <SheetOption
            key={c}
            label={c}
            sub="İstanbul"
            selected={city === c}
            onPress={() => {
              setCity(c);
              setCitySheet(false);
            }}
          />
        ))}
      </Sheet>
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
