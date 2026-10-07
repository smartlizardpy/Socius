import React, { useRef, useState } from 'react';
import { View, Image, ScrollView, useWindowDimensions, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Txt } from '../../src/components/Txt';
import { PrimaryButton, RoundButton, BottomBar, useTopPad } from '../../src/components/ui';
import { PressScale } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { img } from '../../src/data/seed';

/**
 * What the funnel was missing.
 *
 * Four panels, not three: the last one is the close. The three before it make
 * the case and the fourth asks, so the provider screen after it is left doing
 * one job — which of the two buttons — instead of pitching and taking the
 * answer on the same screen.
 *
 * Onboarding opened on "Which sports do you play?" — a form field asked of
 * someone who had been told one headline and shown one picture. Every screen
 * after it collected something; none of them explained what the collecting was
 * for. This is the explanation, and it runs before the first question.
 *
 * Three panels, because the product is three moves and not one: games are near
 * you, the people in them are at your level, and the rating afterwards is what
 * makes the next one happen. That is the loop the whole app is built on
 * (Discover → Join → Play → Rate), told in the order a stranger meets it.
 *
 * Skippable from the header, because a returning user has already read it.
 */
const PANELS = [
  {
    art: img.howFind,
    alt: 'Three players walking towards each other from a few streets away',
    head: 'Someone nearby wants to play',
    body: 'Socius shows you the games happening a few streets away — tonight, this week, at the times you are actually free.',
  },
  {
    art: img.howMatch,
    alt: 'Two players bumping fists across the net',
    head: 'Matched by level, not by luck',
    body: 'Everyone you see plays within one star of you. Nobody gets crushed, and nobody has to carry the team.',
  },
  {
    art: img.howPlay,
    alt: 'Three players walking off the court together, arms over shoulders',
    head: 'You leave with friends',
    body: 'Rate each other after the game. That is what turns a one-off match into the one you play every week.',
  },
  {
    // the close. Three panels make the case; this one asks.
    art: img.howJoin,
    alt: 'Three players waving you over, one holding out a spare racket',
    head: 'Let’s get you started',
    body: 'About a minute to set up — your sports, your level, where you play. The games that fit are already there.',
  },
] as const;

/** all three are cut to 3:2 by scripts/gen-onboarding-art.py, so the art box is
 *  the same height on every panel and the headline under it never moves */
const ART_AR = 1.5;

export default function How() {
  const router = useRouter();
  const top = useTopPad();
  const { t } = useI18n();
  const { width } = useWindowDimensions();

  const rail = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const last = page === PANELS.length - 1;
  const start = () => router.push('/onboarding/account');

  const go = (i: number) => {
    setPage(i);
    rail.current?.scrollTo({ x: i * width, animated: true });
  };

  // the dots follow a swipe as well as the button; rounding on the half keeps
  // them from flickering between two pages mid-gesture
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== page && i >= 0 && i < PANELS.length) setPage(i);
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
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
        <RoundButton
          icon="caret-left"
          onPress={() => (page === 0 ? router.back() : go(page - 1))}
          label={t('Back')}
        />
        <PressScale
          onPress={start}
          to={0.96}
          accessibilityRole="button"
          accessibilityLabel={t('Skip')}
          style={{
            paddingVertical: 13,
            marginVertical: -13,
            paddingHorizontal: 12,
            marginHorizontal: -12,
            minWidth: 44,
            alignItems: 'flex-end',
          }}
        >
          <Txt f="semibold" size={14} c={color.inkMuted}>
            {t('Skip')}
          </Txt>
        </PressScale>
      </View>

      <ScrollView
        ref={rail}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flexGrow: 1, flexShrink: 1 }}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'stretch' }}
      >
        {PANELS.map((p) => (
          // the group is centred in whatever height is left rather than pinned
          // to the top: on a tall phone that keeps the art and the words
          // together instead of opening a canyon between them
          <View key={p.head} style={{ width, flexGrow: 1, justifyContent: 'center' }}>
            {/* full-bleed, because the illustration carries its own paper
                margin and the gutter would only shrink it twice */}
            <View style={{ height: width / ART_AR, flexShrink: 1, minHeight: 140 }}>
              <Image
                source={p.art}
                accessible
                accessibilityLabel={t(p.head)}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            {/* A fixed floor, because the three headlines wrap to different
                depths — two lines, two lines, one — and without it the art
                jumps up and down as you swipe. 158 is the tallest the block
                measures in either language; if new copy overruns it the art
                shifts, which is worth re-checking when the copy changes. */}
            <View style={{ minHeight: 158, paddingTop: 18, paddingHorizontal: gutter }}>
              <Txt f="display" size={30} em={-0.035} lh={1.06}>
                {t(p.head)}
              </Txt>
              <Txt f="medium" size={15} lh={1.45} c={color.inkMuted} style={{ marginTop: 10 }}>
                {t(p.body)}
              </Txt>
            </View>
          </View>
        ))}
      </ScrollView>

      <BottomBar top={16}>
        {/* a plain indicator, not a control: the swipe and the button are the
            two ways forward, and a 7px dot cannot carry a 44px hit box without
            spacing the row out to nothing */}
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 16 }}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: PANELS.length, now: page + 1 }}
        >
          {PANELS.map((p, i) => (
            <View
              key={p.head}
              style={{
                width: i === page ? 22 : 7,
                height: 7,
                borderRadius: radius.pill,
                backgroundColor: i === page ? color.ink : color.railTrack,
              }}
            />
          ))}
        </View>

        <PrimaryButton
          label={last ? t('Create my account') : t('Continue')}
          height={56}
          size={16.5}
          iconSize={19}
          glow={last}
          onPress={() => (last ? start() : go(page + 1))}
        />
      </BottomBar>
    </View>
  );
}
