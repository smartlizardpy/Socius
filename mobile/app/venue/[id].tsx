import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import { RoundButton, GhostButton, Chip, EmptyState, Toast, useToast, useTopPad } from '../../src/components/ui';
import { ActivityRow } from '../../src/components/cards';
import { EnterUp } from '../../src/components/motion';
import { useI18n, formatDecimal } from '../../src/i18n';
import { sportFilters, sportLabel } from '../../src/data/seed';
import { useVenue, useVenueGames } from '../../src/data/venues';

export default function VenueScreen() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const [toast, showToast] = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();

  const venue = useVenue(id);
  const games = useVenueGames(id);

  if (!venue) {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper, paddingTop: top }}>
        <View style={{ paddingHorizontal: gutter }}>
          <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        </View>
        <EmptyState
          icon="map-pin"
          title={t('We do not know this place')}
          body={t('It may have been renamed since this link was made.')}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View style={{ paddingTop: top, paddingHorizontal: gutter }}>
        <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View
          style={{
            marginTop: 4,
            marginHorizontal: gutter,
            height: 168,
            borderRadius: radius.card,
            overflow: 'hidden',
          }}
        >
          <Image source={venue.hero} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>

        <EnterUp index={0}>
          <View style={{ paddingTop: 15, paddingHorizontal: gutter }}>
            <Txt f="display" size={26} em={-0.035} lh={1.08}>
              {venue.name}
            </Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 9 }}>
              <Icon name="map-pin" size={15} color={color.orange} />
              <Txt f="medium" size={13} c={color.inkMuted} style={{ flexShrink: 1 }}>
                {venue.address}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
              <Icon name="person-simple-bike" size={15} color={color.blue} />
              <Txt f="medium" size={13} c={color.inkMuted}>
                {`${formatDecimal(venue.distanceKm, lang)} km · ${t(venue.travel)}`}
              </Txt>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
              <Icon name="coins" size={15} color={color.blue} />
              <Txt f="medium" size={13} c={color.inkMuted}>
                {venue.priceFrom != null
                  ? tf('Games here start at ₺{price} a player', {
                      price: venue.priceFrom.toLocaleString('tr-TR'),
                    })
                  : t('Free to play here')}
              </Txt>
            </View>
          </View>
        </EnterUp>

        {/* what is played here — derived from the games, never asserted */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            paddingTop: 14,
            paddingHorizontal: gutter,
          }}
        >
          {venue.sports.map((s) => (
            <Chip key={s} label={t(sportLabel(s))} icon={sportFilters.find((f) => f.key === s)?.icon} />
          ))}
        </View>

        <GhostButton
          label={t('Get directions')}
          icon="map-trifold"
          height={48}
          size={15}
          tone="muted"
          onPress={() => showToast(`${venue.name} — ${t('directions open in Maps')}`)}
          style={{ marginTop: 16, marginHorizontal: gutter }}
        />

        <View style={{ paddingTop: 22, paddingHorizontal: gutter }}>
          <SectionHead>{t('GAMES HERE')}</SectionHead>
        </View>

        {games.length ? (
          <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
            {games.map((a, i) => (
              <EnterUp key={a.id} index={i + 1}>
                <ActivityRow activity={a} />
              </EnterUp>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="calendar-blank"
            title={t('Nothing booked here yet')}
            body={t('Be the first — create a game and pick this place.')}
            action={t('Create a game')}
            onAction={() => router.push('/(tabs)/create')}
          />
        )}
      </ScrollView>

      <Toast message={toast} bottom={16} />
    </View>
  );
}
