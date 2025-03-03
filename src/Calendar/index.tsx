import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Event, LocalizationSettings} from '../types';
import {ViewMode} from "./types";
import {CalendarHeader} from "./CalendarHeader";
import {CalendarSwiper} from "./CalendarSwiper";

interface CalendarProps<T extends Event> {
  isRTL: boolean;
  localization: LocalizationSettings;
  renderCell?: (date: Date, events: Event[]) => React.ReactNode;
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
  events: T[];
}


export interface Month {
    month: number;
    year: number;
}

function Calendar<T extends Event>(props: CalendarProps<T>) {
  const { isRTL, localization, renderCell, selectedDate, onDateChange, events } = props;

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [month, setMonth] = useState<Month>({ month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setViewMode('week');
    onDateChange?.(date);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    console.log('handleNavigate', direction);
  };

  const handleMonthChange = useCallback((month: Month) => {
    setMonth(month);
  }, []);

  // Add effect to sync current date with month
  useEffect(() => {
    setMonth({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    });
  }, [currentDate]);

  return (
    <View style={styles.calendar}>
      <CalendarHeader
        isRTL={isRTL}
        localization={localization}
        selectedDate={currentDate}
        mode={viewMode}
        month={month}
        onModeToggle={() => setViewMode(x => x === 'month' ? 'week' : 'month')}
        onNavigate={handleNavigate}
      />
      <CalendarSwiper
        mode={viewMode}
        events={events}
        isRTL={isRTL}
        localization={localization}
        renderCell={renderCell}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
});

export default Calendar;
