import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { color, radius, gutter, elevation } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt } from '../../src/components/Txt';
import {
  AvatarStack,
  BellButton,
  Chip,
  LevelRail,
  LevelStars,
  StarRange,
  StatePill,
  UrgencyPill,
  RoundButton,
  SectionRow,
  Sheet,
  SheetOption,
  Toast,
  useToast,
  useTopPad,
} from '../../src/components/ui';
import { ActivityRow, PlayerCard, spotsLabel, useJoinFlow } from '../../src/components/cards';
import { useAllActivities, useHostedIds } from '../../src/data/activities';
import { EnterUp, PressScale } from '../../src/components/motion';
import { useI18n, formatTime } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  img,
  people,
  playersAtYourLevel,
  sportFilters,
  cities,
  courses,
  spotsLeft,
  starBand,
  starsOf,
  matchReasonFor,
  eligible,
  levelForSport,
  sportLabel,
  you,
  type Activity,
  type SportKey,
  personReliability,} from '../../src/data/seed';

/** Source: design/src/Main.body.html */
export default function Discover() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();
  const [toast, showToast] = useToast();
  const [filter, setFilter] = useState<SportKey | 'all'>('all');
  const [citySheet, setCitySheet] = useState(false);

  const city = useStore((s) => s.city);
  const setCity = useStore((s) => s.setCity);
  const seen = useStore((s) => s.seenNotifications);
  const created = useStore((s) => s.created);

  const all = useAllActivities();
  const hosted = useHostedIds();
  const levels = useStore((s) => s.levels);

  // A game you are not eligible for is not shown at all. The only ones that
  // survive an out-of-band level are those whose host opted to hear from
  // players outside their range — and your own, which are always yours.
  const open = all.filter((a) => hosted.includes(a.id) || eligible(a, levels));
  const list = filter === 'all' ? open : open.filter((a) => a.sport === filter);
  const [featured, ...rest] = list;

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: gutter,
            paddingTop: top,
            minHeight: 48 + top,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Image source={img.mark} style={{ width: 30, height: 30 }} resizeMode="contain" />
            <Txt f="display" size={20} em={-0.03}>
              avenza
            </Txt>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <PressScale
              onPress={() => setCitySheet(true)}
              to={0.96}
              accessibilityRole="button"
              accessibilityLabel={`${t('Neighbourhood')}: ${city}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                height: 44,
                paddingLeft: 10,
                paddingRight: 12,
                borderRadius: radius.pill,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.lineOnPaper,
              }}
            >
              <Icon name="map-pin" size={15} color={color.orange} />
              <Txt f="semibold" size={13}>
                {city}
              </Txt>
              <Icon name="caret-down" size={11} color={color.inkMuted} />
            </PressScale>

            <RoundButton
              icon="newspaper"
              size={19}
              onPress={() => router.push('/bulletin')}
              label={t('Bulletin')}
            />
            <BellButton unread={!seen.includes('*')} onPress={() => router.push('/notifications')} />
          </View>
        </View>

        {/* headline */}
        <View style={{ paddingTop: 8, paddingHorizontal: gutter }}>
          <Txt f="display" size={31} em={-0.035} lh={1.06} style={{ maxWidth: 300 }}>
            {`${t('What are you')}\n${t('playing tonight?')}`}
          </Txt>
          <Txt f="medium" size={14} lh={1.35} c={color.inkMuted} style={{ marginTop: 8 }}>
            {tf('{n} activities within 5 km of {city} this week', {
              n: you.activitiesNearby,
              city,
            })}
          </Txt>
        </View>

        {/* sport filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 14, paddingHorizontal: gutter }}
        >
          {sportFilters.map((f) => (
            <Chip
              key={f.key}
              label={t(f.label)}
              icon={f.icon}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
              height={38}
            />
          ))}
        </ScrollView>

        {/* featured activity */}
        {featured ? (
          <EnterUp index={0} key={featured.id}>
            <FeaturedCard activity={featured} onToast={showToast} />
          </EnterUp>
        ) : null}

        {/* people rail */}
        <SectionRow
          head={t('PLAYERS AT YOUR LEVEL')}
          action={t('See all')}
          onAction={() => router.push('/players')}
          top={16}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingTop: 10, paddingHorizontal: gutter }}
        >
          {playersAtYourLevel.map((id, i) => (
            <EnterUp key={id} index={i + 1}>
              <PlayerCard person={people[id]} />
            </EnterUp>
          ))}
        </ScrollView>

        {/* also near you */}
        {rest.length ? (
          <>
            <SectionRow
              head={t('ALSO NEAR YOU')}
              action={t('Filters')}
              onAction={() => router.push('/(tabs)/search')}
              top={14}
            />
            <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
              {rest.map((a, i) => (
                <EnterUp key={a.id} index={i + 4}>
                  <ActivityRow activity={a} />
                </EnterUp>
              ))}
            </View>
          </>
        ) : null}

        {/* what you published, if anything */}
        {created.length ? (
          <>
            <SectionRow head={t('YOU ARE HOSTING')} top={20} />
            <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
              {created.map((c) => (
                <View
                  key={c.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    backgroundColor: color.surface,
                    borderWidth: 1,
                    borderColor: color.lineOnSurface,
                    borderRadius: radius.card,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.tile,
                      backgroundColor: color.orangeTint,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="magic-wand" size={20} color={color.orangeDeep} />
                  </View>
                  <View style={{ flexGrow: 1, flexShrink: 1 }}>
                    <Txt f="bold" size={15} em={-0.01}>
                      {`${t(c.sport.charAt(0).toUpperCase() + c.sport.slice(1))} · ${t(c.format)}`}
                    </Txt>
                    <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
                      {`${c.dateLine} · ${c.venue}`}
                    </Txt>
                  </View>
                  <StatePill label={t('LIVE')} height={22} size={9.5} tone="orangeTint" />
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* courses — the other half of the supply side */}
        <SectionRow head={t('LEARN A SPORT')} top={20} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}
        >
          {courses.map((c) => (
            <PressScale
              key={c.id}
              onPress={() => router.push(`/course/${c.id}`)}
              to={0.985}
              haptic="none"
              accessibilityRole="button"
              accessibilityLabel={t(c.title)}
              style={{
                width: 236,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                borderRadius: radius.card,
                overflow: 'hidden',
              }}
            >
              <Image source={c.thumb} style={{ width: '100%', height: 92 }} resizeMode="cover" />
              <View style={{ padding: 12 }}>
                <Txt f="bold" size={14.5} em={-0.01} numberOfLines={1}>
                  {t(c.title)}
                </Txt>
                <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 4 }} numberOfLines={1}>
                  {t(c.schedule)}
                </Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 }}>
                  <Txt f="display" size={16} em={-0.02}>
                    {`₺${c.price.toLocaleString('tr-TR')}`}
                  </Txt>
                  <Txt f="semibold" size={11} c={color.inkMuted} style={{ flexGrow: 1 }}>
                    {t(c.priceNote)}
                  </Txt>
                  <Icon name="caret-right" size={16} color={color.inkMuted} />
                </View>
              </View>
            </PressScale>
          ))}
        </ScrollView>
      </ScrollView>

      <Toast message={toast} bottom={16} />

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

/* -------------------------------------------------------------- featured -- */

function FeaturedCard({ activity, onToast }: { activity: Activity; onToast: (m: string) => void }) {
  const router = useRouter();
  const { t, tf, lang } = useI18n();
  const joinFlow = useJoinFlow();

  const joined = useStore((s) => s.joined.includes(activity.id));
  const isSaved = useStore((s) => s.saved.includes(activity.id));
  const toggleSaved = useStore((s) => s.toggleSaved);
  const levels = useStore((s) => s.levels);
  const myLevel = levelForSport(levels, activity.sport);

  const host = people[activity.hostId];
  const spots = spotsLeft(activity, joined);
  const band = starBand(activity.levelMin, activity.levelMax);
  const matchSport = matchReasonFor(activity, myLevel);

  const open = () => router.push(`/activity/${activity.id}`);

  return (
    // A plain shell, not one big button: the bookmark, the host and Join are all
    // controls of their own, and a button inside a button is invalid on web and
    // swallows the inner press on native. The photo and the title carry the tap
    // through to the detail screen instead.
    <View
      style={{
        marginTop: 14,
        marginHorizontal: gutter,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.lineOnSurface,
        borderRadius: radius.cardLarge,
        ...elevation,
      }}
    >
      {/* media */}
      <View
        style={{
          height: 118,
          borderTopLeftRadius: radius.cardLarge,
          borderTopRightRadius: radius.cardLarge,
          overflow: 'hidden',
        }}
      >
        <PressScale
          onPress={open}
          to={1}
          haptic="none"
          accessibilityRole="button"
          accessibilityLabel={t(activity.title)}
          style={{ width: '100%', height: '100%' }}
        >
          <Image source={activity.card} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(11,46,122,0.28)', 'rgba(11,46,122,0)', 'rgba(16,26,43,0.42)']}
            locations={[0, 0.46, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </PressScale>

        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {joined ? (
            <StatePill label={t("YOU'RE IN")} />
          ) : (
            <UrgencyPill label={spotsLabel(spots, t, true)} />
          )}
          <PressScale
            onPress={() => {
              toggleSaved(activity.id);
              onToast(isSaved ? t('Removed from saved') : t('Saved for later'));
            }}
            to={0.9}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? t('Remove from saved') : t('Save for later')}
            // the disc keeps its drawn 30px; the target around it clears 44
            style={{ padding: 7, margin: -7 }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: radius.pill,
                backgroundColor: color.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name={isSaved ? 'bookmark-simple-fill' : 'bookmark-simple'}
                size={16}
                color={isSaved ? color.blue : color.ink}
              />
            </View>
          </PressScale>
        </View>

        {matchSport ? (
          <View
            style={{
              position: 'absolute',
              left: 12,
              bottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              height: 28,
              paddingLeft: 9,
              paddingRight: 11,
              borderRadius: radius.pill,
              backgroundColor: color.surface,
            }}
          >
            <Icon name="lightning" size={14} color={color.blue} />
            <Txt f="semibold" size={12}>
              {tf('Matches your {sport} level', { sport: t(sportLabel(matchSport)).toLowerCase() })}
            </Txt>
          </View>
        ) : null}
      </View>

      {/* body */}
      <View style={{ padding: 16 }}>
        <PressScale
          onPress={open}
          to={0.995}
          haptic="none"
          accessibilityRole="button"
          accessibilityLabel={t(activity.title)}
          style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}
        >
          <View style={{ flexShrink: 1 }}>
            <Txt f="display" size={19} em={-0.02} lh={1.15}>
              {t(activity.title)}
            </Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 7, flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="clock" size={15} color={color.inkMuted} />
                <Txt f="medium" size={13} c={color.inkMuted}>
                  {`${t(activity.whenPrefix)} ${formatTime(activity.time, lang)}`}
                </Txt>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="map-pin" size={15} color={color.inkMuted} />
                <Txt f="medium" size={13} c={color.inkMuted}>
                  {activity.venue}
                </Txt>
              </View>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Txt f="display" size={19} em={-0.02}>
              {activity.price != null ? `₺${activity.price}` : t('Free')}
            </Txt>
            {activity.price != null ? (
              <Txt f="semibold" size={11} em={0.02} c={color.inkMuted}>
                {t('per person')}
              </Txt>
            ) : null}
          </View>
        </PressScale>

        {/* where you sit in the band */}
        {band && activity.levelMin != null && activity.levelMax != null ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <StarRange lo={band.lo} hi={band.hi} size={12} c={color.inkMuted} />
            <LevelRail min={activity.levelMin} max={activity.levelMax} you={myLevel} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Txt f="bold" size={12} c={color.orangeDeep}>
                {t('you')}
              </Txt>
              <LevelStars n={starsOf(myLevel)} size={11} />
            </View>
          </View>
        ) : null}

        {/* host + join */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 16,
          }}
        >
          <PressScale
            onPress={() => router.push(`/player/${host.id}`)}
            to={0.97}
            haptic="none"
            accessibilityRole="button"
            accessibilityLabel={host.name}
            drawnHeight={34}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 }}
          >
            <AvatarStack
              faces={activity.joined.slice(0, 3).map((id) => people[id].face)}
              size={34}
              ring={color.surface}
              overlap={11}
            />
            <View>
              <Txt f="medium" size={12} lh={1.3} c={color.inkMuted}>
                {tf('{name} hosts', { name: host.first })}
              </Txt>
              <Txt f="semibold" size={12} lh={1.3}>
                {tf('{n}% reliable', { n: personReliability(host) })}
              </Txt>
            </View>
          </PressScale>

          {joined ? (
            <View
              style={{
                height: 44,
                paddingHorizontal: 22,
                borderRadius: radius.pill,
                backgroundColor: color.blueTint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Txt f="bold" size={15} c={color.blueDeep}>
                {t("YOU'RE IN")}
              </Txt>
            </View>
          ) : (
            <PressScale
              onPress={() => {
                if (joinFlow(activity) === 'joined') onToast(t("You're in — see you there"));
              }}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t('Join')}
              style={{
                height: 44,
                paddingHorizontal: 22,
                borderRadius: radius.pill,
                backgroundColor: color.blue,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Txt f="semibold" size={15} c={color.onBlue}>
                {t('Join')}
              </Txt>
            </PressScale>
          )}
        </View>
      </View>
    </View>
  );
}
