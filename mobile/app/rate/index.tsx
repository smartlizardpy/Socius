import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { withSequence } from 'react-native-reanimated';

import { color, radius, gutter, motion } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  PrimaryButton,
  GhostButton,
  RoundButton,
  ProgressSteps,
  BottomBar,
  Card,
  Avatar,
  AvatarStack,
  LevelStars,
  StatePill,
  useTopPad,
} from '../../src/components/ui';
import {
  Animated,
  PressScale,
  ease,
  pressSpring,
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withSpring,
  withTiming,
} from '../../src/components/motion';
import { useI18n, rateHeadline, stepLabel } from '../../src/i18n';
import { useStore } from '../../src/store';
import { img, people, ratingTags, rateQueue, activities, pastGames, starsOf } from '../../src/data/seed';

type Verdict = 'below' | 'spot-on' | 'above';

/** Source: design/src/Rate.body.html */
export default function Rate() {
  const router = useRouter();
  const top = useTopPad();
  const { t, lang } = useI18n();
  const setRating = useStore((s) => s.setRating);
  const markGameRated = useStore((s) => s.markGameRated);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(5);
  // the mockup opens with the first two tags chosen
  const [tags, setTags] = useState<string[]>(ratingTags.slice(0, 2));
  const [verdict, setVerdict] = useState<Verdict>('spot-on');

  const person = people[rateQueue[index]];
  const game = pastGames[0];
  const last = index === rateQueue.length - 1;

  const advance = () => {
    setRating(person.id, { stars, tags, levelVerdict: verdict });
    if (last) {
      // the mockup ended on the last card with nowhere to go; a rating queue
      // that just closes leaves you wondering whether it saved
      markGameRated(game.id);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setStars(5);
    setTags(ratingTags.slice(0, 2));
    setVerdict('spot-on');
  };

  if (done) return <Done onClose={() => router.back()} />;

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingTop: top,
          paddingHorizontal: gutter,
        }}
      >
        <RoundButton icon="x" size={19} onPress={() => router.back()} label="Close" />
        <ProgressSteps step={index + 1} of={rateQueue.length} />
        <Txt f="semibold" size={13} c={color.inkMuted}>
          {stepLabel(index + 1, rateQueue.length, lang, t)}
        </Txt>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        {/* which game */}
        <Card
          r={radius.mediaLarge}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 18,
            marginHorizontal: gutter,
            paddingVertical: 11,
            paddingHorizontal: 14,
          }}
        >
          <Image source={img.cardPadel} style={{ width: 40, height: 40, borderRadius: 11 }} />
          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <Txt f="bold" size={13.5} em={-0.01}>
              {t(game.title)}
            </Txt>
            <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 2 }}>
              {`${game.venue} · ${t(game.dateLine)}`}
            </Txt>
          </View>
          <View
            style={{
              height: 24,
              paddingHorizontal: 9,
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Txt f="bold" size={10.5} em={0.05} c={color.blueDeep}>
              {t('PLAYED')}
            </Txt>
          </View>
        </Card>

        {/* the player */}
        <View style={{ alignItems: 'center', paddingTop: 22, paddingHorizontal: gutter }}>
          <Avatar source={person.face} size={88} />
          <Txt f="display" size={27} em={-0.035} lh={1.08} align="center" style={{ marginTop: 16 }}>
            {rateHeadline(person.first, lang, t)}
          </Txt>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                n={n}
                filled={n <= stars}
                onPress={() => {
                  const added = n - stars;
                  setStars(n);
                  // one light tap per star as it fills, like a ratchet
                  const count = added > 0 ? added : 1;
                  for (let i = 0; i < count; i++) {
                    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), i * 45);
                  }
                }}
              />
            ))}
          </View>
        </View>

        {/* tags */}
        <View style={{ paddingTop: 22, paddingHorizontal: gutter }}>
          <SectionHead>{t('WHAT STOOD OUT')}</SectionHead>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
            {ratingTags.map((tag) => {
              const on = tags.includes(tag);
              return (
                <PressScale
                  key={tag}
                  to={0.96}
                  onPress={() =>
                    setTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]))
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: on ? 7 : 0,
                    height: 40,
                    paddingLeft: on ? 12 : 14,
                    paddingRight: 14,
                    borderRadius: radius.pill,
                    backgroundColor: on ? color.ink : color.surface,
                    ...(on ? null : { borderWidth: 1, borderColor: color.lineOnPaper }),
                  }}
                >
                  {on ? <Icon name="check" size={15} color={color.surface} /> : null}
                  <Txt f="semibold" size={13.5} c={on ? color.surface : color.inkMuted}>
                    {t(tag)}
                  </Txt>
                </PressScale>
              );
            })}
          </View>
        </View>

        {/* was the level right */}
        <Card style={{ marginTop: 20, marginHorizontal: gutter, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <SectionHead>{t('WAS THIS THE RIGHT LEVEL?')}</SectionHead>
            <LevelStars n={starsOf(person.level)} size={12} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {(
              [
                ['below', 'Below'],
                ['spot-on', 'Spot on'],
                ['above', 'Above'],
              ] as const
            ).map(([key, label]) => {
              const on = verdict === key;
              return (
                <PressScale
                  key={key}
                  to={0.97}
                  onPress={() => setVerdict(key)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  style={{
                    flexGrow: 1,
                    flexBasis: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: on ? 6 : 0,
                    height: 44,
                    borderRadius: radius.tile,
                    backgroundColor: on ? color.blue : color.paper,
                    ...(on ? null : { borderWidth: 1, borderColor: color.lineOnSurface }),
                  }}
                >
                  {on ? <Icon name="check" size={15} color={color.onBlue} /> : null}
                  <Txt f={on ? 'bold' : 'semibold'} size={13.5} c={on ? color.onBlue : color.inkMuted}>
                    {t(label)}
                  </Txt>
                </PressScale>
              );
            })}
          </View>
          <Txt f="medium" size={12} lh={1.4} c={color.inkMuted} style={{ marginTop: 11 }}>
            {t("Only the average moves a player's level. Nobody sees your single answer.")}
          </Txt>
        </Card>
      </ScrollView>

      <BottomBar top={14}>
        {/* the design draws one CTA; the last card saves rather than advancing */}
        <PrimaryButton label={last ? t('Save') : t('Next player')} onPress={advance} />
      </BottomBar>
    </View>
  );
}

function Star({ n, filled, onPress }: { n: number; filled: boolean; onPress: () => void }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const was = useRef(filled);

  useEffect(() => {
    if (filled && !was.current && !reduced) {
      scale.value = withSequence(
        withTiming(1.25, { duration: 90, easing: ease }),
        withSpring(1, pressSpring),
      );
    }
    was.current = filled;
  }, [filled, reduced]);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: filled }}
      accessibilityLabel={`${n}`}
      style={{ padding: 3, margin: -3 }}
    >
      <Animated.View style={animated}>
        <Icon
          name={filled ? 'star-fill' : 'star'}
          size={38}
          color={filled ? color.orange : color.controlRing}
        />
      </Animated.View>
    </Pressable>
  );
}

