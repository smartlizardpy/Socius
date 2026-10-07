import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, radius, tabBarHeight } from '../../src/theme';
import { Icon, type IconName } from '../../src/Icon';
import { Txt } from '../../src/components/Txt';
import { PressScale } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { NotificationPrime } from '../../src/components/NotificationPrime';

type TabDef = {
  name: string;
  label: string;
  icon: IconName;
  /** the mockups swap house -> house-fill on the active tab */
  activeIcon?: IconName;
};

const TABS: TabDef[] = [
  { name: 'index', label: 'Discover', icon: 'house', activeIcon: 'house-fill' },
  { name: 'search', label: 'Search', icon: 'magnifying-glass' },
  { name: 'create', label: 'Create', icon: 'plus' },
  { name: 'games', label: 'Games', icon: 'calendar-blank', activeIcon: 'calendar-check' },
  { name: 'profile', label: 'Profile', icon: 'user', activeIcon: 'user-fill' },
];

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <AvenzaTabBar {...props} />}>
        {TABS.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} />
        ))}
      </Tabs>
      {/* asked once, on the first tab screen after a game is joined — never in
          the onboarding queue, where a cold ask gets a permanent no */}
      <NotificationPrime />
    </>
  );
}

/** Source: the tab bar drawn at the foot of Main.body.html and Search.body.html. */
function AvenzaTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <View
      style={{
        height: tabBarHeight + insets.bottom,
        paddingBottom: insets.bottom,
        paddingHorizontal: 22,
        backgroundColor: color.surface,
        borderTopWidth: 1,
        borderTopColor: color.lineOnSurface,
        flexDirection: 'row',
        // centred, not pinned to the top: flex-start on a fixed height is what
        // put 11px above the icons and 19 below them
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {TABS.map((tab, i) => {
        const focused = state.index === i;
        const go = () => {
          const route = state.routes[i];
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };

        // the centre action is an orange disc with no label
        if (tab.name === 'create') {
          return (
            <PressScale
              key={tab.name}
              onPress={go}
              to={0.92}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t('Create')}
              style={{ width: 52, alignItems: 'center' }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: radius.pill,
                  backgroundColor: color.orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -2,
                  shadowColor: color.orange,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.45,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                {/* orange fills carry ink, never white */}
                <Icon name="plus" size={24} color={color.ink} />
              </View>
            </PressScale>
          );
        }

        return (
          <PressScale
            key={tab.name}
            onPress={go}
            to={0.94}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={t(tab.label)}
            // 44 exactly — the lock's touch floor. The icon and label draw 40 of
            // it and the remaining 4 is thumb slack, which is all the bar owes
            // them now that the box is not oversized.
            style={{ width: 52, height: 44, alignItems: 'center', gap: 4 }}
          >
            <Icon
              name={focused && tab.activeIcon ? tab.activeIcon : tab.icon}
              size={23}
              color={focused ? color.blue : color.inkMuted}
            />
            <Txt
              f={focused ? 'bold' : 'semibold'}
              size={10}
              em={focused ? 0.01 : undefined}
              c={focused ? color.blue : color.inkMuted}
            >
              {t(tab.label)}
            </Txt>
          </PressScale>
        );
      })}
    </View>
  );
}
