import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const reminderMapKey = 'lifeos.task-reminder-identifiers';
const taskReminderChannel = 'task-reminders';
const habitReminderMapKey = 'lifeos.habit-reminder-identifiers';
const habitReminderChannel = 'habit-reminders';

type ReminderMap = Record<string, string>;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function readReminderMap(): Promise<ReminderMap> {
  const stored = await SecureStore.getItemAsync(reminderMapKey);
  if (!stored) return {};

  try {
    return JSON.parse(stored) as ReminderMap;
  } catch {
    return {};
  }
}

async function writeReminderMap(map: ReminderMap): Promise<void> {
  await SecureStore.setItemAsync(reminderMapKey, JSON.stringify(map));
}

async function configureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(taskReminderChannel, {
    importance: Notifications.AndroidImportance.DEFAULT,
    name: 'Task reminders',
    vibrationPattern: [0, 250, 250, 250],
  });
  await Notifications.setNotificationChannelAsync(habitReminderChannel, {
    importance: Notifications.AndroidImportance.DEFAULT,
    name: 'Habit reminders',
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function requestReminderPermission(): Promise<void> {
  if (Platform.OS === 'web') {
    throw new Error('Task reminders are available on Android and iPhone.');
  }

  await configureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return;

  const requested = await Notifications.requestPermissionsAsync();
  if (requested.status !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }
}

type HabitReminderMap = Record<string, string[]>;

async function readHabitReminderMap(): Promise<HabitReminderMap> {
  const stored = await SecureStore.getItemAsync(habitReminderMapKey);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as HabitReminderMap;
  } catch {
    return {};
  }
}

async function writeHabitReminderMap(map: HabitReminderMap): Promise<void> {
  await SecureStore.setItemAsync(habitReminderMapKey, JSON.stringify(map));
}

export async function scheduleTaskReminder(
  taskId: string,
  title: string,
  reminderAt: string,
): Promise<void> {
  const reminderDate = new Date(reminderAt);
  if (Number.isNaN(reminderDate.getTime()) || reminderDate.getTime() <= Date.now()) {
    throw new Error('The reminder time must be in the future.');
  }

  await requestReminderPermission();
  const map = await readReminderMap();
  const previousIdentifier = map[taskId];
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      body: 'This task is due now.',
      data: { taskId },
      title,
    },
    trigger: {
      channelId: Platform.OS === 'android' ? taskReminderChannel : undefined,
      date: reminderDate,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });

  if (previousIdentifier && previousIdentifier !== identifier) {
    try {
      await Notifications.cancelScheduledNotificationAsync(previousIdentifier);
    } catch (error) {
      await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => undefined);
      throw error;
    }
  }

  map[taskId] = identifier;
  try {
    await writeReminderMap(map);
  } catch (error) {
    await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => undefined);
    throw error;
  }
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  if (Platform.OS === 'web') return;

  const map = await readReminderMap();
  const identifier = map[taskId];
  if (!identifier) return;

  await Notifications.cancelScheduledNotificationAsync(identifier);
  delete map[taskId];
  await writeReminderMap(map);
}

export async function scheduleHabitReminders(
  habitId: string,
  name: string,
  frequencyType: 'daily' | 'weekly',
  weekdays: number[],
  reminderTime: string,
): Promise<void> {
  const match = /^(\d{2}):(\d{2})/.exec(reminderTime);
  if (!match) throw new Error('Choose a valid habit reminder time.');
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  await requestReminderPermission();

  const triggers: Notifications.SchedulableNotificationTriggerInput[] =
    frequencyType === 'daily'
      ? [{ channelId: Platform.OS === 'android' ? habitReminderChannel : undefined, hour, minute, type: Notifications.SchedulableTriggerInputTypes.DAILY }]
      : weekdays.map((weekday) => ({
          channelId: Platform.OS === 'android' ? habitReminderChannel : undefined,
          hour,
          minute,
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday + 1,
        }));

  const newIdentifiers: string[] = [];
  try {
    for (const trigger of triggers) {
      newIdentifiers.push(await Notifications.scheduleNotificationAsync({
        content: { body: 'A small step keeps your habit moving.', data: { habitId }, title: name },
        trigger,
      }));
    }

    const map = await readHabitReminderMap();
    await Promise.all((map[habitId] ?? []).map((id) => Notifications.cancelScheduledNotificationAsync(id)));
    map[habitId] = newIdentifiers;
    await writeHabitReminderMap(map);
  } catch (error) {
    await Promise.all(newIdentifiers.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined)));
    throw error;
  }
}

export async function cancelHabitReminders(habitId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const map = await readHabitReminderMap();
  await Promise.all((map[habitId] ?? []).map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  delete map[habitId];
  await writeHabitReminderMap(map);
}
