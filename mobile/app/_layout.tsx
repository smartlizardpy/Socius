import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from '@expo-google-fonts/instrument-sans';

import { LanguageProvider } from '../src/i18n';
import { color } from '../src/theme';
import { img } from '../src/data/seed';

SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Every photograph, illustration and face the app ships. There are fifteen of
 * them and they are all bundled, so this is a decode-and-cache pass rather than a
 * download — but without it the first screen paints its layout and then pops the
 * art in a second or two later, which reads as the app stuttering rather than
 * loading.
 */
const IMAGES = Object.values(img);

/**
 * The splash must not be able to wedge on a slow or missing asset. If the preload
 * has not finished by then, the app opens anyway and the images arrive as they
 * used to — late, but never never.
 */
const PRELOAD_CEILING_MS = 4000;

export default function RootLayout() {
  const [fontsReady] = useFonts({
    BricolageGrotesque_700Bold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });

  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setImagesReady(true);
    };

    const ceiling = setTimeout(done, PRELOAD_CEILING_MS);

    // a single asset failing to decode should not hold the whole app back
    Promise.all(IMAGES.map((m) => Asset.loadAsync(m).catch(() => null)))
      .then(done)
      .catch(done);

    return () => {
      cancelled = true;
      clearTimeout(ceiling);
    };
  }, []);

  const ready = fontsReady && imagesReady;

  // Hold the splash until the faces resolve — a flash of fallback type would show
  // the wrong tracking at display sizes — and until the art is decoded, so the
  // first screen arrives whole instead of filling in.
  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <View style={{ flex: 1, backgroundColor: color.paper }} onLayout={onLayout}>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: color.paper },
                // native stack defaults, ~350ms — do not hand-roll page transitions
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ animation: 'fade' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="rate" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack>
          </View>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
