import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import { PrimaryButton, RoundButton, ProgressSteps, BottomBar, useTopPad } from '../../src/components/ui';
import { PressScale } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import { sportOptions, type SportOption } from '../../src/data/seed';

/** Source: design/src/Sports.body.html */
export default function Sports() {
  const router = useRouter();
  const top = useTopPad();
  const { t, lang } = useI18n();
  const sports = useStore((s) => s.sports);
  const toggleSport = useStore((s) => s.toggleSport);

  const n = sports.length;
  // The mockup only supplies the n = 2 wording; the count itself stays literal in
  // both languages, so the sentence is reused and only the number varies.
  const continueLabel =
    lang === 'tr'
      ? `${n} sporla devam et`
      : n === 1
        ? 'Continue with 1 sport'
        : `Continue with ${n} sports`;

  const rows: SportOption[][] = [];
  for (let i = 0; i < sportOptions.length; i += 2) rows.push(sportOptions.slice(i, i + 2));

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
        <RoundButton icon="caret-left" onPress={() => router.back()} label="Back" />
        <ProgressSteps step={1} of={3} />
        <PressScale
          onPress={() => router.push('/onboarding/place')}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View style={{ paddingTop: 26, paddingHorizontal: gutter }}>
          <SectionHead>{t('STEP 1 OF 3')}</SectionHead>
          <Txt f="display" size={31} em={-0.035} lh={1.06} style={{ marginTop: 8 }}>
            {t('Which sports do you play?')}
          </Txt>
          <Txt f="medium" size={14} lh={1.45} c={color.inkMuted} style={{ marginTop: 10 }}>
            {t('Pick as many as you like — you can add more once you are in.')}
          </Txt>
        </View>

        <View style={{ paddingTop: 8, paddingHorizontal: gutter }}>
          {rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              {row.map((s) => (
                <SportTile
                  key={s.key}
                  option={s}
                  selected={sports.includes(s.key)}
                  onPress={() => toggleSport(s.key)}
                  label={t(s.label)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomBar top={14}>
        <PrimaryButton
          label={continueLabel}
          disabled={n === 0}
          // Only the padel level step was designed. If padel is not among the
          // picks there is no drawn step to show, so onboarding finishes here.
          onPress={() =>
            router.push(sports.includes('padel') ? '/onboarding/level' : '/onboarding/place')
          }
        />
      </BottomBar>
    </View>
  );
}

function SportTile({
  option,
  selected,
  onPress,
  label,
}: {
  option: SportOption;
  selected: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.98}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={{
        flex: 1,
        height: 100,
        justifyContent: 'center',
        gap: 9,
        paddingHorizontal: 14,
        backgroundColor: color.surface,
        borderRadius: radius.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? color.blue : color.lineOnSurface,
      }}
    >
      {selected ? (
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 22,
            height: 22,
            borderRadius: radius.pill,
            backgroundColor: color.blue,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="check" size={14} color={color.onBlue} />
        </View>
      ) : null}
      <Icon name={option.icon} size={26} color={selected ? color.blue : color.inkMuted} />
      <Txt f="bold" size={15} em={-0.01}>
        {label}
      </Txt>
    </PressScale>
  );
}
