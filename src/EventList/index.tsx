import React from 'react';
import { View, Text, ScrollView, StyleSheet, I18nManager } from 'react-native';
import { Event, LocalizationSettings } from '../';

interface EventListProps<T extends Event> {
  events: T[];
  onEventPress?: (event: T) => void;
  renderItem?: (event: T) => React.ReactElement;
  isRTL: boolean;
  localization: LocalizationSettings;
}

function EventList<T extends Event>({
  events,
  onEventPress,
  renderItem,
  isRTL,
  localization
}: EventListProps<T>) {
  const defaultRenderItem = (event: T) => (
    <View style={styles.eventContainer}>
      <Text style={[styles.eventTitle, isRTL && styles.rtlText]}>
        {event.title}
      </Text>
      <Text style={[styles.eventDate, isRTL && styles.rtlText]}>
        {event.date.toLocaleDateString(localization.locale)}
      </Text>
    </View>
  );

  // Group events by date
  const groupedEvents = events.reduce((groups, event) => {
    const date = event.date.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, T[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <ScrollView
      style={styles.eventList}
    >
      {sortedDates.map(date => (
        <View key={date}>
          <Text style={[
            styles.dateHeader,
            isRTL && styles.rtlText
          ]}>
            {new Date(date).toLocaleDateString(
              localization.locale,
              localization.dateFormat
            )}
          </Text>
          {groupedEvents[date].map((event) => (
            <View
              key={event.id}
              onTouchEnd={() => onEventPress?.(event)}
            >
              {renderItem ? renderItem(event) : defaultRenderItem(event)}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eventList: {
    flex: 1,
    padding: 16,
  },
  rtlContainer: {
    alignItems: 'flex-end',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  rtlDateHeader: {
    alignSelf: 'flex-end',
  },
  eventContainer: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default EventList;
