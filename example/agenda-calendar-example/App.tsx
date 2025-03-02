import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import AgendaCalendar, { Event } from '../../src/index';

export default function App() {
  const events: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date('2024-03-20'),
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date('2024-03-21'),
    },
  ];

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AgendaCalendar 
        events={events}
        onEventPress={handleEventPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 