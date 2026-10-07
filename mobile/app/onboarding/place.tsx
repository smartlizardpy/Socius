import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon, type IconName } from '../../src/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  PrimaryButton,
  RoundButton,
  ProgressSteps,
  Segmented,
  Chip,
  BottomBar,
  useTopPad,
} from '../../src/components/ui';
import { PressScale, EnterUp, Swap } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { useStore } from '../../src/store';
import { useAllActivities } from '../../src/data/activities';
import { cities, eligible, img } from '../../src/data/seed';
import { covered, semts } from '../../src/data/semts';
import { useDeviceSemt, type SemtState } from '../../src/location';

const RADII = [2, 5, 10];

/**
 * Step 3 — where you play.
 *
 * The screen used to lead with a section head reading YOUR NEIGHBOURHOOD over
 * four hard-coded ilçe, and put the device location last, as a ghost button
 * under everything else. That is backwards twice over: the phone already knows
 * the answer, and the four names it offered instead were not even the right
 * grain — a semt is what people say, and Kadıköy has a dozen of them.
 *
 * So the location control is the screen now. It is the first thing under the
 * heading, it is the only tinted block on the page, and when it resolves it
 * prints the semt at display size, because the place name IS the content here —
 * a sentence describing it would be a caption pretending to be a subject.
 *
 * The list of names has not gone; it has moved to where a fallback belongs,
 * under the location block and only while there is nothing better. This is
 * still the permission prime — a location prompt fired cold gets refused, and a
 * refusal is permanent — but the prime is now the thing being primed rather
 * than a footnote beneath a form.
 */
export default function Place() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf } = useI18n();

  const city = useStore((s) => s.city);
  const setCity = useStore((s) => s.setCity);
  const radiusKm = useStore((s) => s.radiusKm);
  const setRadiusKm = useStore((s) => s.setRadiusKm);
  const allow = useStore((s) => s.setLocationAllowed);
  const levels = useStore((s) => s.levels);

  const [place, locate] = useDeviceSemt();

  const ask = async () => {
    if (place.kind === 'asking') return;
    const found = await locate();
    if (found) {
      allow(true);
      // the il travels with the name: the profile prints the pair, and welding
      // "İstanbul" onto it is how "Kumluca, İstanbul" happened
      setCity(found.name, found.region);
    }
  };

  const all = useAllActivities();

  /*
   * The count is the argument for the radius, so it has to be the real one —
   * and now that the name comes off the phone, "real" has to survive a device
   * that says Bakırköy. The seeded distances are all measured from the
   * Anatolian shore, so the filter alone would report "6 games within 5 km of
   * Bakırköy": the one screen that just measured where you are, wrong about it.
   */
  const here = semts.find((x) => x.name === city);
  const inRange = !here || covered(here);
  const nearby = inRange
    ? all.filter((a) => eligible(a, levels) && a.distanceKm <= radiusKm).length
    : 0;

  return (
    <View style={{ flex: 1, backgroundColor: color.paper }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingTop: top,
          paddingHorizontal: gutter,
        }}
      >
        <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        <ProgressSteps step={3} of={3} />
        <PressScale
          onPress={() => router.push('/onboarding/ready')}
          to={0.96}
          accessibilityRole="button"
          accessibilityLabel={t('Skip')}
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
            {t('Skip')}
          </Txt>
        </PressScale>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        {/* art first, the way every other onboarding screen opens */}
        <View style={{ alignItems: 'center', paddingTop: 6 }}>
          <Image
            source={img.onbPlace}
            style={{ width: 300, height: 225 }}
            resizeMode="contain"
            accessible
            accessibilityLabel={t('Where do you play?')}
          />
        </View>

        <View style={{ paddingTop: 14, paddingHorizontal: gutter }}>
          <SectionHead>{t('STEP 3 OF 3')}</SectionHead>
          <Txt f="display" size={31} em={-0.035} lh={1.06} style={{ marginTop: 10 }}>
            {t('Where do you play?')}
          </Txt>
          <Txt f="medium" size={14} lh={1.4} c={color.inkMuted} style={{ marginTop: 8 }}>
            {t('Games are matched on how far you would actually travel to play.')}
          </Txt>
        </View>

        <EnterUp index={0}>
          <LocationBlock state={place} city={city} onAsk={ask} />
        </EnterUp>

        {/* The names are a fallback, not the offer — a muted line rather than a
            section head. They stay visible even once the phone has answered,
            because a device that reads the wrong side of a street would
            otherwise be a dead end. */}
        <EnterUp index={1}>
            <View style={{ paddingTop: 16, paddingHorizontal: gutter }}>
              <Txt f="medium" size={12.5} c={color.inkMuted}>
                {t('Or pick one')}
              </Txt>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {cities.map((c) => (
                  <Chip key={c} label={c} active={c === city} onPress={() => setCity(c)} />
                ))}
              </View>
            </View>
        </EnterUp>

        <EnterUp index={2}>
          <View style={{ paddingTop: 24, paddingHorizontal: gutter }}>
            <SectionHead>{t('HOW FAR YOU WILL GO')}</SectionHead>
            <View style={{ marginTop: 12 }}>
              <Segmented
                options={RADII.map((km) => ({ key: String(km), label: `${km} km` }))}
                value={String(radiusKm)}
                onChange={(k) => setRadiusKm(Number(k))}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 }}>
              <Icon name="lightning" size={15} color={nearby ? color.blue : color.inkMuted} />
              <Txt f="semibold" size={13} c={nearby ? color.blue : color.inkMuted} style={{ flexShrink: 1 }}>
                {!inRange
                  ? tf('No games in {city} yet.', { city })
                  : nearby === 0
                    ? tf('Nothing within {km} km yet — try a wider radius.', { km: radiusKm })
                    : nearby === 1
                      ? tf('1 game within {km} km of {city}', { km: radiusKm, city })
                      : tf('{n} games within {km} km of {city}', { n: nearby, km: radiusKm, city })}
              </Txt>
            </View>
          </View>
        </EnterUp>

      </ScrollView>

      <BottomBar>
        <PrimaryButton label={t('Continue')} onPress={() => router.push('/onboarding/ready')} />
      </BottomBar>
    </View>
  );
}

