import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  PrimaryButton,
  RoundButton,
  ProgressSteps,
  BottomBar,
  Card,
  Chip,
  Sheet,
  SheetOption,
  LevelStars,
  StarPicker,
  useTopPad,
} from '../../src/components/ui';
import { PressScale, EnterUp, Swap } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  levelScales,
  matchBand,
  playersInBand,
  sportLabel,
  sportIcon,
  sportsNeedingLevel,
  starsOf,
  type LevelScale,
  type LevelTier,
} from '../../src/data/seed';

/**
 * Source: design/src/Level.body.html — extended.
 *
 * The mockup drew one padel step and a chip promising "Tennis next" that led
 * nowhere. This walks every picked sport that has a scale, one at a time, and the
 * chips are the control that does the walking.
 *
 * The ladder replaces the four free-standing rows the mockup drew. A level is a
 * position on a scale, so it is drawn as one: a rail running down the card with
 * your marker on it, in the same orange the level rail uses on the activity card.
 * Reading the same mark in both places is what teaches the mechanic.
 */
export default function Level() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();
  const sports = useStore((s) => s.sports);
  const levels = useStore((s) => s.levels);
  const setLevel = useStore((s) => s.setLevel);

  const queue = useMemo(() => sportsNeedingLevel(sports), [sports]);
  const [step, setStep] = useState(0);
  const [helper, setHelper] = useState(false);

  // Reaching this screen with nothing to ask should not strand the user: the
  // Sports step routes past it, but a reload can land here directly.
  if (queue.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper }}>
        <BottomBar top={top + 40}>
          <Txt f="display" size={26} em={-0.035} lh={1.1}>
            {t('Nothing to set here.')}
          </Txt>
          <Txt f="medium" size={14} lh={1.45} c={color.inkMuted} style={{ marginTop: 10 }}>
            {t('None of the sports you picked are matched by level.')}
          </Txt>
          <PrimaryButton
            label={t('Carry on')}
            onPress={() => router.replace('/onboarding/place')}
            style={{ marginTop: 22 }}
          />
        </BottomBar>
      </View>
    );
  }

  const index = Math.min(step, queue.length - 1);
  const sport = queue[index];
  const scale = levelScales[sport] as LevelScale;
  const label = t(sportLabel(sport));
  const last = index === queue.length - 1;

  const chosenValue = levels[sport] ?? scale.tiers[Math.floor(scale.tiers.length / 2)].value;
  const chosen = scale.tiers.find((x) => x.value === chosenValue) ?? scale.tiers[0];
  const band = matchBand(scale, chosen);

  const goBack = () => {
    if (index > 0) setStep(index - 1);
    else router.back();
  };

  const goNext = () => {
    // make the implicit default explicit before moving on
    setLevel(sport, chosen.value);
    if (last) router.push('/onboarding/place');
    else setStep(index + 1);
  };

  const nextLabel = last
    ? queue.length === 1
      ? tf('Set my {sport} level', { sport: label.toLowerCase() })
      : t('Set my levels')
    : tf('Next: {sport}', { sport: t(sportLabel(queue[index + 1])) });

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingTop: top,
          paddingHorizontal: gutter,
          minHeight: top + 48,
        }}
      >
        <RoundButton icon="caret-left" onPress={goBack} label="Back" />
        <ProgressSteps step={2} of={3} />
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <View style={{ paddingTop: 18, paddingHorizontal: gutter }}>
          <SectionHead>{t('STEP 2 OF 3')}</SectionHead>
          <Txt f="display" size={30} em={-0.035} lh={1.06} style={{ marginTop: 8 }}>
            {t(scale.question)}
          </Txt>
          <Txt f="medium" size={14} lh={1.45} c={color.inkMuted} style={{ marginTop: 10 }}>
            {t(
              'This decides who you get matched with. Ratings from the people you play with keep it honest.',
            )}
          </Txt>
        </View>

        {/* the sport walk — one chip per sport that needs a level */}
        {queue.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 16, paddingHorizontal: gutter }}
          >
            {queue.map((key, i) => (
              <SportStep
                key={key}
                label={t(sportLabel(key))}
                icon={sportIcon(key)}
                state={i === index ? 'now' : i < index ? 'done' : 'todo'}
                position={i + 1}
                onPress={() => setStep(i)}
              />
            ))}
          </ScrollView>
        ) : null}

        {/* set it with the stars; the words follow */}
        <EnterUp index={0}>
          <Card
            r={radius.cardLarge}
            style={{
              alignItems: 'center',
              marginTop: 20,
              marginHorizontal: gutter,
              paddingVertical: 30,
              paddingHorizontal: 20,
            }}
          >
            <SectionHead>{t(scale.head)}</SectionHead>

            <View style={{ marginTop: 18 }}>
              <StarPicker
                value={starsOf(chosen.rail)}
                size={38}
                label={t(scale.head)}
                onChange={(n) => {
                  const tier = scale.tiers[Math.min(scale.tiers.length - 1, Math.max(0, n - 1))];
                  if (tier) setLevel(sport, tier.value);
                }}
              />
            </View>

            {/* the description is the whole point of the control — it is what
                turns "four stars" into something you can actually agree with */}
            <Swap value={chosen.value}>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Txt f="display" size={24} em={-0.03} lh={1.1} align="center">
                  {t(chosen.label)}
                </Txt>
                <Txt
                  f="medium"
                  size={14}
                  lh={1.45}
                  c={color.inkMuted}
                  align="center"
                  style={{ marginTop: 8, maxWidth: 270 }}
                >
                  {t(chosen.blurb)}
                </Txt>
                {scale.kind === 'pace' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                      height: 32,
                      marginTop: 14,
                      paddingHorizontal: 13,
                      borderRadius: radius.pill,
                      backgroundColor: color.blueTint,
                    }}
                  >
                    <Icon name="timer" size={15} color={color.blueDeep} />
                    <Txt f="bold" size={13} c={color.blueDeep}>
                      {sport === 'running' ? `${chosen.value} / km` : chosen.value}
                    </Txt>
                  </View>
                ) : null}
              </View>
            </Swap>
          </Card>
        </EnterUp>

        {/* what the choice actually buys you, updated live */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 14,
            paddingHorizontal: gutter,
          }}
        >
          <Icon name="lightning" size={15} color={color.orangeDeep} />
          <Txt f="semibold" size={12.5} lh={1.35} c={color.orangeDeep} style={{ flexShrink: 1 }}>
            {tf('{n} players near you · {note}', {
              n: playersInBand(chosen),
              note:
                scale.kind === 'rating'
                  ? t(scale.matchNote)
                  : tf(scale.matchNote, { lo: band.lo, hi: band.hi }),
            })}
          </Txt>
        </View>
      </ScrollView>

      <BottomBar top={14}>
        <PrimaryButton label={nextLabel} onPress={goNext} />
        <PressScale
          onPress={() => setHelper(true)}
          to={0.97}
          accessibilityRole="button"
          accessibilityLabel={t('Not sure? Answer 4 quick questions')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            height: 44,
            marginTop: 6,
          }}
        >
          <Icon name="question" size={16} color={color.blue} />
          <Txt f="semibold" size={13.5} c={color.blue}>
            {t('Not sure? Answer 4 quick questions')}
          </Txt>
        </PressScale>
      </BottomBar>

      <LevelHelper
        open={helper}
        onClose={() => setHelper(false)}
        scale={scale}
        sportName={label}
        onResult={(tier) => {
          setLevel(sport, tier.value);
          setHelper(false);
        }}
      />
    </View>
  );
}

