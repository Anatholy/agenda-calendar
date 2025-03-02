import { ViewStyle } from 'react-native';

/**
 * Represents a calendar event
 */
export interface Event {
  id: string;
  title: string;
  date: Date;
}

/**
 * Localization settings for the calendar
 */
export interface LocalizationSettings {
  /** Locale string (e.g., 'en-US', 'ar-SA', 'he-IL') */
  locale: string;
  /** Date formatting options */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** Time formatting options */
  timeFormat?: Intl.DateTimeFormatOptions;
}

/**
 * Props for the AgendaCalendar component
 */
export interface AgendaCalendarProps<T extends Event> {
  /** Array of events to display */
  events?: T[];
  /** Callback fired when an event is pressed */
  onEventPress?: (event: T) => void;
  /** Custom render function for event items */
  renderItem?: (event: T) => React.ReactElement;
  /** Optional style for the container */
  style?: ViewStyle;
  /** Whether the layout should be RTL */
  isRTL?: boolean;
  /** Localization settings */
  localization?: LocalizationSettings;
} 