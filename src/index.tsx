import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Represents a calendar event
 */
export interface Event {
  id: string;
  title: string;
  date: Date;
}

/**
 * Props for the AgendaCalendar component
 */
export interface AgendaCalendarProps {
  /** Array of events to display */
  events?: Event[];
  /** Callback fired when an event is pressed */
  onEventPress?: (event: Event) => void;
}

/**
 * A calendar component that displays events in an agenda format
 */
function AgendaCalendar(props: AgendaCalendarProps) {
  const { events = [], onEventPress } = props;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda Calendar</Text>
      {events.map((event) => (
        <TouchableOpacity 
          key={event.id} 
          style={styles.eventContainer}
          onPress={() => onEventPress?.(event)}
        >
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>
            {event.date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventContainer: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
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
});

export default AgendaCalendar; 