import React, { useEffect, useState } from 'react';
import { View, Modal, Pressable, ScrollView } from 'react-native';
import { color, radius, gutter } from '../../theme';
import { Icon } from '../../Icon';
import { Txt } from '../Txt';
import { PressScale, Swap } from '../motion';
import * as Haptics from 'expo-haptics';
import { PrimaryButton, RoundButton } from './buttons';
import { Chip } from './chips';
import { useBottomPad } from './layout';

/* ----------------------------------------------------------------- sheet -- */

/**
 * The bottom sheet behind every picker. One implementation so the grabber, the
 * radius and the dismiss behaviour cannot drift between screens.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  maxHeight = 560,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxHeight?: number;
}) {
  const pad = useBottomPad();
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      {/* The scrim is a sibling behind the sheet, not its parent: nesting the body
          inside a pressable scrim makes a button inside a button. */}
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(16,26,43,0.42)',
          }}
        />
        <View
          style={{
            backgroundColor: color.paper,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: pad,
            maxHeight,
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View
              style={{ width: 40, height: 4, borderRadius: radius.pill, backgroundColor: color.railTrack }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 14,
              paddingHorizontal: gutter,
            }}
          >
            <Txt f="display" size={19} em={-0.03}>
              {title}
            </Txt>
            <RoundButton icon="x" size={18} onPress={onClose} label="Close" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: 14, paddingBottom: 8 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** A selectable row inside a Sheet. */
export function SheetOption({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: color.surface,
        borderRadius: 18,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? color.blue : color.lineOnSurface,
      }}
    >
      <View style={{ flexGrow: 1, flexShrink: 1 }}>
        <Txt f="bold" size={15} em={-0.01}>
          {label}
        </Txt>
        {sub ? (
          <Txt f="medium" size={12.5} c={color.inkMuted} style={{ marginTop: 3 }}>
            {sub}
          </Txt>
        ) : null}
      </View>
      {selected ? (
        <CheckDot size={24} icon={15} />
      ) : (
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: radius.pill,
            borderWidth: 2,
            borderColor: color.controlRing,
          }}
        />
      )}
    </PressScale>
  );
}

/** The blue tick disc, used wherever something is confirmed. */
export function CheckDot({ size = 26, icon = 16 }: { size?: number; icon?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius.pill,
        backgroundColor: color.blue,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="check" size={icon} color={color.onBlue} />
    </View>
  );
}

/* ---------------------------------------------------------------- amount -- */

/**
 * An amount you type, not one you step to.
 *
 * This was a stepper, which meant the value could only ever land on a multiple of
 * its step — a court that costs ₺666 could not be entered at all. Steppers are for
 * small bounded counts (four spots, five players); money is unbounded and exact,
 * so it takes a field.
 *
 * The row shows the number and opens the sheet. The sheet shows the consequence
 * of the number — what each player actually pays — updating as you type, because
 * the split is the thing the host is really deciding.
 */
export function AmountRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: number;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      to={0.99}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ₺${value}`}
      // 44 is the locked floor for a hit target; the row's own content is 23
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}
    >
      <Txt f="semibold" size={13} c={color.inkMuted} style={{ flexGrow: 1 }}>
        {label}
      </Txt>
      <Txt f="display" size={19} em={-0.02}>
        {`₺${value.toLocaleString('tr-TR')}`}
      </Txt>
      <Icon name="pencil-simple" size={16} color={color.blue} />
    </PressScale>
  );
}

export function AmountSheet({
  open,
  onClose,
  title,
  value,
  onChange,
  presets = [],
  /** rendered under the amount — the split, the per-person figure, whatever the
   *  number actually means to the person setting it */
  footnote,
  confirmLabel,
  max = 999999,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  value: number;
  onChange: (v: number) => void;
  presets?: number[];
  footnote?: (v: number) => string;
  confirmLabel: string;
  max?: number;
}) {
  const [draft, setDraft] = useState(String(value));

  // reopening starts from whatever is currently set
  useEffect(() => {
    if (open) setDraft(String(value));
  }, [open, value]);

  const parsed = Math.min(max, Number(draft) || 0);

  const press = (key: string) => {
    Haptics.selectionAsync();
    setDraft((d) => {
      if (key === 'del') return d.length <= 1 ? '0' : d.slice(0, -1);
      const next = d === '0' ? key : d + key;
      return next.length > 6 ? d : next;
    });
  };

  return (
    <Sheet open={open} onClose={onClose} title={title} maxHeight={680}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          {/*
            The symbol is set in the UI face, not the display one: Bricolage has
            no ₺ glyph, and alone in its own element there is no sibling text for
            the browser to fall back through, so it renders as a blank box.
          */}
          <Txt f="bold" size={28} lh={1.2} c={color.inkMuted}>
            ₺
          </Txt>
          <Txt f="display" size={42} em={-0.04} lh={1.15}>
            {parsed.toLocaleString('tr-TR')}
          </Txt>
        </View>

        {footnote ? (
          <Swap value={parsed}>
            <Txt f="semibold" size={13.5} c={color.inkMuted} align="center" style={{ marginTop: 8 }}>
              {footnote(parsed)}
            </Txt>
          </Swap>
        ) : null}
      </View>

      {presets.length ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 16,
          }}
        >
          {presets.map((n) => (
            <Chip
              key={n}
              label={`₺${n.toLocaleString('tr-TR')}`}
              active={parsed === n}
              onPress={() => setDraft(String(n))}
              size={12.5}
              height={34}
            />
          ))}
        </View>
      ) : null}

      {/*
        The sheet carries its own keypad rather than raising the OS keyboard.
        A bottom-anchored sheet plus the system numeric pad left the amount, the
        split, the presets and the confirm button all hidden behind the keyboard
        — there is nowhere for a sheet this tall to go. Owning the input means
        the layout is never covered, on any platform.
      */}
      <View style={{ marginTop: 18 }}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['00', '0', 'del'],
        ].map((row) => (
          <View key={row.join()} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            {row.map((key) => (
              <PressScale
                key={key}
                onPress={() => press(key)}
                to={0.94}
                haptic="none"
                accessibilityRole="button"
                accessibilityLabel={key === 'del' ? 'Delete' : key}
                style={{
                  flexGrow: 1,
                  flexBasis: 0,
                  height: 52,
                  borderRadius: radius.mediaLarge,
                  backgroundColor: key === 'del' ? 'transparent' : color.surface,
                  borderWidth: key === 'del' ? 0 : 1,
                  borderColor: color.lineOnSurface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {key === 'del' ? (
                  <Icon name="arrow-u-down-left" size={20} color={color.inkMuted} />
                ) : (
                  <Txt f="display" size={21} em={-0.02}>
                    {key}
                  </Txt>
                )}
              </PressScale>
            ))}
          </View>
        ))}
      </View>

      <PrimaryButton
        label={confirmLabel}
        icon={null}
        style={{ marginTop: 10 }}
        disabled={parsed <= 0}
        onPress={() => {
          onChange(parsed);
          onClose();
        }}
      />
    </Sheet>
  );
}
