import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { color, radius, gutter } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import {
  RoundButton,
  PrimaryButton,
  UrgencyPill,
  StatePill,
  StarRange,
  Note,
  Avatar,
  Toast,
  useToast,
  useTopPad,
  useBottomPad,
} from '../../src/components/ui';
import { PressScale } from '../../src/components/motion';
import { useI18n, formatDecimal } from '../../src/i18n';
import { useStore } from '../../src/store';
import { courseById, people, starsOf } from '../../src/data/seed';

/** Source: design/src/Course.body.html */
export default function Course() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const top = useTopPad();
  const bottomPad = useBottomPad();
  const { t, tf, lang } = useI18n();
  const [toast, showToast] = useToast();

  const applied = useStore((s) => s.courses.includes(String(id)));
  const apply = useStore((s) => s.applyToCourse);

  const course = courseById(String(id));
  if (!course) return <View style={{ flex: 1, backgroundColor: color.surface }} />;

  const coach = people[course.coachId];
  const places = Math.max(0, course.placesLeft - (applied ? 1 : 0));

  return (
    <View style={{ flex: 1, backgroundColor: color.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* hero */}
        <View style={{ height: 210 }}>
          <Image source={course.hero} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(11,46,122,0.42)', 'rgba(11,46,122,0.04)', 'rgba(11,46,122,0.12)']}
            locations={[0, 0.44, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View
            style={{
              position: 'absolute',
              top: top + 4,
              left: gutter,
              right: gutter,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <RoundButton icon="caret-left" shadow onPress={() => router.back()} label={t('Back')} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <RoundButton
                icon="share-network"
                size={19}
                shadow
                label={t('Share')}
                onPress={() => showToast(t('Course link copied'))}
              />
              <RoundButton
                icon="dots-three"
                shadow
                label={t('More')}
                onPress={() => showToast(t('More options land here in the next build'))}
              />
            </View>
          </View>
        </View>

        {/* sheet */}
        <View
          style={{
            marginTop: -26,
            backgroundColor: color.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 22,
            paddingHorizontal: gutter,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <SectionHead>{t(course.kind)}</SectionHead>
            {applied ? (
              <StatePill label={t("YOU'RE IN")} height={28} />
            ) : (
              <UrgencyPill label={tf('{n} PLACES LEFT', { n: places })} height={28} />
            )}
          </View>

          <Txt f="display" size={27} em={-0.035} lh={1.1} style={{ marginTop: 10 }}>
            {t(course.title)}
          </Txt>
          <Txt f="medium" size={13} c={color.inkMuted} style={{ marginTop: 6 }}>
            {course.venue}
          </Txt>

          {/* the coach */}
          <PressScale
            onPress={() => router.push(`/player/${coach.id}`)}
            to={0.99}
            haptic="none"
            accessibilityRole="button"
            accessibilityLabel={coach.name}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              marginTop: 14,
              padding: 12,
              borderWidth: 1,
              borderColor: color.lineOnSurface,
              borderRadius: 18,
              backgroundColor: color.paper,
            }}
          >
            <Avatar source={coach.face} size={48} />
            <View style={{ flexGrow: 1, flexShrink: 1 }}>
              <Txt f="bold" size={15} em={-0.01}>
                {coach.name}
              </Txt>
              <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 3 }}>
                {t(course.coachLine)}
              </Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Icon name="star-fill" size={13} color={color.orange} />
                <Txt f="semibold" size={12}>
                  {formatDecimal(coach.rating, lang)}
                </Txt>
                <Txt f="medium" size={12} c={color.inkMuted}>
                  {tf('{n} reviews', { n: coach.ratingCount * 2 })}
                </Txt>
              </View>
            </View>
            <Icon name="caret-right" size={18} color={color.inkMuted} />
          </PressScale>

          <SectionHead style={{ marginTop: 18 }}>{t("WHAT'S INCLUDED")}</SectionHead>
          <View style={{ gap: 9, marginTop: 10 }}>
            {course.includes.map((line) => (
              <View key={line} style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
                <Icon name="check" size={15} color={color.blue} />
                <Txt f="medium" size={13.5} lh={1.35} style={{ flexShrink: 1 }}>
                  {t(line)}
                </Txt>
              </View>
            ))}
          </View>

          {/* the facts */}
          <View
            style={{
              marginTop: 16,
              borderWidth: 1,
              borderColor: color.lineOnSurface,
              borderRadius: 18,
              backgroundColor: color.paper,
              paddingHorizontal: 14,
            }}
          >
            <Fact icon="calendar-check" label={t(course.schedule)} value={t(course.runs)} />
            <Fact
              icon="users-three"
              label={tf('Group of {n}', { n: course.groupOf })}
              value={tf('{n} already joined', { n: course.alreadyJoined + (applied ? 1 : 0) })}
            />
            <Fact
              icon="crosshair-simple"
              label={t('Level')}
              value={t(course.levelNote)}
              badge={<StarRange lo={starsOf(course.levelMin)} hi={starsOf(course.levelMax)} size={12} />}
              last
            />
          </View>

          <View style={{ marginTop: 14 }}>
            <Note>{t(course.cancelNote)}</Note>
          </View>
        </View>
      </ScrollView>

      <Toast message={toast} bottom={110} />

      {/* pinned action bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingTop: 14,
          paddingHorizontal: gutter,
          paddingBottom: bottomPad,
          backgroundColor: color.surface,
          borderTopWidth: 1,
          borderTopColor: color.lineOnSurface,
          shadowColor: '#101A2B',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <View>
          <Txt f="display" size={21} em={-0.02} lh={1}>
            {`₺${course.price.toLocaleString('tr-TR')}`}
          </Txt>
          <Txt f="semibold" size={11.5} c={color.inkMuted} style={{ marginTop: 3 }}>
            {t(course.priceNote)}
          </Txt>
        </View>

        {applied ? (
          <View
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 52,
              borderRadius: radius.pill,
              backgroundColor: color.blueTint,
            }}
          >
            <Icon name="check" size={18} color={color.blueDeep} />
            <Txt f="bold" size={16} em={-0.01} c={color.blueDeep}>
              {t('Applied')}
            </Txt>
          </View>
        ) : (
          <PrimaryButton
            label={t('Apply')}
            height={52}
            style={{ flexGrow: 1 }}
            // a course costs more than most games on the app; enrolling on one
            // tap with no total shown was the odd one out
            onPress={() => router.push(`/course/pay/${course.id}`)}
          />
        )}
      </View>
    </View>
  );
}

function Fact({
  icon,
  label,
  value,
  badge,
  last = false,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  value: string;
  badge?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 46,
        paddingVertical: 8,
        ...(last ? null : { borderBottomWidth: 1, borderBottomColor: color.lineOnSurface }),
      }}
    >
      <Icon name={icon} size={17} color={color.blue} />
      <Txt f="semibold" size={13.5} style={{ flexShrink: 1 }}>
        {label}
      </Txt>
      {badge}
      <View style={{ flexGrow: 1 }} />
      {/* two lines, right-aligned: one line fits "6 weeks from 15 Sep" and not
          "15 Eylül'den itibaren 6 hafta", and truncating a date is worse than
          wrapping it. minHeight is a floor, so the row grows when it needs to. */}
      <Txt
        f="medium"
        size={12.5}
        lh={1.3}
        c={color.inkMuted}
        align="right"
        style={{ flexShrink: 1 }}
        numberOfLines={2}
      >
        {value}
      </Txt>
    </View>
  );
}
