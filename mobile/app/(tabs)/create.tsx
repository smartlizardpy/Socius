import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  PrimaryButton,
  Card,
  RowGroup,
  ListRow,
  Chip,
  Toggle,
  Stepper,
  AmountRow,
  AmountSheet,
  RangeRail,
  Sheet,
  SheetOption,
  Note,
  Toast,
  useToast,
  LevelStars,
  YouAvatar,
  useTopPad,
  useBottomPad,
} from '../../src/components/ui';
import { PressScale } from '../../src/components/motion';
import { useI18n, formatTime } from '../../src/i18n';
import { useStore } from '../../src/store';
import {
  FEE_RATE,
  createWhenOptions,
  createVenueOptions,
  createFormatOptions,
  formatCapacity,
  sportIcon,
  sportLabel,
  starsOf,
  you,
  personReliability,} from '../../src/data/seed';

const SPORTS = ['padel', 'football', 'tennis', 'running'];

/** Source: design/src/Create.body.html */
export default function Create() {
  const router = useRouter();
  const top = useTopPad();
  const bottomPad = useBottomPad();
  const { t, tf, lang } = useI18n();
  const publish = useStore((s) => s.publish);
  const city = useStore((s) => s.city);
  const region = useStore((s) => s.region);
  const [toast, showToast] = useToast();

  const [sport, setSport] = useState('padel');
  const [when, setWhen] = useState(createWhenOptions[0]);
  const [venue, setVenue] = useState(createVenueOptions[0]);
  const [format, setFormat] = useState(createFormatOptions.padel[0]);
  const [capacity, setCapacity] = useState(4);
  const [levelMin, setLevelMin] = useState(4);
  const [levelMax, setLevelMax] = useState(6);
  const [split, setSplit] = useState(true);
  // off by default: a range anyone can walk through is not a range
  const [openToAll, setOpenToAll] = useState(false);
  const [courtCost, setCourtCost] = useState(720);
  const [sheet, setSheet] = useState<null | 'when' | 'where' | 'format'>(null);
  const [costSheet, setCostSheet] = useState(false);

  const formats = createFormatOptions[sport] ?? createFormatOptions.padel;
  // running is not matched by level, so the range control has nothing to say
  const rated = sport !== 'running';
  const perPerson = split ? Math.round(courtCost / capacity) : null;

  const pickSport = (key: string) => {
    setSport(key);
    const next = (createFormatOptions[key] ?? createFormatOptions.padel)[0];
    setFormat(next);
    setCapacity(formatCapacity[next] ?? 4);
  };

  const pickFormat = (f: string) => {
    setFormat(f);
    setCapacity(formatCapacity[f] ?? capacity);
    setSheet(null);
  };

  const onPublish = () => {
    const id = `mine-${Date.now()}`;
    publish({
      id,
      sport,
      format,
      dateLine: when.dateLine,
      time: when.time,
      venue,
      capacity,
      price: perPerson,
      levelMin,
      levelMax,
      openToAllLevels: openToAll,
      createdAt: Date.now(),
    });
    showToast(t('Activity published — it is live in Discover'));
    setTimeout(() => router.push('/(tabs)/games'), 900);
  };

  const matching = useMemo(() => {
    // a wider band reaches more people; the figure moves as you drag the rail
    const span = Math.max(0.5, levelMax - levelMin);
    return Math.round(12 + span * 14 + (levelMin < 3 ? 9 : 0));
  }, [levelMin, levelMax]);

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          minHeight: 48,
          paddingTop: top,
          paddingHorizontal: gutter,
        }}
      >
        <RoundButton
          icon="x"
          size={19}
          // Create is a tab, so it can be the first screen in the stack — there is
          // not always a back to go to
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          label={t('Close')}
        />
        <Txt f="display" size={19} em={-0.03}>
          {t('New activity')}
        </Txt>
        {/* sized to its content: a fixed 44 fits "Save" but wraps "Kaydet" */}
        <PressScale
          onPress={() => showToast(t('Draft saved'))}
          to={0.96}
          accessibilityRole="button"
          accessibilityLabel={t('Save')}
          style={{
            minWidth: 44,
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingVertical: 13,
            marginVertical: -13,
          }}
        >
          <Txt f="semibold" size={14} c={color.blue} numberOfLines={1}>
            {t('Save')}
          </Txt>
        </PressScale>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* sport */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 20, paddingHorizontal: gutter }}
        >
          {SPORTS.map((key) => (
            <Chip
              key={key}
              label={t(sportLabel(key))}
              icon={sportIcon(key)}
              active={sport === key}
              onPress={() => pickSport(key)}
              height={40}
              size={14}
            />
          ))}
        </ScrollView>

        {/* when / where / format */}
        <RowGroup style={{ marginTop: 16, marginHorizontal: gutter }}>
          <ListRow
            icon="calendar-check"
            label={t('When')}
            value={`${t(when.label)} · ${formatTime(when.time, lang)}`}
            onPress={() => setSheet('when')}
          />
          <ListRow icon="map-pin" label={t('Where')} value={venue} onPress={() => setSheet('where')} />
          <ListRow
            icon="users-three"
            label={t('Format')}
            value={t(format)}
            onPress={() => setSheet('format')}
            last
          />
        </RowGroup>

        {/* who can join */}
        {rated ? (
          <Card style={{ marginTop: 12, marginHorizontal: gutter, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <SectionHead>{t('WHO CAN JOIN')}</SectionHead>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LevelStars n={starsOf(levelMin)} size={13} />
                <Txt f="semibold" size={12} c={color.inkMuted}>
                  {t('to')}
                </Txt>
                <LevelStars n={starsOf(levelMax)} size={13} />
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <RangeRail
                min={levelMin}
                max={levelMax}
                onChange={(lo, hi) => {
                  setLevelMin(lo);
                  setLevelMax(hi);
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 }}>
              <Icon name="lightning" size={14} color={color.orangeDeep} />
              <Txt f="semibold" size={12.5} c={color.orangeDeep} style={{ flexShrink: 1 }}>
                {tf('{n} players near you match this range', { n: matching })}
              </Txt>
            </View>

            {/*
              Players outside the range never see this game unless the host says
              otherwise. Opting in is the only thing that turns "ask to join
              anyway" into a real offer rather than a dead end, so it is asked
              here, once, at the moment the range is set.
            */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginTop: 14,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: color.lineOnSurface,
              }}
            >
              <View style={{ flexGrow: 1, flexShrink: 1 }}>
                <Txt f="bold" size={13.5} em={-0.01}>
                  {t('Let others ask anyway')}
                </Txt>
                <Txt f="medium" size={12} lh={1.35} c={color.inkMuted} style={{ marginTop: 3 }}>
                  {openToAll
                    ? t('Players outside the range can see this and ask. You still decide.')
                    : t('Only players inside the range will see this game.')}
                </Txt>
              </View>
              <Toggle on={openToAll} onChange={setOpenToAll} label={t('Let others ask anyway')} />
            </View>
          </Card>
        ) : null}

        {/* spots */}
        <Card style={{ marginTop: 12, marginHorizontal: gutter, padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionHead>{t('SPOTS')}</SectionHead>
            <Stepper value={capacity} min={2} max={22} onChange={setCapacity} label={t('Spots')} />
          </View>

          {/*
            Six tiles is what the card fits. Beyond that the last one carries the
            remainder — at eight spots this used to draw seven fixed-width tiles
            in a box that holds five, and they spilled out of the card.
          */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            {(() => {
              const MAX = 6;
              const overflow = capacity > MAX ? capacity - (MAX - 1) : 0;
              const slots = overflow ? MAX - 1 : capacity;

              return (
                <>
                  {Array.from({ length: slots }, (_, i) => (
                    <View key={i} style={{ flexGrow: 1, flexBasis: 0, minWidth: 0, alignItems: 'center', gap: 7 }}>
                      {i === 0 ? (
                        <YouAvatar size={44} />
                      ) : (
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: radius.pill,
                            borderWidth: 2,
                            borderStyle: 'dashed',
                            borderColor: color.controlRing,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon name="plus" size={17} color={color.inkMuted} />
                        </View>
                      )}
                      <Txt
                        f={i === 0 ? 'bold' : 'semibold'}
                        size={11.5}
                        c={i === 0 ? color.ink : color.inkMuted}
                        numberOfLines={1}
                      >
                        {i === 0 ? t('You') : t('Open')}
                      </Txt>
                    </View>
                  ))}

                  {overflow ? (
                    <View style={{ flexGrow: 1, flexBasis: 0, minWidth: 0, alignItems: 'center', gap: 7 }}>
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: radius.pill,
                          backgroundColor: color.paper,
                          borderWidth: 1,
                          borderColor: color.lineOnSurface,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Txt f="bold" size={13} c={color.inkMuted}>
                          {`+${overflow}`}
                        </Txt>
                      </View>
                      {/* deliberately unlabelled — it stands for several slots,
                          so calling it "Open" would read as one more */}
                      <Txt f="semibold" size={11.5} c={color.inkMuted}>
                        {' '}
                      </Txt>
                    </View>
                  ) : null}
                </>
              );
            })()}
          </View>
        </Card>

        {/* cost */}
        <Card style={{ marginTop: 12, marginHorizontal: gutter, paddingVertical: 14, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Icon name="coins" size={19} color={color.blue} />
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
              <Txt f="semibold" size={13} c={color.inkMuted}>
                {t('Court cost, split evenly')}
              </Txt>
              <Txt f="bold" size={14.5} em={-0.01} style={{ marginTop: 3 }}>
                {split ? `₺${perPerson} ` : t('Nothing to pay')}
                {split ? (
                  <Txt f="semibold" size={14.5} c={color.inkMuted}>
                    {`${t('per person')} + ${Math.round(FEE_RATE * 100)}% ${t('fee')}`}
                  </Txt>
                ) : null}
              </Txt>
            </View>
            <Toggle on={split} onChange={setSplit} label={t('Split the court cost')} />
          </View>

          {/* the total the court actually costs, so the split is checkable */}
          {split ? (
            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: color.lineOnSurface,
              }}
            >
              <AmountRow
                label={t('Court total')}
                value={courtCost}
                onPress={() => setCostSheet(true)}
              />
            </View>
          ) : null}
        </Card>

        <View style={{ marginTop: 12, marginHorizontal: gutter }}>
          <Note icon="seal-check">
            {tf('Players will see your {rel}% reliability and {rat} rating before they join.', {
              rel: personReliability(you),
              rat: you.rating.toFixed(1),
            })}
          </Note>
        </View>
      </ScrollView>

      {/* the publish bar sits above the tab bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 12,
          paddingBottom: 12,
          paddingHorizontal: gutter,
          backgroundColor: color.paper,
        }}
      >
        <PrimaryButton label={t('Publish activity')} onPress={onPublish} glow />
      </View>

      <Toast message={toast} bottom={82} />

      {/* pickers */}
      <Sheet open={sheet === 'when'} onClose={() => setSheet(null)} title={t('When')}>
        {createWhenOptions.map((o) => (
          <SheetOption
            key={o.label}
            label={`${t(o.label)} · ${formatTime(o.time, lang)}`}
            sub={t(o.dateLine)}
            selected={when.label === o.label}
            onPress={() => {
              setWhen(o);
              setSheet(null);
            }}
          />
        ))}
      </Sheet>

      <Sheet open={sheet === 'where'} onClose={() => setSheet(null)} title={t('Where')}>
        {createVenueOptions.map((o) => (
          <SheetOption
            key={o}
            label={o}
            sub={[city, region].filter(Boolean).join(', ')}
            selected={venue === o}
            onPress={() => {
              setVenue(o);
              setSheet(null);
            }}
          />
        ))}
      </Sheet>

      <AmountSheet
        open={costSheet}
        onClose={() => setCostSheet(false)}
        title={t('Court total')}
        value={courtCost}
        onChange={setCourtCost}
        presets={[480, 600, 720, 960, 1200]}
        // what the number actually means to whoever is setting it
        footnote={(v) =>
          tf('₺{each} each · {n} players', {
            each: Math.round(v / Math.max(1, capacity)).toLocaleString('tr-TR'),
            n: capacity,
          })
        }
        confirmLabel={t('Set court total')}
      />

      <Sheet open={sheet === 'format'} onClose={() => setSheet(null)} title={t('Format')}>
        {formats.map((o) => (
          <SheetOption
            key={o}
            label={t(o)}
            sub={tf('{n} players', { n: formatCapacity[o] ?? 4 })}
            selected={format === o}
            onPress={() => pickFormat(o)}
          />
        ))}
      </Sheet>
    </View>
  );
}
