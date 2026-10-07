import React, { useState } from 'react';
import { View, Image, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter, blueGlow } from '../src/theme';
import { Icon } from '../src/components/Icon';
import { Txt } from '../src/components/Txt';
import { PrimaryButton, Avatar, BottomBar, useTopPad } from '../src/components/ui';
import { PressScale } from '../src/components/motion';
import { FlagEN, FlagTR } from '../src/components/Flag';
import { useI18n } from '../src/i18n';
import { useStore } from '../src/store';
import { img } from '../src/data/seed';

/** Source: design/src/Welcome.body.html */
export default function Welcome() {
  const router = useRouter();
  const top = useTopPad();
  const { t, lang, setLang } = useI18n();
  const resetDemo = useStore((s) => s.resetDemo);
  const [menu, setMenu] = useState(false);
  const { width } = useWindowDimensions();

  // The art is drawn 518×387 in a 386-tall box, i.e. cropped horizontally only.
  // Size it from the height so the illustration stays whole at any screen width.
  const heroH = 386;
  const heroW = heroH * (518 / 387);

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      {/* header — 44px status reserve in the mockup becomes insets.top */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: top,
          paddingHorizontal: gutter,
          zIndex: 5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={img.mark} style={{ width: 32, height: 32 }} />
          <Txt f="display" size={23} em={-0.035}>
            avenza
          </Txt>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ position: 'relative' }}>
            <PressScale
              onPress={() => setMenu((m) => !m)}
              to={0.96}
              accessibilityRole="button"
              accessibilityLabel="Language"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                height: 44,
                paddingHorizontal: 13,
                borderRadius: radius.pill,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.lineOnPaper,
              }}
            >
              {lang === 'en' ? <FlagEN /> : <FlagTR />}
              <Icon name="caret-down" size={13} color={color.inkMuted} />
            </PressScale>

            {menu ? (
              <View
                style={{
                  position: 'absolute',
                  top: 52,
                  right: 0,
                  width: 190,
                  padding: 6,
                  backgroundColor: color.surface,
                  borderWidth: 1,
                  borderColor: color.lineOnSurface,
                  borderRadius: 16,
                  shadowColor: '#101A2B',
                  shadowOffset: { width: 0, height: 14 },
                  shadowOpacity: 0.22,
                  shadowRadius: 20,
                  elevation: 8,
                  zIndex: 10,
                }}
              >
                <LangRow
                  flag={<FlagEN w={24} h={16} />}
                  label="English"
                  active={lang === 'en'}
                  onPress={() => {
                    setLang('en');
                    setMenu(false);
                  }}
                />
                <LangRow
                  flag={<FlagTR w={24} h={16} />}
                  label="Türkçe"
                  active={lang === 'tr'}
                  onPress={() => {
                    setLang('tr');
                    setMenu(false);
                  }}
                />
              </View>
            ) : null}
          </View>

          {/* was plain text: a returning user's only way in was to redo the
              whole of onboarding, which is what made signing in at the end
              feel like the wrong order */}
          <PressScale
            onPress={() => router.push('/onboarding/account?mode=login')}
            to={0.96}
            accessibilityRole="button"
            accessibilityLabel={t('Log in')}
            style={{
              paddingVertical: 13,
              marginVertical: -13,
              paddingHorizontal: 10,
              marginHorizontal: -10,
              justifyContent: 'center',
            }}
          >
            <Txt f="semibold" size={14} c={color.inkMuted}>
              {t('Log in')}
            </Txt>
          </PressScale>
        </View>
      </View>

      {/* hero — fixed as designed; spare height goes to the spacer below, not here */}
      <View
        style={{
          height: heroH,
          flexGrow: 1,
          flexShrink: 1,
          minHeight: 180,
          marginTop: 4,
          overflow: 'hidden',
        }}
      >
        <Image
          source={img.heroPeople}
          accessibilityLabel="Six people playing padel, football, tennis, basketball, running and cycling together"
          style={{
            position: 'absolute',
            top: 0,
            left: (width - heroW) / 2,
            width: heroW,
            height: heroH,
          }}
        />
      </View>

      <View style={{ paddingHorizontal: gutter }}>
        <Txt f="display" size={36} em={-0.04} lh={1.02}>
          {t('Meet people who play like you.')}
        </Txt>
        <Txt f="medium" size={15} lh={1.45} c={color.inkMuted} style={{ marginTop: 12 }}>
          {t(
            'Padel, football, tennis or a Sunday run — matched by level, ten minutes from you, tonight.',
          )}
        </Txt>
      </View>

      {/* social proof */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
          paddingTop: 20,
          paddingHorizontal: gutter,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Avatar source={img.faceSelin} size={32} ring={color.paper} />
          <Avatar source={img.faceMert} size={32} ring={color.paper} style={{ marginLeft: -10 }} />
          <Avatar source={img.faceDeniz} size={32} ring={color.paper} style={{ marginLeft: -10 }} />
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.pill,
              backgroundColor: color.surface,
              borderWidth: 2,
              borderColor: color.paper,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -10,
            }}
          >
            {/* the inner 1px ring the source draws with an inset shadow */}
            <View
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: color.lineOnPaper,
              }}
            />
            <Txt f="bold" size={10} c={color.inkMuted}>
              +9k
            </Txt>
          </View>
        </View>
        <View>
          <Txt f="bold" size={13.5} em={-0.01}>
            {t('9,412 players in İstanbul')}
          </Txt>
          <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 2 }}>
            {t('Selin, Mert and 9,410 others')}
          </Txt>
        </View>
      </View>

      {/*
        The action bar used to take every spare pixel, which on a tall screen left a
        canyon between the social proof and the button. It still absorbs the slack,
        but capped: past ~56px the hero grows into the space instead.
      */}
      <View style={{ flexGrow: 1, minHeight: 12, maxHeight: 56 }} />

      <BottomBar>
        <PrimaryButton
          label={t('Get started')}
          height={56}
          size={16.5}
          iconSize={19}
          glow
          onPress={() => {
            resetDemo();
            router.push('/onboarding/how');
          }}
        />
        <View style={{ height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
          <Txt f="semibold" size={14} c={color.inkMuted}>
            {t('Takes about a minute')}
          </Txt>
        </View>
      </BottomBar>
    </View>
  );
}

function LangRow({
  flag,
  label,
  active,
  onPress,
}: {
  flag: React.ReactNode;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: active }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: active ? color.paper : 'transparent',
      }}
    >
      {flag}
      <Txt f="semibold" size={14} style={{ flexGrow: 1 }}>
        {label}
      </Txt>
      {active ? <Icon name="check" size={16} color={color.blue} /> : null}
    </Pressable>
  );
}
