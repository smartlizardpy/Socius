import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { color, radius, gutter, motion } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  PrimaryButton,
  RoundButton,
  LevelRail,
  LevelStars,
  StarRange,
  StatePill,
  UrgencyPill,
  Note,
  GhostButton,
  Sheet,
  Toast,
  useToast,
  useBottomPad,
  useTopPad,
} from '../../src/components/ui';
import { RosterSlot, spotsLabel, useJoinFlow } from '../../src/components/cards';
import { VenueMap } from '../../src/components/VenueMap';
import {
  Animated,
  PressScale,
  landSpring,
  Swap,
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
} from '../../src/components/motion';
import { venueId } from '../../src/data/venues';
import { useI18n, formatDecimal, ofInLabel } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  people,
  spotsLeft,
  starBand,
  starsOf,
  inBand,
  levelForSport,
  FEE_RATE,
} from '../../src/data/seed';
import { useActivity, useHostedIds } from '../../src/data/activities';

/** Source: design/src/Activity.body.html */
export default function ActivityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const top = useTopPad();
  const bottomPad = useBottomPad();
  const { t, tf, lang } = useI18n();
  const reduced = useReducedMotion();
  const joinFlow = useJoinFlow();
  const [toast, showToast] = useToast();
  const [moreSheet, setMoreSheet] = useState(false);
  const [outsideSheet, setOutsideSheet] = useState(false);

  const activity = useActivity(String(id));
  const hosted = useHostedIds();
  const joined = useStore((s) => (activity ? s.joined.includes(activity.id) : false));
  const isSaved = useStore((s) => (activity ? s.saved.includes(activity.id) : false));
  const toggleSaved = useStore((s) => s.toggleSaved);
  const leave = useStore((s) => s.leave);
  const levels = useStore((s) => s.levels);

  if (!activity) return <View style={{ flex: 1, backgroundColor: color.surface }} />;

  const inCount = activity.joined.length + (joined ? 1 : 0);
  const spots = spotsLeft(activity, joined);
  const host = people[activity.hostId];
  const band = starBand(activity.levelMin, activity.levelMax);
  const myLevel = levelForSport(levels, activity.sport);
  const fits = inBand(activity, myLevel);
  // out of band but the host opted to hear from people anyway
  const canAsk = !fits && activity.openToAllLevels;
  const isHosting = hosted.includes(activity.id);

  // the participant row shows the players already in, then the open slot
  const roster = activity.joined.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* hero */}
        <View style={{ height: 262 }}>
          <Image source={activity.hero} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(11,46,122,0.42)', 'rgba(11,46,122,0.04)', 'rgba(11,46,122,0.10)']}
            locations={[0, 0.4, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              position: 'absolute',
              top: top + 4,
              left: gutter,
              right: gutter,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <RoundButton icon="caret-left" shadow onPress={() => router.back()} label={t('Back')} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <RoundButton
                icon={isSaved ? 'bookmark-simple-fill' : 'bookmark-simple'}
                size={19}
                shadow
                tone={isSaved ? color.blue : color.ink}
                label={isSaved ? t('Remove from saved') : t('Save for later')}
                onPress={() => {
                  toggleSaved(activity.id);
                  showToast(isSaved ? t('Removed from saved') : t('Saved for later'));
                }}
              />
              <RoundButton
                icon="share-network"
                size={19}
                shadow
                label={t('Share')}
                onPress={() => showToast(t('Link copied — send it to whoever you want in'))}
              />
              <RoundButton icon="dots-three" shadow label={t('More')} onPress={() => setMoreSheet(true)} />
            </View>
          </View>
        </View>

        {/* sheet */}
        <View
          style={{
            marginTop: -26,
            backgroundColor: color.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 22,
            paddingHorizontal: gutter,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1 }}>
              <Icon name="calendar-check" size={16} color={color.blue} />
              <Txt f="bold" size={13} em={-0.01} c={color.blue}>
                {t(activity.dateTimeLine)}
              </Txt>
            </View>
            {joined ? (
              <StatePill label={t("YOU'RE IN")} height={28} />
            ) : (
              <UrgencyPill label={spotsLabel(spots, t, true)} height={28} />
            )}
          </View>

          <Txt f="display" size={28} em={-0.035} lh={1.1} style={{ marginTop: 10 }}>
            {t(activity.headline)}
          </Txt>

          {/* level range */}
          {band && activity.levelMin != null && activity.levelMax != null ? (
            <View
              style={{
                marginTop: 14,
                padding: 12,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                borderRadius: 18,
                backgroundColor: color.paper,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <SectionHead size={11}>{t('LEVEL RANGE')}</SectionHead>
                {fits ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="seal-check" size={15} color={color.blue} />
                    <Txt f="bold" size={12} c={color.blue}>
                      {t("You're a match")}
                    </Txt>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="warning-circle" size={15} color={color.orangeDeep} />
                    <Txt f="bold" size={12} c={color.orangeDeep}>
                      {canAsk ? t('Open to all levels') : t('Outside your band')}
                    </Txt>
                  </View>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <StarRange lo={band.lo} hi={band.hi} size={12} />
                <LevelRail
                  min={activity.levelMin}
                  max={activity.levelMax}
                  you={myLevel}
                  track={color.railTrack}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Txt f="bold" size={12} c={color.orangeDeep}>
                    {t('you')}
                  </Txt>
                  <LevelStars n={starsOf(myLevel)} size={11} />
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 9,
                marginTop: 14,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                borderRadius: 18,
                backgroundColor: color.paper,
              }}
            >
              <Icon name="users-three" size={17} color={color.blue} />
              <Txt f="bold" size={13.5} em={-0.01} style={{ flexGrow: 1 }}>
                {t(activity.levelLabel)}
              </Txt>
              <Txt f="medium" size={12.5} c={color.inkMuted}>
                {t('Everyone welcome')}
              </Txt>
            </View>
          )}

          {/* venue — the caret promised a screen and used to show a toast */}
          <PressScale
            onPress={() => router.push(`/venue/${venueId(activity.venueFull)}`)}
            to={0.99}
            haptic="none"
            accessibilityRole="button"
            accessibilityLabel={activity.venueFull}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}
          >
            <VenueMap size={76} />
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
              <Txt f="bold" size={15} em={-0.01}>
                {activity.venueFull}
              </Txt>
              <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
                {activity.venueAddress}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 }}>
                <Icon name="map-trifold" size={15} color={color.blue} />
                <Txt f="semibold" size={12.5} c={color.blue}>
                  {`${formatDecimal(activity.distanceKm, lang)} km · ${t(activity.travel)}`}
                </Txt>
              </View>
            </View>
            <Icon name="caret-right" size={18} color={color.inkMuted} />
          </PressScale>

          {/* who's playing */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginTop: 20,
            }}
          >
            <SectionHead>{t("WHO'S PLAYING")}</SectionHead>
            <Swap value={inCount}>
              <Txt f="semibold" size={12} c={color.inkMuted}>
                {ofInLabel(inCount, activity.capacity, lang, t)}
              </Txt>
            </Swap>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {roster.map((pid, i) => {
              const p = people[pid];
              return (
                <RosterSlot
                  // the football roster repeats a face to reach its count
                  key={`${pid}-${i}`}
                  person={p}
                  isHost={pid === activity.hostId}
                  levelText={`${starsOf(p.level)}★`}
                  onPress={() => router.push(`/player/${p.id}`)}
                />
              );
            })}

            <OpenSlot
              joined={joined}
              reduced={reduced}
              rangeLabel={band ? `${band.lo}–${band.hi}★` : t(activity.levelLabel)}
            />
          </View>

          {/* safety note */}
          <View style={{ marginTop: 18 }}>
            <Note>
              {t('Free to leave up to 6 hours before. Late drop-outs lower your reliability score.')}
            </Note>
          </View>
        </View>
      </ScrollView>

      <Toast message={toast} bottom={100} />

      {/* pinned action bar */}
      <View
        style={{
          paddingTop: 14,
          paddingHorizontal: gutter,
          paddingBottom: bottomPad,
          backgroundColor: color.surface,
          borderTopWidth: 1,
          borderTopColor: color.lineOnSurface,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          shadowColor: '#101A2B',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <View>
          <Txt f="display" size={21} em={-0.02} lh={1}>
            {activity.price != null ? `₺${activity.price}` : t('Free')}
          </Txt>
          {activity.priceNote ? (
            <Txt f="semibold" size={11.5} c={color.inkMuted} style={{ marginTop: 3 }}>
              {/* the fee is disclosed here, not sprung at checkout */}
              {`${t(activity.priceNote)} + ${Math.round(FEE_RATE * 100)}%`}
            </Txt>
          ) : null}
        </View>

        {joined ? (
          <PressScale
            onPress={() => setMoreSheet(true)}
            to={0.98}
            accessibilityRole="button"
            accessibilityLabel={t("YOU'RE IN")}
            style={{
              flexGrow: 1,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Icon name="check" size={18} color={color.blueDeep} />
            <Txt f="bold" size={16} em={-0.01} c={color.blueDeep}>
              {t("YOU'RE IN")}
            </Txt>
          </PressScale>
        ) : isHosting ? (
          <View
            style={{
              flexGrow: 1,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: color.orangeTint,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Icon name="magic-wand" size={17} color={color.ink} />
            <Txt f="bold" size={16} em={-0.01}>
              {t('You are hosting this')}
            </Txt>
          </View>
        ) : fits ? (
          <PrimaryButton
            label={activity.price != null ? t('Join game') : t('Join for free')}
            height={52}
            size={16}
            style={{ flexGrow: 1 }}
            onPress={() => {
              if (joinFlow(activity) === 'joined') showToast(t("You're in — see you there"));
            }}
          />
        ) : canAsk ? (
          // The screen already says you are outside the range. Offering a
          // full-strength Join next to that contradicts it — so the control
          // states what it is, and explains before it commits you.
          <GhostButton
            label={t('Join anyway')}
            icon="arrow-right"
            height={52}
            onPress={() => setOutsideSheet(true)}
            style={{ flexGrow: 1 }}
          />
        ) : (
          // Out of band and the host did not open it up. Lists hide this game
          // entirely; you can only be here from a link, so the screen says why
          // rather than offering a door that is not there.
          <View
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 52,
              paddingHorizontal: 14,
              borderRadius: radius.pill,
              backgroundColor: color.paper,
              borderWidth: 1,
              borderColor: color.lineOnSurface,
            }}
          >
            <Icon name="lock-simple" size={16} color={color.inkMuted} />
            <Txt f="semibold" size={14} c={color.inkMuted} numberOfLines={1}>
              {t('Not open at your level')}
            </Txt>
          </View>
        )}
      </View>

      {/* the overflow menu, and where leaving lives */}
      <Sheet open={moreSheet} onClose={() => setMoreSheet(false)} title={t(activity.title)} maxHeight={440}>
        <MenuRow
          icon="map-trifold"
          label={t('Get directions')}
          onPress={() => {
            setMoreSheet(false);
            showToast(`${activity.venueFull} — ${t('directions open in Maps')}`);
          }}
        />
        <MenuRow
          icon="calendar-plus"
          label={t('Add to calendar')}
          onPress={() => {
            setMoreSheet(false);
            showToast(t('Added to your calendar'));
          }}
        />
        <MenuRow
          icon="chat-teardrop-text"
          label={`${t('Message')} ${host.first}`}
          onPress={() => {
            setMoreSheet(false);
            showToast(t('Messaging lands in the next build'));
          }}
        />
        <MenuRow
          icon="warning-circle"
          label={t('Report this activity')}
          onPress={() => {
            setMoreSheet(false);
            showToast(t('Thanks — we will take a look'));
          }}
        />
        {joined ? (
          <MenuRow
            icon="sign-out"
            label={t('Leave this game')}
            danger
            onPress={() => {
              leave(activity.id);
              setMoreSheet(false);
              showToast(t('You have left — your spot is open again'));
            }}
          />
        ) : null}
      </Sheet>

      {/* what "outside your band" actually means, before you commit to it */}
      <Sheet
        open={outsideSheet}
        onClose={() => setOutsideSheet(false)}
        title={t('Outside your band')}
        maxHeight={440}
      >
        <View style={{ alignItems: 'center', paddingVertical: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Txt f="bold" size={11} em={0.09} c={color.inkMuted}>
                {t('THIS GAME')}
              </Txt>
              {band ? <StarRange lo={band.lo} hi={band.hi} size={14} /> : null}
            </View>
            <View style={{ width: 1, height: 30, backgroundColor: color.lineOnPaper }} />
            <View style={{ alignItems: 'center', gap: 6 }}>
              <Txt f="bold" size={11} em={0.09} c={color.inkMuted}>
                {t('YOU')}
              </Txt>
              <LevelStars n={starsOf(myLevel)} size={14} />
            </View>
          </View>
        </View>

        <Txt f="medium" size={14} lh={1.45} c={color.inkMuted} align="center" style={{ marginTop: 18 }}>
          {tf('{host} has opened this one up beyond the range. You can ask — {host} still decides who plays.', { host: host.first })}
        </Txt>

        <PrimaryButton
          label={activity.price != null ? t('Ask to join anyway') : t('Join anyway')}
          style={{ marginTop: 20 }}
          onPress={() => {
            setOutsideSheet(false);
            if (joinFlow(activity) === 'joined') showToast(t("You're in — see you there"));
          }}
        />
        <GhostButton
          label={t('Find one at my level')}
          tone="muted"
          onPress={() => {
            setOutsideSheet(false);
            router.push('/(tabs)/search');
          }}
          style={{ marginTop: 10 }}
        />
      </Sheet>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger = false,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        height: 56,
        paddingHorizontal: 16,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.lineOnSurface,
        borderRadius: 18,
      }}
    >
      <Icon name={icon} size={19} color={danger ? color.orangeDeep : color.blue} />
      <Txt f="semibold" size={14.5} c={danger ? color.orangeDeep : color.ink} style={{ flexGrow: 1 }}>
        {label}
      </Txt>
      <Icon name="caret-right" size={16} color={color.inkMuted} />
    </PressScale>
  );
}

/**
 * The open slot. Joining fills it on a spring and the dashed ring gives way to a
 * solid one — the design ships no avatar for the user, so this uses the icon set's
 * own user glyph on ink rather than borrowing a named player's face.
 */
function OpenSlot({
  joined,
  reduced,
  rangeLabel,
}: {
  joined: boolean;
  reduced: boolean;
  rangeLabel: string;
}) {
  const { t } = useI18n();
  const fill = useSharedValue(joined ? 1 : 0);

  useEffect(() => {
    if (!joined) {
      fill.value = withTiming(0, { duration: motion.feedback });
      return;
    }
    fill.value = reduced ? withTiming(1, { duration: motion.reduced }) : withSpring(1, landSpring);
  }, [joined, reduced]);

  const filled = useAnimatedStyle(() => ({
    opacity: fill.value,
    transform: [{ scale: reduced ? 1 : 0.6 + fill.value * 0.4 }],
  }));

  const empty = useAnimatedStyle(() => ({ opacity: 1 - fill.value }));

  return (
    <View style={{ flexGrow: 1, flexBasis: 0, minWidth: 0, alignItems: 'center', gap: 7 }}>
      <View style={{ width: 52, height: 52 }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: color.controlRing,
              alignItems: 'center',
              justifyContent: 'center',
            },
            empty,
          ]}
        >
          <Icon name="plus" size={20} color={color.inkMuted} />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 52,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: color.ink,
              alignItems: 'center',
              justifyContent: 'center',
            },
            filled,
          ]}
        >
          <Icon name="user-fill" size={26} color={color.surface} />
        </Animated.View>
      </View>

      <Txt f="semibold" size={12} c={joined ? color.ink : color.inkMuted}>
        {joined ? t('You') : t('Open')}
      </Txt>
      <Txt f="semibold" size={10} c={color.inkMuted}>
        {rangeLabel}
      </Txt>
    </View>
  );
}
