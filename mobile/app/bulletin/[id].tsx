import React from 'react';
import { View, Image, ScrollView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { color, radius, gutter } from '../../src/theme';
import { Icon, type IconName } from '../../src/components/Icon';
import { Txt, SectionHead } from '../../src/components/Txt';
import { RoundButton, GhostButton, EmptyState, Toast, useToast, useTopPad } from '../../src/components/ui';
import { EnterUp, PressScale } from '../../src/components/motion';
import { useI18n } from '../../src/i18n';
import {
  editionLabel,
  imageOf,
  sourceCaps,
  useBulletinItem,
  useStorySlot,
  type StorySlot,
} from '../../src/data/bulletin';

/** Source: design/src/Story.body.html */
export default function Story() {
  const router = useRouter();
  const top = useTopPad();
  const { t, tf, lang } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();

  const item = useBulletinItem(id);
  const slot = useStorySlot(item);
  const [toast, showToast] = useToast();

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: color.paper, paddingTop: top }}>
        <View style={{ paddingHorizontal: gutter }}>
          <RoundButton icon="caret-left" onPress={() => router.back()} label={t('Back')} />
        </View>
        <EmptyState
          icon="newspaper"
          title={t('Nothing in the bulletin yet')}
          body={t('Today’s stories turn up here each morning.')}
        />
      </View>
    );
  }

  const source = imageOf(item);
  const fromFeed = item.scope === 'world';

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <RoundButton icon="bookmark-simple" onPress={() => router.push('/saved')} label={t('Saved games')} />
          <RoundButton icon="share-network" label={t('Share')} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {source ? (
          <View
            style={{
              marginTop: 4,
              marginHorizontal: gutter,
              height: 176,
              borderRadius: radius.card,
              overflow: 'hidden',
            }}
          >
            <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
        ) : null}

        {/* a publisher's photograph is credited on screen. The repo's own CC0
            shots are credited code-side, so a local story carries no line. */}
        {source && item.source ? (
          <Txt
            f="medium"
            size={11}
            c={color.inkMuted}
            style={{ marginTop: 6, marginHorizontal: gutter }}
          >
            {tf('Photo: {source}', { source: item.source })}
          </Txt>
        ) : null}

        <EnterUp index={0}>
          <View style={{ paddingTop: 15, paddingHorizontal: gutter }}>
            <SectionHead>
              {[item.category[lang], sourceCaps(item)].filter(Boolean).join(' · ')}
            </SectionHead>
            <Txt f="display" size={25} em={-0.032} lh={1.1} style={{ marginTop: 8 }}>
              {item.headline[lang]}
            </Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 }}>
              {/* the sparkle is the tell that a machine wrote the summary; our own
                  items are not summarised, so they carry the masthead instead */}
              <Icon name={fromFeed ? 'sparkle' : 'newspaper'} size={15} color={color.blue} />
              <Txt f="medium" size={12.5} c={color.inkMuted}>
                {`${fromFeed ? t('Summarised by Socius') : 'Socius'} · ${editionLabel(lang)}`}
              </Txt>
            </View>
          </View>
        </EnterUp>

        <View style={{ paddingTop: 14, paddingHorizontal: gutter }}>
          {item.summary.map((p, i) => (
            <EnterUp key={i} index={i + 1}>
              <Txt
                f="medium"
                size={14.5}
                lh={1.52}
                c={i === 0 ? color.ink : color.inkMuted}
                style={{ marginTop: i === 0 ? 0 : 11 }}
              >
                {p[lang]}
              </Txt>
            </EnterUp>
          ))}
        </View>

        {/* a feed story is summarised, credited and linked — never reproduced */}
        {fromFeed && item.sourceUrl ? (
          <GhostButton
            label={tf('Read the full story on {source}', { source: item.source ?? '' })}
            icon="arrow-up-right"
            iconSize={16}
            height={50}
            size={14.5}
            tone="muted"
            onPress={() => Linking.openURL(item.sourceUrl!).catch(() => {})}
            style={{ marginTop: 16, marginHorizontal: gutter }}
          />
        ) : null}

        {/* One card, chosen by what the story is about: a game it names, the
            place it happened, a course, or a sponsor. Our own content keeps the
            blue tint; anything sold says SPONSORED inside the card, because an ad
            wearing the product's clothes is what this surface must never do. */}
        {slot ? <StoryCard slot={slot} onToast={showToast} /> : null}

        {/* a ranked feed owes you the reason, and the lock forbids invented scores */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginTop: 14,
            marginHorizontal: gutter,
          }}
        >
          <Icon name="lightning" size={14} color={color.blue} />
          <Txt f="medium" size={12} c={color.inkMuted}>
            {item.why[lang]}
          </Txt>
        </View>
      </ScrollView>

      <Toast message={toast} bottom={16} />
    </View>
  );
}

