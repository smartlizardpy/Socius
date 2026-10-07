import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  PrimaryButton,
  BottomBar,
  Card,
  CheckDot,
  Note,
  useTopPad,
} from '../../src/components/ui';
import { PressScale } from '../../src/components/motion';
import { useI18n, formatTime } from '../../src/i18n';
import { useStore } from '../../src/store';
import { FEE_RATE, feeOn } from '../../src/data/seed';
import { useActivity } from '../../src/data/activities';

/**
 * Source: design/src/Pay.body.html
 *
 * The breakdown shows the court's whole cost as well as your share — the note on
 * the deck asked for the total, and a split you cannot check against a total is
 * just a number you are being told to trust.
 */
export default function Pay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const join = useStore((s) => s.join);
  const [card, setCard] = useState<'saved' | 'new'>('saved');

  const activity = useActivity(String(id));

  if (!activity || activity.price == null) {
    return <View style={{ flex: 1, backgroundColor: color.paper }} />;
  }

  const share = activity.price;
  const courtTotal = share * activity.capacity;
  const fee = feeOn(share);
  const total = share + fee;

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
        {/* what you are joining */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, marginHorizontal: gutter, padding: 12 }}>
          <Image
            source={activity.thumb}
            style={{ width: 56, height: 56, borderRadius: radius.media }}
            resizeMode="cover"
          />
          <View style={{ flexGrow: 1, flexShrink: 1 }}>
            <Txt f="bold" size={15} em={-0.01}>
              {t(activity.title)}
            </Txt>
            <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 4 }}>
              {`${t(activity.dateLine)} · ${formatTime(activity.time, lang)} · ${activity.venue}`}
            </Txt>
          </View>
        </Card>

        <View style={{ paddingTop: 22, paddingHorizontal: gutter }}>
          <SectionHead>{t('HOW YOU PAY')}</SectionHead>
        </View>

        <View style={{ gap: 9, paddingTop: 12, paddingHorizontal: gutter }}>
          <PressScale
            onPress={() => setCard('saved')}
            to={0.99}
            accessibilityRole="radio"
            accessibilityState={{ selected: card === 'saved' }}
            accessibilityLabel={t('Card ending 4242')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 13,
              paddingHorizontal: 14,
              backgroundColor: color.surface,
              borderRadius: 18,
              borderWidth: card === 'saved' ? 2 : 1,
              borderColor: card === 'saved' ? color.blue : color.lineOnSurface,
              ...(card === 'saved'
                ? {
                    shadowColor: color.blue,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.16,
                    shadowRadius: 12,
                    elevation: 3,
                  }
                : null),
            }}
          >
            <CardMark />
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
              <Txt f="bold" size={14.5} em={-0.01}>
                {t('Card ending 4242')}
              </Txt>
              <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 2 }}>
                {t('Saved on your account')}
              </Txt>
            </View>
            {card === 'saved' ? (
              <CheckDot size={24} icon={15} />
            ) : (
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: radius.pill,
                  borderWidth: 2,
                  borderColor: color.controlRing,
                }}
              />
            )}
          </PressScale>

          <PressScale
            onPress={() => setCard('new')}
            to={0.99}
            accessibilityRole="radio"
            accessibilityState={{ selected: card === 'new' }}
            accessibilityLabel={t('Add another card')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingVertical: 13,
              paddingHorizontal: 14,
              backgroundColor: color.surface,
              borderRadius: 18,
              borderWidth: card === 'new' ? 2 : 1,
              borderColor: card === 'new' ? color.blue : color.lineOnSurface,
            }}
          >
            <View
              style={{
                width: 34,
                height: 24,
                borderRadius: 5,
                backgroundColor: color.paper,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="plus" size={15} color={color.inkMuted} />
            </View>
            <Txt f="semibold" size={14.5} c={color.inkMuted} style={{ flexGrow: 1 }}>
              {t('Add another card')}
            </Txt>
            {card === 'new' ? <CheckDot size={24} icon={15} /> : null}
          </PressScale>
        </View>

        {/* the breakdown, total first so the split is checkable */}
        <Card style={{ marginTop: 22, marginHorizontal: gutter, padding: 16 }}>
          <SectionHead>{t('WHAT YOU ARE PAYING')}</SectionHead>

          <Line
            label={t('Your share of the court')}
            value={`₺${share}`}
            sub={tf('₺{total} ÷ {n} players', {
              total: courtTotal.toLocaleString('tr-TR'),
              n: activity.capacity,
            })}
            top={14}
          />
          <Line
            label={tf('Avenza fee · {pct}%', { pct: Math.round(FEE_RATE * 100) })}
            value={`₺${fee}`}
            top={12}
            muted
          />

          <View style={{ height: 1, backgroundColor: color.lineOnSurface, marginVertical: 14 }} />

          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Txt f="bold" size={14}>
              {t('Total')}
            </Txt>
            <Txt f="display" size={24} em={-0.03}>
              {`₺${total}`}
            </Txt>
          </View>
        </Card>

        <View style={{ marginTop: 14, marginHorizontal: gutter }}>
          <Note align="top">
            {t(
              'Nothing leaves your account until the game has enough players. Cancel more than 6 hours before and you are refunded in full.',
            )}
          </Note>
        </View>
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label={tf('Pay ₺{n} and join', { n: total })}
          glow
          onPress={() => {
            join(activity.id);
            // straight back to the activity, which now reads YOU'RE IN
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
  accent = false,
}: {
  label: string;
  value: string;
  /** where the figure comes from — subordinate, never a line item of its own */
  sub?: string;
  top: number;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={{ marginTop: top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <Txt f="medium" size={14} c={muted ? color.inkMuted : color.ink} style={{ flexShrink: 1 }}>
          {label}
        </Txt>
        <Txt f="bold" size={14} c={accent ? color.orangeDeep : color.ink}>
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

/** The card mark drawn inline in Pay.body.html, ported shape for shape. */
function CardMark() {
  return (
    <Svg width={34} height={24} viewBox="0 0 34 24">
      <Rect width={34} height={24} rx={5} fill={color.ink} />
      <Rect y={7} width={34} height={4} fill={color.surface} opacity={0.85} />
      <Rect x={4} y={16} width={9} height={3} rx={1.5} fill={color.surface} opacity={0.7} />
    </Svg>
  );
}
