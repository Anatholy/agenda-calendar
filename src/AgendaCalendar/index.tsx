import React, { useEffect } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import {AgendaCalendarProps, Event, LocalizationSettings} from '../';
import Calendar from '../Calendar';
import EventList from '../EventList';

const DEFAULT_LOCALIZATION: LocalizationSettings = {
  locale: 'en-US',
  weekDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  dateFormat: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  timeFormat: {
    hour: '2-digit',
    minute: '2-digit'
  }
};

function AgendaCalendar<T extends Event>(props: AgendaCalendarProps<T>) {
  const {
    events = [],
    onEventPress,
    renderItem,
    style,
    isRTL = false,
    localization = DEFAULT_LOCALIZATION,
  } = props;

  useEffect(() => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);


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
