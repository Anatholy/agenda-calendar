import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import { AgendaCalendarProps, Event } from '../';
import Calendar from '../Calendar';
import EventList from '../EventList';

function AgendaCalendar<T extends Event>(props: AgendaCalendarProps<T>) {
  const { 
    events = [], 
    onEventPress,
    renderItem,
    style,
    isRTL = false,
    localization
  } = props;
  
  // Set RTL for the entire app context
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
  
  return (
    <View style={[
      styles.container, 
      style,
    ]}>
      <Calendar isRTL={isRTL} localization={localization} />
      <EventList<T>
        events={events}
        onEventPress={onEventPress}
        renderItem={renderItem}
        isRTL={isRTL}
        localization={localization}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AgendaCalendar; 