/* --------------------------------------------------------------- the walk -- */

function SportStep({
  label,
  icon,
  state,
  position,
  onPress,
}: {
  label: string;
  icon: ReturnType<typeof sportIcon>;
  state: 'done' | 'now' | 'todo';
  position: number;
  onPress: () => void;
}) {
  if (state === 'now') {
    return (
      <PressScale
        onPress={onPress}
        to={0.97}
        accessibilityRole="tab"
        accessibilityState={{ selected: true }}
        accessibilityLabel={label}
        drawnHeight={36}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          height: 36,
          paddingLeft: 11,
          paddingRight: 14,
          borderRadius: radius.pill,
          backgroundColor: color.ink,
        }}
      >
        <View style={{ width: 7, height: 7, borderRadius: radius.pill, backgroundColor: color.orange }} />
        <Txt f="bold" size={13} c={color.surface}>
          {label}
        </Txt>
      </PressScale>
    );
  }

  if (state === 'done') {
    return (
      <Chip label={label} icon="check" active tone="blue" onPress={onPress} height={36} />
    );
  }

  return (
    <PressScale
      onPress={onPress}
      to={0.97}
      accessibilityRole="tab"
      accessibilityState={{ selected: false }}
      accessibilityLabel={label}
      drawnHeight={36}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        height: 36,
        paddingLeft: 9,
        paddingRight: 14,
        borderRadius: radius.pill,
        backgroundColor: color.surface,
        borderWidth: 1,
        borderColor: color.lineOnPaper,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: radius.pill,
          backgroundColor: color.paper,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Txt f="bold" size={10.5} c={color.inkMuted}>
          {String(position)}
        </Txt>
      </View>
      <Txt f="semibold" size={13} c={color.inkMuted}>
        {label}
      </Txt>
    </PressScale>
  );
}

