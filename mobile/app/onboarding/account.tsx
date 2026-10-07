import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { color, gutter } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt } from '../../src/components/Txt';
import { GhostButton, PrimaryButton, RoundButton, useTopPad } from '../../src/components/ui';
import { GoogleG } from '../../src/components/GoogleG';
import { PressScale, EnterUp } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import { img } from '../../src/data/seed';

/**
 * The threshold, and deliberately the threshold.
 *
 * This screen used to sit at the very end — after Ready had already said
 * "You're in." — which meant the funnel congratulated you and then put a wall
 * in front of you, and Ready's own button said "Find your first game" while
 * delivering a sign-up sheet. Asked for directly: sign-in opens the process
 * instead. By here the explainer has made the case, so the ask lands on someone
 * who knows what they would be signing into, and everything they set up
 * afterwards is saved as they set it rather than reconciled at the end.
 *
 * Skipping stays a first-class path — "Not now" goes exactly where the buttons
 * go, and Profile keeps the offer open for anyone who took it.
 *
 * Nothing here collects a credential. The provider buttons stand in for an OAuth
 * sheet the mockup does not have; there is no password field by design.
 */
export default function Account() {
  const router = useRouter();
  const top = useTopPad();
  const { t } = useI18n();

  const signIn = useStore((s) => s.signIn);

  // Reached from Welcome's "Log in" this is a returning user with nothing to set
  // up, so it says so and drops them straight in.
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const loggingIn = mode === 'login';

  const done = () => (loggingIn ? router.replace('/(tabs)') : router.replace('/onboarding/sports'));

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 48,
          paddingTop: top,
          paddingHorizontal: gutter,
        }}
      >
        <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        <PressScale
          onPress={done}
          to={0.96}
          accessibilityRole="button"
          accessibilityLabel={t('Not now')}
          style={{
            paddingVertical: 13,
            marginVertical: -13,
            paddingHorizontal: 12,
            marginHorizontal: -12,
            minWidth: 44,
            alignItems: 'flex-end',
          }}
        >
          <Txt f="semibold" size={14} c={color.inkMuted}>
            {t('Not now')}
          </Txt>
        </PressScale>
      </View>

      {/* Now that the pitch lives on the panel before this one, the screen holds
          two buttons and two footnotes and was ending two thirds of the way up.
          Centring the block reads as a choice rather than as content that ran
          out; flexGrow keeps it scrollable when a short phone cannot fit it. */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 28 }}
      >
        <View style={{ alignItems: 'center', paddingTop: 4 }}>
          <Image source={img.onbAccount} style={{ width: 300, height: 213 }} resizeMode="contain" />
        </View>

        <View style={{ paddingTop: 16, paddingHorizontal: gutter }}>
          <Txt f="display" size={31} em={-0.035} lh={1.06}>
            {loggingIn ? t('Welcome back') : t('Choose how to sign in')}
          </Txt>
          <Txt f="medium" size={14.5} lh={1.45} c={color.inkMuted} style={{ marginTop: 10 }}>
            {loggingIn
              ? t('Sign in and your sports, your level and your games come back with you.')
              : t('Sign in first and everything you set up next is saved as you set it — on this phone and the next one.')}
          </Txt>
        </View>

        <EnterUp index={0}>
          <View style={{ gap: 10, marginTop: 24, paddingHorizontal: gutter }}>
            <GhostButton
              label={t('Continue with Google')}
              leading={<GoogleG size={19} />}
              onPress={() => {
                signIn('google');
                done();
              }}
            />
            <PrimaryButton
              label={t('Continue with Apple')}
              icon="apple-logo"
              iconLeading
              onPress={() => {
                signIn('apple');
                done();
              }}
            />
          </View>
        </EnterUp>

        {/* what the two questions after this actually cost, said before they are
            asked rather than discovered */}
        {loggingIn ? null : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              marginTop: 18,
            }}
          >
            <Icon name="lightning" size={14} color={color.inkMuted} />
            <Txt f="semibold" size={13} c={color.inkMuted}>
              {t('Three questions, about a minute')}
            </Txt>
          </View>
        )}

        {/* centred, like the line above it — this row was the only left-aligned
            thing under two centred buttons and it read as a misalignment */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 14,
            paddingHorizontal: gutter,
          }}
        >
          <Icon name="lock-simple" size={14} color={color.inkMuted} />
          <Txt f="medium" size={12} lh={1.4} c={color.inkMuted} align="center" style={{ flexShrink: 1 }}>
            {t('We never post anything, and we do not sell your data.')}
          </Txt>
        </View>
      </ScrollView>
    </View>
  );
}