/* ------------------------------------------------------------- foot card -- */

function StoryCard({ slot, onToast }: { slot: StorySlot; onToast: (m: string) => void }) {
  const router = useRouter();
  const { t, tf, lang } = useI18n();

  // a placement is labelled and plain; our own content is tinted and has a button
  const sold = slot.kind === 'ad' || slot.kind === 'course';

  const icon =
    slot.kind === 'game' ? slot.icon
    : slot.kind === 'venue' ? 'map-pin'
    : slot.kind === 'course' ? 'graduation-cap'
    : slot.ad.icon;

  // a course or an activity has a translated title; a venue and a business are
  // proper nouns and stay as they are in either language
  const title =
    slot.kind === 'ad'
      ? slot.ad.name
      : slot.kind === 'venue'
        ? slot.title
        : t(slot.title);

  const sub =
    slot.kind === 'ad'
      ? slot.ad.line[lang]
      : slot.kind === 'venue'
        ? [
            slot.count === 1
              ? t('1 game here this week')
              : tf('{n} games here this week', { n: slot.count }),
            slot.priceFrom != null
              ? tf('from ₺{price}', { price: slot.priceFrom.toLocaleString('tr-TR') })
              : null,
          ]
            .filter(Boolean)
            .join(' · ')
        : slot.kind === 'course'
          ? `${t(slot.sub)} · ₺${slot.price.toLocaleString('tr-TR')}`
          : t(slot.sub);

  return (
    <PressScale
      onPress={() => (slot.kind === 'ad' ? onToast(slot.ad.name) : router.push(slot.href as never))}
      to={0.99}
      haptic="none"
      accessibilityRole="button"
      accessibilityLabel={sold ? `${title} — ${t('SPONSORED')}` : title}
      style={{
        marginTop: 18,
        marginHorizontal: gutter,
        padding: 12,
        borderRadius: radius.card,
        backgroundColor: sold ? color.surface : color.blueTint,
        borderWidth: sold ? 1 : 0,
        borderColor: color.lineOnSurface,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.tile,
            backgroundColor: sold ? color.paper : color.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon as IconName} size={22} color={sold ? color.inkMuted : color.blue} />
        </View>

        <View style={{ flexGrow: 1, flexShrink: 1 }}>
          {/* the disclosure rides the title line rather than sitting above the
              card — small, but never absent */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Txt f="bold" size={14.5} em={-0.012} numberOfLines={1} style={{ flexShrink: 1 }}>
              {title}
            </Txt>
            {sold ? (
              <SectionHead size={9.5} style={{ flexShrink: 0 }}>
                {t('SPONSORED')}
              </SectionHead>
            ) : null}
          </View>
          <Txt
            f="medium"
            size={12.5}
            lh={1.35}
            c={sold ? color.inkMuted : color.blueDeep}
            style={{ marginTop: 3 }}
          >
            {sub}
          </Txt>
        </View>

        {sold ? (
          <Icon name="arrow-up-right" size={16} color={color.inkMuted} />
        ) : (
          <View
            style={{
              height: 36,
              paddingHorizontal: 16,
              borderRadius: radius.pill,
              backgroundColor: color.blue,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Txt f="semibold" size={13.5} c={color.onBlue}>
              {t('See')}
            </Txt>
          </View>
        )}
      </View>
    </PressScale>
  );
}
