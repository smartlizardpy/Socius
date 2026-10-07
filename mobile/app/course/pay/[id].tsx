import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { color, radius, gutter } from '../../../src/theme';
import { Icon } from '../../../src/components/Icon';
import { Txt, SectionHead } from '../../../src/components/Txt';
import {
  Card,
  CheckDot,
  Note,
  PrimaryButton,
  RoundButton,
  BottomBar,
  EmptyState,
  useTopPad,
} from '../../../src/components/ui';
import { PressScale } from '../../../src/components/motion';
import { useI18n } from '../../../src/i18n';
import { useStore } from '../../../src/store';
import { FEE_RATE, courses, feeOn, people } from '../../../src/data/seed';

/**
 * Checkout for a course.
 *
 * The activity version splits one court between players; a course is a single
 * price for a run of sessions, so the derivation that matters is the per-session
 * cost — that is the number someone actually weighs against a drop-in game.
 * The 10% is the same rule as everywhere else and is broken out, never folded in.
 */
export default function CoursePay() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<'saved' | 'new'>('saved');

  const apply = useStore((s) => s.applyToCourse);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper, paddingTop: top }}>
        <View style={{ paddingHorizontal: gutter }}>
          <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        </View>
        <EmptyState
          icon="graduation-cap"
          title={t('This course is no longer listed')}
          body={t('It may have finished, or filled up since this link was made.')}
        />
      </View>
    );
  }

  const coach = people[course.coachId];
  const fee = feeOn(course.price);
  const total = course.price + fee;
  const sessions = course.sessions;
  const perSession = Math.round(course.price / sessions);

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          minHeight: 48,
          paddingTop: top,
          paddingHorizontal: gutter,
        }}
      >
        <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        <Txt f="display" size={19} em={-0.03} style={{ flexGrow: 1 }}>
          {t('Confirm and pay')}
        </Txt>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <Card
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 18,
            marginHorizontal: gutter,
            padding: 12,
          }}
        >
          <Image
            source={course.thumb}
            style={{ width: 56, height: 56, borderRadius: radius.media }}
            resizeMode="cover"
          />
          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <Txt f="bold" size={15} em={-0.01}>
              {t(course.title)}
            </Txt>
            <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
              {`${t(course.schedule)} · ${t(course.venue)}`}
            </Txt>
          </View>
        </Card>

        {/* what the money buys, straight off the course */}
        <View style={{ paddingTop: 22, paddingHorizontal: gutter }}>
          <SectionHead>{t('WHAT IS INCLUDED')}</SectionHead>
        </View>
        <Card style={{ marginTop: 12, marginHorizontal: gutter, padding: 14 }}>
          {course.includes.map((line, i) => (
            <View
              key={line}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 9,
                marginTop: i === 0 ? 0 : 9,
              }}
            >
              <Icon name="check" size={15} color={color.blue} />
              <Txt f="medium" size={13} lh={1.35} c={color.ink} style={{ flexShrink: 1 }}>
                {t(line)}
              </Txt>
            </View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 9 }}>
            <Icon name="user" size={15} color={color.blue} />
            <Txt f="medium" size={13} lh={1.35} c={color.ink} style={{ flexShrink: 1 }}>
              {`${coach.name} · ${t(course.coachLine)}`}
            </Txt>
          </View>
        </Card>

        <View style={{ paddingTop: 22, paddingHorizontal: gutter }}>
          <SectionHead>{t('HOW YOU PAY')}</SectionHead>
        </View>

        <View style={{ gap: 9, paddingTop: 12, paddingHorizontal: gutter }}>
          {(['saved', 'new'] as const).map((k) => (
            <PressScale
              key={k}
              onPress={() => setCard(k)}
              to={0.99}
              accessibilityRole="radio"
              accessibilityState={{ selected: card === k }}
              accessibilityLabel={k === 'saved' ? t('Card ending 4242') : t('Add another card')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 13,
                paddingHorizontal: 14,
                backgroundColor: color.surface,
                borderRadius: 18,
                borderWidth: card === k ? 2 : 1,
                borderColor: card === k ? color.blue : color.lineOnSurface,
              }}
            >
              <Icon
                name={k === 'saved' ? 'credit-card' : 'plus'}
                size={19}
                color={card === k ? color.blue : color.inkMuted}
              />
              <Txt f="semibold" size={14.5} style={{ flexGrow: 1 }}>
                {k === 'saved' ? t('Card ending 4242') : t('Add another card')}
              </Txt>
              {card === k ? <CheckDot size={24} icon={15} /> : null}
            </PressScale>
          ))}
        </View>

        <Card style={{ marginTop: 22, marginHorizontal: gutter, padding: 16 }}>
          <SectionHead>{t('WHAT YOU ARE PAYING')}</SectionHead>

          <Line
            label={t('The course')}
            value={`₺${course.price.toLocaleString('tr-TR')}`}
            sub={tf('{n} sessions · ₺{each} each', {
              n: sessions,
              each: perSession.toLocaleString('tr-TR'),
            })}
            top={14}
          />
          <Line
            label={tf('Socius fee · {pct}%', { pct: Math.round(FEE_RATE * 100) })}
            value={`₺${fee.toLocaleString('tr-TR')}`}
            top={12}
            muted
          />

          <View style={{ height: 1, backgroundColor: color.lineOnSurface, marginVertical: 14 }} />

          <View
            style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}
          >
            <Txt f="bold" size={14}>
              {t('Total')}
            </Txt>
            <Txt f="display" size={24} em={-0.03}>
              {`₺${total.toLocaleString('tr-TR')}`}
            </Txt>
          </View>
        </Card>

        <View style={{ marginTop: 14, marginHorizontal: gutter }}>
          <Note align="top">
            {t(
              'Nothing is charged until the coach confirms your place. Cancel before the first session and you are refunded in full.',
            )}
          </Note>
        </View>
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label={tf('Pay ₺{n} and enrol', { n: total.toLocaleString('tr-TR') })}
          glow
          onPress={() => {
            apply(course.id);
            // back to the course, which now reads Applied
            router.back();
          }}
        />
      </BottomBar>
    </View>
  );
}

function Line({
  label,
  value,
  sub,
  top,
  muted = false,
}: {
  label: string;
  value: string;
  sub?: string;
  top: number;
  muted?: boolean;
}) {
  return (
    <View style={{ marginTop: top }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}
      >
        <Txt f="medium" size={14} c={muted ? color.inkMuted : color.ink} style={{ flexShrink: 1 }}>
          {label}
        </Txt>
        <Txt f="semibold" size={14} c={muted ? color.inkMuted : color.ink}>
          {value}
        </Txt>
      </View>
      {sub ? (
        <Txt f="medium" size={11.5} c={color.inkMuted} style={{ marginTop: 3 }}>
          {sub}
        </Txt>
      ) : null}
    </View>
  );
}
