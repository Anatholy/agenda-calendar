import {Event, LocalizationSettings} from "../types";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import React, {useMemo} from "react";

import {ViewMode} from "./types";

interface CalendarViewProps<T extends Event> {
  mode: ViewMode;
  isRTL?: boolean;
  localization?: LocalizationSettings;
  renderCell?: (date: Date, events: Event[]) => React.ReactNode;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  month: number;
  year: number;
  week: number;
  events?: T[];
}

export function CalendarView<T extends Event>(props: CalendarViewProps<T>) {
  const { 
    isRTL, 
    localization, 
    renderCell: customRenderCell, 
    selectedDate, 
    onDateChange, 
    events = [],
    month,
    year,
    mode
  } = props;

  const renderCell = customRenderCell || defaultRenderCell;

  const weekDays = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return isRTL ? days.reverse() : days;
  }, [isRTL]);

  const monthDates = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const calendar: Date[][] = [];
    let week: Date[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      week.push(new Date(year, month - 1, -startingDay + i + 1));
    }
    
    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(new Date(year, month - 1, day));
      
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    // Fill in any remaining slots
    while (week.length < 7 && week.length > 0) {
      const nextDay = new Date(year, month - 1, daysInMonth + week.length - startingDay + 1);
      week.push(nextDay);
    }
    
    if (week.length > 0) {
      calendar.push(week);
    }
    
    return calendar;
  }, [year, month]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.monthContainer}>
        {monthDates.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dateIndex) => (
              <TouchableOpacity
                key={dateIndex}
                onPress={() => onDateChange?.(date)}
                style={[
                  styles.dateCell,
                  date.getMonth() !== month - 1 && styles.outOfMonthDate,
                  selectedDate?.getDate() === date.getDate() &&
                  selectedDate?.getMonth() === date.getMonth() &&
                  styles.selectedDate
                ]}
              >
                {renderCell(date, getEventsForDate(date), isRTL || false)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function defaultRenderCell(date: Date, events: Event[], isRTL: boolean) {
  return (
    <View style={styles.cellContent}>
      <Text style={[
        styles.dateCellText,
        events.length > 0 && styles.dateWithEvents
      ]}>
        {date.getDate()}
      </Text>
      {events.length > 0 && (
        <View style={styles.eventIndicator} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    width: '100%',
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  monthContainer: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
  },
  dateCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 2,
    minWidth: 40,
  },
  cellContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCellText: {
    fontSize: 14,
    color: '#333',
  },
  outOfMonthDate: {
    backgroundColor: '#f8f8f8',
  },
  selectedDate: {
    backgroundColor: '#e6f3ff',
  },
  dateWithEvents: {
    fontWeight: '600',
    color: '#1a73e8',
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a73e8',
    marginTop: 2,
  },
});
