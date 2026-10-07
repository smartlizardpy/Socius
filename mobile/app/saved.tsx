import React from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, gutter } from '../src/theme';
import { Txt } from '../src/components/Txt';
import { RoundButton, EmptyState, useTopPad } from '../src/components/ui';
import { ActivityListCard } from '../src/components/cards';
import { EnterUp } from '../src/components/motion';
import { useI18n } from '../src/i18n';
import { useStore } from '../src/store';
import { byId } from '../src/data/seed';

export default function Saved() {
  const router = useRouter();
  const top = useTopPad();
  const { t } = useI18n();
  const saved = useStore((s) => s.saved);

  const list = saved.map((id) => byId(id)).filter((a): a is NonNullable<typeof a> => a != null);

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
          {t('Saved games')}
        </Txt>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {list.length ? (
          <View style={{ gap: 16, paddingTop: 20, paddingHorizontal: gutter }}>
            {list.map((a, i) => (
              <EnterUp key={a.id} index={i}>
                <ActivityListCard activity={a} />
              </EnterUp>
            ))}
          </View>
        ) : (
          <EmptyState
            icon="bookmark-simple"
            title={t('Nothing saved yet')}
            body={t('Tap the bookmark on any game and it waits for you here until you decide.')}
            action={t('Browse games')}
            onAction={() => router.push('/(tabs)/search')}
          />
        )}
      </ScrollView>
    </View>
  );
}
