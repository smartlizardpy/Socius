import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../src/theme';
import { Icon } from '../src/components/Icon';
import { Txt, SectionHead } from '../src/components/Txt';
import { RoundButton, Avatar, EmptyState, useTopPad } from '../src/components/ui';
import { PressScale, EnterUp } from '../src/components/motion';
import { useI18n } from '../src/i18n';
import { useStore } from '../src/store';
import { notifications, people, type Notification } from '../src/data/seed';

export default function Notifications() {
  const router = useRouter();
  const top = useTopPad();
  const { t } = useI18n();

  const seen = useStore((s) => s.seenNotifications);
  const markAllSeen = useStore((s) => s.markAllNotificationsSeen);
  const unread = !seen.includes('*');

  // opening the list is what clears the dot on the Discover bell
  useEffect(() => {
    if (unread) markAllSeen();
  }, [unread, markAllSeen]);

  const today = notifications.filter((n) => n.when.includes('ago'));
  const earlier = notifications.filter((n) => !n.when.includes('ago'));

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
          {t('Notifications')}
        </Txt>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell-slash"
            title={t('Nothing new')}
            body={t('When a spot opens or someone rates you, it turns up here.')}
          />
        ) : (
          <>
            <Group label={t('TODAY')} items={today} start={0} unread={unread} />
            <Group label={t('EARLIER')} items={earlier} start={today.length} unread={false} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Group({
  label,
  items,
  start,
  unread,
}: {
  label: string;
  items: Notification[];
  start: number;
  unread: boolean;
}) {
  const router = useRouter();
  const { t } = useI18n();
  if (!items.length) return null;

  return (
    <>
      <View style={{ paddingTop: 20, paddingHorizontal: gutter }}>
        <SectionHead>{label}</SectionHead>
      </View>
      <View style={{ gap: 10, paddingTop: 12, paddingHorizontal: gutter }}>
        {items.map((n, i) => (
          <EnterUp key={n.id} index={start + i}>
            <PressScale
              onPress={() => (n.href ? router.push(n.href as never) : undefined)}
              to={0.99}
              haptic="none"
              accessibilityRole="button"
              accessibilityLabel={t(n.title)}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 12,
                padding: 14,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                borderRadius: radius.card,
              }}
            >
              {n.face ? (
                <Avatar source={people[n.face].face} size={38} />
              ) : (
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      n.tone === 'orange'
                        ? color.orangeTint
                        : n.tone === 'blue'
                          ? color.blueTint
                          : color.paper,
                  }}
                >
                  <Icon
                    name={n.icon}
                    size={19}
                    color={
                      n.tone === 'orange'
                        ? color.orangeDeep
                        : n.tone === 'blue'
                          ? color.blue
                          : color.inkMuted
                    }
                  />
                </View>
              )}

              <View style={{ flexGrow: 1, flexShrink: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Txt f="bold" size={14} em={-0.01} style={{ flexShrink: 1 }}>
                    {t(n.title)}
                  </Txt>
                  {unread ? (
                    <View
                      style={{ width: 8, height: 8, borderRadius: radius.pill, backgroundColor: color.orange }}
                    />
                  ) : null}
                </View>
                <Txt f="medium" size={12.5} lh={1.4} c={color.inkMuted} style={{ marginTop: 4 }}>
                  {t(n.body)}
                </Txt>
                <Txt f="semibold" size={11.5} c={color.inkMuted} style={{ marginTop: 7 }}>
                  {t(n.when)}
                </Txt>
              </View>

              {n.href ? <Icon name="caret-right" size={16} color={color.inkMuted} /> : null}
            </PressScale>
          </EnterUp>
        ))}
      </View>
    </>
  );
}