/* ----------------------------------------------------------- the control -- */

/**
 * One block, four states, one tap.
 *
 * It is tinted rather than white because it is the only decision on the screen
 * that the screen itself can make for you; every other block here is a plain
 * surface. Found, it prints the semt in display type — at which point the block
 * is no longer a button but an answer, so the tap target becomes the small
 * refresh on the right rather than the whole card.
 */
function LocationBlock({
  state,
  city,
  onAsk,
}: {
  state: SemtState;
  city: string;
  onAsk: () => void;
}) {
  const { t } = useI18n();

  const found = state.kind === 'found';
  const asking = state.kind === 'asking';

  const icon: IconName =
    found ? 'map-pin' : state.kind === 'denied' ? 'lock-simple' : 'crosshair-simple';

  // the block says where we are LOOKING, not only what the phone said: picking
  // a name from the row below changes it, and the block would otherwise sit
  // there contradicting the count line under it
  const picked = found && state.name !== city;

  const title = found
    ? city
    : asking
      ? t('Finding you…')
      : state.kind === 'denied'
        ? t('Location is off')
        : state.kind === 'unknown'
          ? t('Could not find you')
          : t('Use my location');

  const sub = found
    ? picked
      ? null
      : state.area
    : asking
      ? null
      : state.kind === 'denied'
        ? t('Turn it on in Settings, or pick a neighbourhood below.')
        : state.kind === 'unknown'
          ? t('Pick a neighbourhood below instead.')
          : t('We will name the semt you are in and look there first.');

  const body = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: radius.pill,
          backgroundColor: found ? color.blue : color.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={22} color={found ? color.onBlue : color.blueDeep} />
      </View>

      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <Swap value={title}>
          {found ? (
            <Txt f="display" size={27} em={-0.035} lh={1.12} numberOfLines={1}>
              {title}
            </Txt>
          ) : (
            <Txt f="bold" size={16.5} em={-0.015} c={color.blueDeep} numberOfLines={1}>
              {title}
            </Txt>
          )}
          {sub ? (
            <Txt
              f="medium"
              size={13}
              lh={1.35}
              c={found ? color.inkMuted : color.blueDeep}
              style={{ marginTop: found ? 2 : 4 }}
            >
              {sub}
            </Txt>
          ) : null}
        </Swap>
      </View>

      {found ? null : (
        <Icon name="caret-right" size={18} color={color.blueDeep} />
      )}
    </View>
  );

  const box = {
    marginTop: 20,
    marginHorizontal: gutter,
    padding: 16,
    borderRadius: radius.cardLarge,
    backgroundColor: color.blueTint,
  } as const;

  // Answered, the block is a statement and only the refresh is pressable;
  // unanswered, the whole thing is the button.
  if (found) {
    return (
      <View style={box}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flexGrow: 1, flexShrink: 1 }}>{body}</View>
          <PressScale
            onPress={onAsk}
            to={0.94}
            accessibilityRole="button"
            accessibilityLabel={t('Check again')}
            style={{
              width: 44,
              height: 44,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="arrow-clockwise" size={19} color={color.blueDeep} />
          </PressScale>
        </View>
      </View>
    );
  }

  return (
    <PressScale
      onPress={onAsk}
      to={0.985}
      accessibilityRole="button"
      accessibilityLabel={t('Use my location')}
      style={box}
    >
      {body}
    </PressScale>
  );
}
