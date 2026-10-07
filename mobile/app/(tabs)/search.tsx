import React, { useMemo, useState } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter, font } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  Chip,
  Sheet,
  Card,
  EmptyState,
  PrimaryButton,
  GhostButton,
  Toggle,
  LevelStars,
  useTopPad,
} from '../../src/components/ui';
import { ActivityListCard } from '../../src/components/cards';
import { PressScale, EnterUp } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore, emptyFilters, countFilters, type Filters } from '../../src/store';
import {
  people,
  sportFilters,
  starsOf,
  eligible,
  levelForSport,
  you,
  type Activity,
  personReliability,} from '../../src/data/seed';
import { useAllActivities } from '../../src/data/activities';

/** Source: design/src/Search.body.html */
export default function Search() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();

  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const recents = useStore((s) => s.recentSearches);
  const addRecent = useStore((s) => s.addRecentSearch);
  const clearRecents = useStore((s) => s.clearRecentSearches);
  const city = useStore((s) => s.city);
  const levels = useStore((s) => s.levels);
  const myLevel = Number(levels.padel ?? you.padelLevel);

  const [query, setQuery] = useState('');
  const [sheet, setSheet] = useState(false);

  const all = useAllActivities();

  // Anything you are not eligible for is out of the list entirely — the count
  // below says how many, so a shorter list is explained rather than mysterious.
  const open = useMemo(() => all.filter((a) => eligible(a, levels)), [all, levels]);
  const hiddenByLevel = all.length - open.length;

  const results = useMemo(
    () => open.filter((a) => matches(a, query, filters, levels)),
    [open, query, filters, levels],
  );

  const active = countFilters(filters);

  const toggleSport = (key: string) =>
    setFilters({
      ...filters,
      sports: filters.sports.includes(key)
        ? filters.sports.filter((s) => s !== key)
        : [...filters.sports, key],
    });

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      {/* search field */}
      <View style={{ paddingTop: top, paddingHorizontal: gutter }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            height: 56,
            paddingLeft: 16,
            paddingRight: 6,
            borderRadius: radius.pill,
            backgroundColor: color.surface,
            borderWidth: 1,
            borderColor: color.lineOnPaper,
          }}
        >
          <Icon name="magnifying-glass" size={19} color={color.inkMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => addRecent(query)}
            placeholder={t('Try “evening games near me”')}
            placeholderTextColor={color.inkMuted}
            returnKeyType="search"
            accessibilityLabel={t('Search')}
            style={{
              flexGrow: 1,
              flexShrink: 1,
              // fill the 56px bar: an input sized to its own text leaves most of
              // the bar dead to a tap, which is not what a search bar looks like
              alignSelf: 'stretch',
              fontFamily: font.semibold,
              fontSize: 15,
              letterSpacing: -0.15,
              color: color.ink,
              // RN web draws a focus ring that is not in the design system
              outlineStyle: 'none',
            } as any}
          />
          {query ? (
            <Pressable
              onPress={() => setQuery('')}
              accessibilityRole="button"
              accessibilityLabel={t('Clear')}
              hitSlop={8}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="x" size={16} color={color.inkMuted} />
            </Pressable>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>
      </View>

      {/* sport facets */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // A horizontal ScrollView in a column parent has no intrinsic height on web
        // and collapses to a sliver, so the height is fixed. 52, not 50: the chip's
        // touch box is 44 and it is pulled back by a negative margin, which this
        // rail's overflow:hidden would otherwise clip to 32 — smaller than before.
        style={{ flexGrow: 0, height: 52 }}
        contentContainerStyle={{ gap: 8, paddingHorizontal: gutter, alignItems: 'center' }}
      >
        {sportFilters
          .filter((f) => f.key !== 'all')
          .map((f) => (
            <Chip
              key={f.key}
              label={t(f.label)}
              icon={f.icon}
              active={filters.sports.includes(f.key)}
              onPress={() => toggleSport(f.key)}
            />
          ))}
        <Chip
          label={t('Tonight')}
          active={filters.when === 'today'}
          onPress={() =>
            setFilters({ ...filters, when: filters.when === 'today' ? 'any' : 'today' })
          }
        />
        <Chip
          label={t('My level')}
          active={filters.myLevel}
          onPress={() => setFilters({ ...filters, myLevel: !filters.myLevel })}
        />
        <Chip
          label={t('Free')}
          active={filters.freeOnly}
          onPress={() => setFilters({ ...filters, freeOnly: !filters.freeOnly })}
        />
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* count + filter sheet */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 22,
            paddingHorizontal: gutter,
          }}
        >
          <Txt f="semibold" size={13.5} em={-0.01} style={{ flexShrink: 1 }}>
            {results.length === 1
              ? tf('1 game near {city}', { city })
              : tf('{n} games near {city}', { n: results.length, city })}
          </Txt>
          <Chip
            label={active === 1 ? t('1 filter') : tf('{n} filters', { n: active })}
            icon="sliders-horizontal"
            active={active > 0}
            onPress={() => setSheet(true)}
            size={12.5}
          />
        </View>

        {hiddenByLevel ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingTop: 10,
              paddingHorizontal: gutter,
            }}
          >
            <Icon name="info" size={14} color={color.inkMuted} />
            <Txt f="medium" size={12} c={color.inkMuted} style={{ flexShrink: 1 }}>
              {hiddenByLevel === 1
                ? t('1 more nearby asks for a different level')
                : tf('{n} more nearby ask for a different level', { n: hiddenByLevel })}
            </Txt>
          </View>
        ) : null}

        {/* results */}
        {results.length ? (
          <View style={{ gap: 16, paddingTop: 22, paddingHorizontal: gutter }}>
            {results.map((a, i) => (
              <EnterUp key={a.id} index={i}>
                <ActivityListCard activity={a} />
              </EnterUp>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="list-magnifying-glass"
            title={t('Nothing matches that')}
            body={t('Try a wider distance, or drop a filter or two — there are games on every night this week.')}
            action={t('Clear filters')}
            onAction={() => {
              setFilters(emptyFilters);
              setQuery('');
            }}
          />
        )}

        {/* recent searches, when you have not typed anything */}
        {!query && recents.length ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                paddingTop: 26,
                paddingHorizontal: gutter,
              }}
            >
              <SectionHead>{t('RECENT SEARCHES')}</SectionHead>
              <Pressable
                onPress={clearRecents}
                accessibilityRole="button"
                accessibilityLabel={t('Clear recent searches')}
                style={{
                  paddingVertical: 14,
                  marginVertical: -14,
                  paddingHorizontal: 10,
                  marginHorizontal: -10,
                  justifyContent: 'center',
                }}
              >
                <Txt f="semibold" size={13} c={color.blue}>
                  {t('Clear')}
                </Txt>
              </Pressable>
            </View>
            <View style={{ gap: 8, paddingTop: 12, paddingHorizontal: gutter }}>
              {recents.map((r) => (
                <PressScale
                  key={r}
                  onPress={() => setQuery(r)}
                  to={0.99}
                  accessibilityRole="button"
                  accessibilityLabel={r}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 11,
                    height: 48,
                    paddingHorizontal: 14,
                    backgroundColor: color.surface,
                    borderWidth: 1,
                    borderColor: color.lineOnSurface,
                    borderRadius: radius.mediaLarge,
                  }}
                >
                  <Icon name="clock-countdown" size={17} color={color.inkMuted} />
                  <Txt f="medium" size={13.5} style={{ flexGrow: 1, flexShrink: 1 }} numberOfLines={1}>
                    {r}
                  </Txt>
                  <Icon name="arrow-u-down-left" size={15} color={color.inkMuted} />
                </PressScale>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>

      <FilterSheet
        open={sheet}
        onClose={() => setSheet(false)}
        filters={filters}
        setFilters={setFilters}
        myStars={starsOf(myLevel)}
        count={results.length}
      />
    </View>
  );
}

/* --------------------------------------------------------------- matching -- */

/**
 * One predicate, so the chips, the sheet and the results count can never disagree
 * about what is being shown.
 */
function matches(a: Activity, query: string, f: Filters, levels: Record<string, string>) {
  const q = query.trim().toLowerCase();
  if (q) {
    const hay = [
      a.title,
      a.headline,
      a.venue,
      a.venueFull,
      a.levelLabel,
      a.keywords,
      people[a.hostId].first,
      a.whenPrefix,
    ]
      .join(' ')
      .toLowerCase();
    // every word has to land somewhere, so "evening padel" narrows rather than widens
    if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
  }

  if (f.sports.length && !f.sports.includes(a.sport)) return false;
  if (f.when === 'today' && a.daysAway !== 0) return false;
  if (f.when === 'week' && a.daysAway > 6) return false;
  if (f.freeOnly && a.price != null) return false;
  if (a.distanceKm > f.distance) return false;

  if (f.myLevel && a.levelMin != null && a.levelMax != null) {
    const lvl = levelForSport(levels, a.sport);
    if (lvl < a.levelMin || lvl > a.levelMax) return false;
  }

  if (f.reliableHosts && personReliability(people[a.hostId]) < 95) return false;

  return true;
}

/* ------------------------------------------------------------ filter sheet -- */

function FilterSheet({
  open,
  onClose,
  filters,
  setFilters,
  myStars,
  count,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  myStars: number;
  count: number;
}) {
  const { t, tf } = useI18n();

  return (
    <Sheet open={open} onClose={onClose} title={t('Filters')} maxHeight={640}>
      <SectionHead>{t('SPORT')}</SectionHead>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {sportFilters
          .filter((f) => f.key !== 'all')
          .map((f) => (
            <Chip
              key={f.key}
              label={t(f.label)}
              icon={f.icon}
              active={filters.sports.includes(f.key)}
              onPress={() =>
                setFilters({
                  ...filters,
                  sports: filters.sports.includes(f.key)
                    ? filters.sports.filter((s) => s !== f.key)
                    : [...filters.sports, f.key],
                })
              }
            />
          ))}
      </View>

      <SectionHead style={{ marginTop: 22 }}>{t('WHEN')}</SectionHead>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        {([
          ['any', 'Any time'],
          ['today', 'Tonight'],
          ['week', 'This week'],
        ] as const).map(([key, label]) => (
          <Chip
            key={key}
            label={t(label)}
            active={filters.when === key}
            onPress={() => setFilters({ ...filters, when: key })}
            style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center' }}
          />
        ))}
      </View>

      <SectionHead style={{ marginTop: 22 }}>{t('HOW FAR')}</SectionHead>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        {[2, 5, 10].map((km) => (
          <Chip
            key={km}
            label={`${km} km`}
            active={filters.distance === km}
            onPress={() => setFilters({ ...filters, distance: km })}
            style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center' }}
          />
        ))}
      </View>

      <Card style={{ marginTop: 22 }}>
        <SwitchRow
          label={t('Only my level')}
          sub={t('Games whose range covers your stars')}
          on={filters.myLevel}
          onChange={(v) => setFilters({ ...filters, myLevel: v })}
          right={<LevelStars n={myStars} size={12} />}
        />
        <SwitchRow
          label={t('Free games only')}
          sub={t('No court or pitch to split')}
          on={filters.freeOnly}
          onChange={(v) => setFilters({ ...filters, freeOnly: v })}
        />
        <SwitchRow
          label={t('Hosts above 95% reliable')}
          sub={t('Turns up when they say they will')}
          on={filters.reliableHosts}
          onChange={(v) => setFilters({ ...filters, reliableHosts: v })}
          last
        />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <GhostButton
          label={t('Reset')}
          onPress={() => setFilters(emptyFilters)}
          tone="muted"
          style={{ flexGrow: 1, flexBasis: 0 }}
        />
        <PrimaryButton
          label={count === 1 ? t('Show 1 game') : tf('Show {n} games', { n: count })}
          onPress={onClose}
          icon={null}
          style={{ flexGrow: 1.4, flexBasis: 0 }}
        />
      </View>
    </Sheet>
  );
}

function SwitchRow({
  label,
  sub,
  on,
  onChange,
  right,
  last = false,
}: {
  label: string;
  sub: string;
  on: boolean;
  onChange: (v: boolean) => void;
  right?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 16,
        ...(last ? null : { borderBottomWidth: 1, borderBottomColor: color.lineOnSurface }),
      }}
    >
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Txt f="bold" size={14} em={-0.01}>
            {label}
          </Txt>
          {right}
        </View>
        <Txt f="medium" size={12} c={color.inkMuted} style={{ marginTop: 3 }}>
          {sub}
        </Txt>
      </View>
      <Toggle on={on} onChange={onChange} label={label} />
    </View>
  );
}
