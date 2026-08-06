import * as Haptics from 'expo-haptics';
import { Check, Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useAppTheme } from '@/hooks/use-app-theme';
import { radii, sizing, spacing } from '@/theme';

type Props = {
  count: number;
  disabled?: boolean;
  name: string;
  onDecrement: () => void;
  onIncrement: () => void;
  target: number;
};

export function HabitCompletionControl({ count, disabled, name, onDecrement, onIncrement, target }: Props) {
  const { colors } = useAppTheme();
  const completed = count >= target;
  const act = (callback: () => void) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    callback();
  };

  if (target === 1) {
    return (
      <Pressable
        accessibilityLabel={completed ? `Undo ${name} completion` : `Complete ${name}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed, disabled }}
        disabled={disabled}
        onPress={() => act(completed ? onDecrement : onIncrement)}
        style={({ pressed }) => [
          styles.single,
          {
            backgroundColor: completed ? colors.success : colors.surface,
            borderColor: completed ? colors.success : colors.border,
          },
          (disabled || pressed) && styles.dimmed,
        ]}
      >
        {completed ? (
          <Check color={colors.onPrimary} size={sizing.iconSmall} strokeWidth={3} />
        ) : (
          <Plus color={colors.primary} size={sizing.iconSmall} />
        )}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={`${name}: ${count} of ${target}`}
      style={[styles.stepper, { backgroundColor: colors.surface, borderColor: completed ? colors.success : colors.border }]}
    >
      <Pressable
        accessibilityLabel={`Undo one ${name} completion`}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || count === 0 }}
        disabled={disabled || count === 0}
        onPress={() => act(onDecrement)}
        style={({ pressed }) => [styles.step, (disabled || count === 0 || pressed) && styles.dimmed]}
      >
        <Minus color={colors.textSecondary} size={sizing.iconSmall} />
      </Pressable>
      <View style={[styles.count, { borderColor: colors.border }]}>
        <AppText style={completed ? { color: colors.success } : undefined} variant="caption">{count}/{target}</AppText>
      </View>
      <Pressable
        accessibilityLabel={completed ? `${name} complete` : `Add one ${name} completion`}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || completed }}
        disabled={disabled || completed}
        onPress={() => act(onIncrement)}
        style={({ pressed }) => [styles.step, completed && { backgroundColor: colors.success }, (disabled || pressed) && styles.dimmed]}
      >
        {completed ? (
          <Check color={colors.onPrimary} size={sizing.iconSmall} strokeWidth={3} />
        ) : (
          <Plus color={colors.primary} size={sizing.iconSmall} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    alignItems: 'center',
    borderLeftWidth: sizing.border,
    borderRightWidth: sizing.border,
    height: sizing.touchTarget,
    justifyContent: 'center',
    minWidth: spacing.xxl,
  },
  dimmed: { opacity: 0.5 },
  single: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    height: sizing.touchTarget,
    justifyContent: 'center',
    width: sizing.touchTarget,
  },
  step: { alignItems: 'center', height: sizing.touchTarget, justifyContent: 'center', width: sizing.touchTarget },
  stepper: {
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: sizing.border,
    flexDirection: 'row',
    height: sizing.touchTarget,
    overflow: 'hidden',
  },
});