/**
 * What the mockup stopped short of. Three ratings sent is the moment the whole
 * reputation loop closes, so it gets a screen rather than a dismissed sheet.
 */
function Done({ onClose }: { onClose: () => void }) {
  const { t, tf } = useI18n();
  const faces = rateQueue.map((id) => people[id].face);

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
        <Image
          source={img.celebrate}
          accessibilityLabel="Four players celebrating after a game"
          style={{ width: 226, height: 172 }}
          resizeMode="contain"
        />

        <Txt f="display" size={30} em={-0.04} lh={1.05} align="center" style={{ marginTop: 18 }}>
          {t('Thanks — that is the loop closed.')}
        </Txt>
        <Txt
          f="medium"
          size={14.5}
          lh={1.45}
          c={color.inkMuted}
          align="center"
          style={{ marginTop: 10 }}
        >
          {t('Your answers only move a level once enough people agree, and nobody sees who said what.')}
        </Txt>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 }}>
          <AvatarStack faces={faces} size={32} ring={color.paper} overlap={10} />
          <StatePill label={tf('{n} RATED', { n: rateQueue.length })} height={26} />
        </View>
      </View>

      <BottomBar>
        <PrimaryButton label={t('Done')} icon={null} onPress={onClose} glow />
      </BottomBar>
    </View>
  );
}
