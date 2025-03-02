import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export interface AgendaCalendarProps {
  events?: Array<{
    id: string;
    title: string;
    date: Date;
  }>;
  onEventPress?: (event: { id: string; title: string; date: Date }) => void;
}

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ 
  events = [], 
  onEventPress 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda Calendar</Text>
      {events.map((event) => (
        <View 
          key={event.id} 
          style={styles.eventContainer}
          onTouchEnd={() => onEventPress?.(event)}
        >
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>
            {event.date.toLocaleDateString()}
          </Text>
        </View>
      ))}
    </View>
  );
};

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