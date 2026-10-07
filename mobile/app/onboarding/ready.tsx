import React from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { color, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import { PrimaryButton, ProgressSteps, BottomBar, useTopPad } from '../../src/components/ui';
import { EnterUp } from '../../src/components/motion';
import { ActivityRow } from '../../src/components/cards';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import { useAllActivities } from '../../src/data/activities';
import { img, sportOptions, eligible } from '../../src/data/seed';

/** Source: design/src/Ready.body.html */
export default function Ready() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const sports = useStore((s) => s.sports);
  // the neighbourhood step just asked for these; echoing a hardcoded
  // "Kadıköy · 5 km" back would quietly contradict the answer
  const city = useStore((s) => s.city);
  const radiusKm = useStore((s) => s.radiusKm);
  const levels = useStore((s) => s.levels);

  const labelOf = (key: string) => t(sportOptions.find((s) => s.key === key)?.label ?? key);
  const sportsSummary = sports.map(labelOf).join(' · ') || t('None yet');

  /*
   * The count and the cards come from one filter, deliberately.
   *
   * This screen used to hand-roll its own — every sport judged against the padel
   * level — and then show `activities[0]` regardless, so a runner finished
   * onboarding looking at a padel game at 19.30. Place and the account step both
   * count with `eligible` inside the radius; a third answer to "how many games
   * are near me", two taps after the other two, is the kind of thing nobody
   * notices in review and everybody notices on a phone.
   */
  const all = useAllActivities();
  const matches = all.filter((a) => eligible(a, levels) && a.distanceKm <= radiusKm);
  const matching = matches.length;

  // Contained inside the gutter, so the illustration is never cropped.
  const artH = 214;

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingTop: top,
          paddingHorizontal: gutter,
          minHeight: top + 44,
        }}
      >
        <ProgressSteps step={3} of={3} />
      </View>

      {/*
        The art was drawn at its natural width and cropped to the screen, which cut
        the players' feet off, and it sat 22px under the progress rail with 22px of
        air beneath — too tight at both ends. It is now contained rather than
        cropped, so the whole illustration survives any screen width, with real
        clearance above and below.
      */}
      <View
        style={{ height: artH, flexShrink: 1, minHeight: 130, marginTop: 34, paddingHorizontal: gutter }}
      >
        <Image
          source={img.celebrate}
          accessibilityLabel="Four players celebrating after a game"
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>

      <View style={{ paddingTop: 32, paddingHorizontal: gutter }}>
        <Txt f="display" size={34} em={-0.04} lh={1.03}>
          {t("You're in.")}
        </Txt>
        <Txt f="medium" size={15} lh={1.45} c={color.inkMuted} style={{ marginTop: 9 }}>
          {matching === 1
            ? t('One game near you already matches what you set up.')
            : tf('{n} games near you already match what you set up.', { n: matching })}
        </Txt>
      </View>

      {/*
        Three check-marked rows used to sit here reading Sports / Level / Where —
        the same three answers the account step shows on the card immediately
        before this one. Repeating them two taps later is a receipt, not a
        payoff. One muted line does the confirming, and the room it frees goes to
        the thing the user actually came for.
      */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingTop: 12,
          paddingHorizontal: gutter,
        }}
      >
        {/* no stars on this line: one row of them after two sport names reads
            as a level for both, and they are set per sport */}
        <Txt f="semibold" size={12.5} c={color.inkMuted} numberOfLines={1} style={{ flexShrink: 1 }}>
          {`${sportsSummary} · ${city} · ${radiusKm} km`}
        </Txt>
      </View>

      {matches.length ? (
        <View style={{ paddingTop: 20, paddingHorizontal: gutter }}>
          <SectionHead>{t('START WITH ONE OF THESE')}</SectionHead>
          <View style={{ gap: 10, marginTop: 12 }}>
            {matches.slice(0, 2).map((a, i) => (
              <EnterUp key={a.id} index={i}>
                <ActivityRow activity={a} />
              </EnterUp>
            ))}
          </View>
        </View>
      ) : null}

      {/* the design pins the action bar to the bottom; extra height lands here */}
      <View style={{ flexGrow: 1, minHeight: 12 }} />

      <BottomBar>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            marginBottom: 14,
          }}
        >
          <Icon name="gear-six" size={15} color={color.inkMuted} />
          <Txt f="medium" size={13} c={color.inkMuted}>
            {t('Everything here is editable in your profile')}
          </Txt>
        </View>
        <PrimaryButton
          label={t('Find your first game')}
          height={56}
          size={16.5}
          iconSize={19}
          glow
          onPress={() => router.replace('/(tabs)')}
        />
      </BottomBar>
    </View>
  );
}