/* -------------------------------------------------------------- the quiz -- */

/**
 * The mockup put "Not sure? Answer 4 quick questions" under the button and stopped
 * there. Four yes/no answers land you on a tier: each yes moves you up the ladder,
 * so the result is always one of the tiers already on screen.
 *
 * The questions come off the scale, not from here — one shared racket set was
 * asked of every sport, so picking football got you "can you keep a rally going
 * for ten shots?" and "do you serve where you mean to?".
 */
function LevelHelper({
  open,
  onClose,
  scale,
  sportName,
  onResult,
}: {
  open: boolean;
  onClose: () => void;
  scale: LevelScale;
  sportName: string;
  onResult: (tier: LevelTier) => void;
}) {
  const { t, tf } = useI18n();
  const questions = scale.quiz;
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null, null]);

  // reopening starts a clean run, and so does walking on to the next sport —
  // four answers about padel must not survive into the football questions
  React.useEffect(() => {
    if (open) setAnswers([null, null, null, null]);
  }, [open, scale]);

  const answered = answers.filter((a) => a !== null).length;
  const yeses = answers.filter((a) => a === true).length;
  const suggestion = scale.tiers[Math.min(scale.tiers.length - 1, yeses)];

  return (
    <Sheet open={open} onClose={onClose} title={tf('{sport} — quick check', { sport: sportName })}>
      {questions.map((q, i) => (
        <View key={q} style={{ marginBottom: 12 }}>
          <Txt f="semibold" size={14} lh={1.35}>
            {t(q)}
          </Txt>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
            {([
              [true, 'Yes'],
              [false, 'Not yet'],
            ] as const).map(([v, l]) => (
              <Chip
                key={l}
                label={t(l)}
                active={answers[i] === v}
                onPress={() =>
                  setAnswers((cur) => cur.map((a, j) => (j === i ? (a === v ? null : v) : a)))
                }
                height={40}
                size={13.5}
                style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center' }}
              />
            ))}
          </View>
        </View>
      ))}

      {answered === questions.length ? (
        <View style={{ marginTop: 4 }}>
          <SheetOption
            label={
              scale.kind === 'rating'
                ? `${'\u2605'.repeat(starsOf(suggestion.rail))} ${t(suggestion.label)}`
                : `${t(suggestion.label)} · ${suggestion.value}`
            }
            sub={t(suggestion.blurb)}
            selected
            onPress={() => onResult(suggestion)}
          />
          <PrimaryButton
            label={t('Use this level')}
            onPress={() => onResult(suggestion)}
            style={{ marginTop: 4 }}
          />
        </View>
      ) : (
        <Txt f="medium" size={12.5} c={color.inkMuted} align="center" style={{ paddingVertical: 12 }}>
          {tf('{a}/{b} answered', { a: answered, b: questions.length })}
        </Txt>
      )}
    </Sheet>
  );
}
