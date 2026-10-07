import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../src/theme';
import { Icon } from '../src/components/Icon';
import { Txt } from '../src/components/Txt';
import {
  RoundButton,
  TapCard,
  Avatar,
  LevelStars,
  StarRow,
  useTopPad,
} from '../src/components/ui';
import { EnterUp } from '../src/components/motion';
import { useI18n, formatDecimal, formatPercent } from '../src/i18n';
import { useStore } from '../src/store';
import { people, sportLabel, starsOf, type PersonId, personReliability } from '../src/data/seed';

const ORDER: PersonId[] = ['selin', 'mert', 'ayca', 'deniz'];

/** Where "See all" on the Discover people rail lands. */
export default function Players() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const following = useStore((s) => s.following);

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
          {t('Players at your level')}
        </Txt>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Txt
          f="medium"
          size={14}
          lh={1.4}
          c={color.inkMuted}
          style={{ paddingTop: 12, paddingHorizontal: gutter }}
        >
          {t('Everyone here plays within one star of you and turns up when they say they will.')}
        </Txt>

        <View style={{ gap: 10, paddingTop: 18, paddingHorizontal: gutter }}>
          {ORDER.map((id, i) => {
            const p = people[id];
            const main = p.sports[0];
            return (
              <EnterUp key={id} index={i}>
                <TapCard
                  onPress={() => router.push(`/player/${id}`)}
                  label={p.name}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}
                >
                  <Avatar source={p.face} size={52} />
                  <View style={{ flexGrow: 1, flexShrink: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Txt f="bold" size={15} em={-0.01}>
                        {p.name}
                      </Txt>
                      {p.verified ? <Icon name="seal-check" size={15} color={color.blue} /> : null}
                      {following.includes(id) ? (
                        <View
                          style={{
                            height: 20,
                            paddingHorizontal: 8,
                            borderRadius: radius.pill,
                            backgroundColor: color.blueTint,
                            justifyContent: 'center',
                          }}
                        >
                          <Txt f="bold" size={9.5} em={0.05} c={color.blueDeep}>
                            {t('FOLLOWING')}
                          </Txt>
                        </View>
                      ) : null}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
                      <Txt f="semibold" size={12.5} c={color.inkMuted}>
                        {t(sportLabel(main.sport))}
                      </Txt>
                      {main.level ? <LevelStars n={starsOf(Number(main.level))} size={11} /> : null}
                      <Txt f="medium" size={12.5} c={color.inkMuted}>
                        {`· ${formatDecimal(p.distanceKm, lang)} km`}
                      </Txt>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 }}>
                      <StarRow value={p.rating} size={11} />
                      <Txt f="semibold" size={11.5} c={color.inkMuted}>
                        {tf('{rating} · {rel} reliable', {
                          rating: formatDecimal(p.rating, lang),
                          rel: formatPercent(personReliability(p), lang),
                        })}
                      </Txt>
                    </View>
                  </View>
                  <Icon name="caret-right" size={18} color={color.inkMuted} />
                </TapCard>
              </EnterUp>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
