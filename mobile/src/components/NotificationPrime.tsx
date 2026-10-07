import React from 'react';
import { View } from 'react-native';

import { color, gutter, radius } from '../theme';
import { Icon } from '../Icon';
import { Txt } from './Txt';
import { GhostButton, PrimaryButton, Sheet } from './ui';
import { useI18n } from '../i18n';
import { useStore } from '../store';

/**
 * The notification ask, deliberately not in onboarding.
 *
 * Opt-in is highest when the question is asked in context, and lowest when it is
 * step N of a queue someone is trying to get through. So it waits until there is
 * a real game to notify about — the first one joined — and states what it would
 * actually tell you rather than asking for "notifications".
 *
 * It fires once. Declining is recorded, so it never asks twice.
 */
export function NotificationPrime() {
  const { t } = useI18n();
  const joined = useStore((s) => s.joined);
  const asked = useStore((s) => s.notificationsAsked);
  const answer = useStore((s) => s.answerNotifications);

  const open = joined.length > 0 && !asked;

  return (
    <Sheet open={open} onClose={() => answer(false)} title={t('Want to know if a spot opens?')}>
      <View style={{ alignItems: 'center', paddingTop: 4, paddingBottom: 8 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: radius.pill,
            backgroundColor: color.blueTint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="bell-ringing" size={30} color={color.blue} />
        </View>
        <Txt
          f="medium"
          size={14}
          lh={1.45}
          align="center"
          c={color.inkMuted}
          style={{ marginTop: 14, paddingHorizontal: 8 }}
        >
          {t(
            'Games fill and people drop out. We will tell you when something changes in a game you are in.',
          )}
        </Txt>
      </View>

      <View style={{ gap: 10, paddingTop: 6, paddingHorizontal: gutter, paddingBottom: 6 }}>
        <PrimaryButton
          label={t('Turn on notifications')}
          icon="bell-ringing"
          iconLeading
          onPress={() => answer(true)}
        />
        <GhostButton label={t('Not now')} icon={null} tone="muted" onPress={() => answer(false)} />
      </View>
    </Sheet>
  );
}
