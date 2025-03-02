import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Calendar() {
  return (
    <View style={styles.calendar}>
      <Text style={styles.calendarText}>Calendar Component Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    height: 300,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Calendar; 