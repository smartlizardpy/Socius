import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { color, radius, gutter, elevation } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import { RoundButton, EmptyState, useTopPad } from '../../src/components/ui';
import { EnterUp, PressScale } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import { dateLine, imageOf, kicker, useBulletin, type BulletinItem } from '../../src/data/bulletin';

/** Source: design/src/Bulletin.body.html */
export default function Bulletin() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();

  const items = useBulletin();
  const [lead, ...rest] = items;

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
        <RoundButton icon="bookmark-simple" onPress={() => router.push('/saved')} label={t('Saved games')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={{ paddingTop: 6, paddingHorizontal: gutter }}>
          <SectionHead>{dateLine[lang]}</SectionHead>
          <Txt f="display" size={30} em={-0.035} lh={1.05} style={{ marginTop: 6 }}>
            {t('Bulletin')}
          </Txt>
          <Txt f="medium" size={14} lh={1.35} c={color.inkMuted} style={{ marginTop: 6 }}>
            {t('Your sports, near you and worldwide')}
          </Txt>
        </View>

        {lead ? (
          <EnterUp index={0}>
            <LeadCard item={lead} />
          </EnterUp>
        ) : null}

        {rest.length ? (
          <>
            {/* the count is a fact, not an action — SectionRow's slot renders blue
                and pressable, which would promise a tap that does not exist */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
                paddingTop: 18,
                paddingHorizontal: gutter,
              }}
            >
              <SectionHead>{t('LATEST')}</SectionHead>
              <Txt f="semibold" size={13} c={color.inkMuted}>
                {items.length === 1 ? t('1 story') : tf('{n} stories', { n: items.length })}
              </Txt>
            </View>
            <View
              style={{
                marginTop: 10,
                marginHorizontal: gutter,
                backgroundColor: color.surface,
                borderWidth: 1,
                borderColor: color.lineOnSurface,
                borderRadius: radius.card,
                overflow: 'hidden',
              }}
            >
              {rest.map((item, i) => (
                <EnterUp key={item.id} index={i + 1}>
                  <Row item={item} first={i === 0} />
                </EnterUp>
              ))}
            </View>
          </>
        ) : null}

        {items.length === 0 ? (
          <EmptyState
            icon="newspaper"
            title={t('Nothing in the bulletin yet')}
            body={t('Today’s stories turn up here each morning.')}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ lead -- */

/** The one place in the app that sets type over a photograph. The scrim is
 *  measured, not eyeballed: 6.36:1 for the headline, 4.89:1 for the kicker. */
function LeadCard({ item }: { item: BulletinItem }) {
  const router = useRouter();
  const { lang } = useI18n();
  const source = imageOf(item);

  return (
    <PressScale
      onPress={() => router.push(`/bulletin/${item.id}`)}
      to={0.985}
      haptic="none"
      accessibilityRole="button"
      accessibilityLabel={item.headline[lang]}
      style={{
        marginTop: 14,
        marginHorizontal: gutter,
        height: 158,
        borderRadius: radius.cardLarge,
        overflow: 'hidden',
        ...elevation,
      }}
    >
      {source ? <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : null}
      <LinearGradient
        colors={['rgba(11,46,122,0.12)', 'rgba(16,26,43,0)', 'rgba(16,26,43,0.62)', 'rgba(16,26,43,0.93)']}
        locations={[0, 0.22, 0.58, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
        <SectionHead c="rgba(255,255,255,0.88)">{kicker(item, lang)}</SectionHead>
        <Txt f="display" size={21} em={-0.025} lh={1.13} c="#FFFFFF" style={{ marginTop: 6 }}>
          {item.headline[lang]}
        </Txt>
      </View>
    </PressScale>
  );
}

/* ------------------------------------------------------------------- row -- */

function Row({ item, first }: { item: BulletinItem; first: boolean }) {
  const router = useRouter();
  const { lang } = useI18n();
  const thumb = imageOf(item);

  return (
    <>
      {first ? null : <View style={{ height: 1, backgroundColor: color.lineOnSurface }} />}
      <PressScale
        onPress={() => router.push(`/bulletin/${item.id}`)}
        to={0.99}
        haptic="none"
        accessibilityRole="button"
        accessibilityLabel={item.headline[lang]}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: thumb ? 12 : 0,
          minHeight: 44,
          paddingVertical: thumb ? 11 : 12,
          paddingHorizontal: 14,
        }}
      >
        {thumb ? (
          <Image
            source={thumb}
            style={{ width: 46, height: 46, borderRadius: radius.media }}
            resizeMode="cover"
          />
        ) : null}

        <View style={{ flexGrow: 1, flexShrink: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <SectionHead style={{ flexGrow: 1, flexShrink: 1 }}>{kicker(item, lang)}</SectionHead>
            {item.badge ? (
              <View
                style={{
                  height: 22,
                  paddingHorizontal: 9,
                  borderRadius: radius.pill,
                  backgroundColor: color.orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* orange fills carry ink, never white */}
                <Txt f="bold" size={9.5} em={0.06} c={color.ink}>
                  {item.badge[lang]}
                </Txt>
              </View>
            ) : null}
          </View>
          <Txt f="bold" size={15} em={-0.012} lh={1.25} style={{ marginTop: 5 }}>
            {item.headline[lang]}
          </Txt>
        </View>

        {/* the caret means this one leaves the bulletin for a game */}
        {item.activityId ? <Icon name="caret-right" size={16} color={color.inkMuted} /> : null}
      </PressScale>
    </>
  );
}
