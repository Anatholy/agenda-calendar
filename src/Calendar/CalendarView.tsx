import {Event, LocalizationSettings} from "../types";
import {StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, PanResponder, PanResponderGestureState} from "react-native";
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
  onNavigate?: (direction: 'prev' | 'next') => void;
  style?: any;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

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
    week,
    mode,
    style,
  } = props;

  const renderCell = customRenderCell || defaultRenderCell;

  const calendarDates = useMemo(() => {

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar: Date[][] = [];
    let week: Date[] = [];

    // Fill empty cells at start with previous month dates
    for (let i = 0; i < startingDay; i++) {
      week.push(new Date(year, month - 1, -startingDay + i + 1));
    }

    // Fill current month dates
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(new Date(year, month - 1, day));

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill empty cells at end with next month dates
    while (week.length < 7 && week.length > 0) {
      const nextDay = new Date(year, month - 1, daysInMonth + week.length - startingDay + 1);
      week.push(nextDay);
    }

    if (week.length > 0) {
      calendar.push(week);
    }

    return calendar;

  }, [year, month, week, mode]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <View
      style={[
        styles.container,
        mode === 'week' && styles.weekContainer,
        style,
      ]}
    >
      <Text>{month}</Text>
      <View style={[styles.weekDaysContainer, isRTL && styles.containerRTL]}>
        {(localization?.weekDayNames || []).map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={[
          styles.monthContainer,
          mode === 'week' && styles.weekContainer
      ]}>
        {calendarDates?.map((weekRow, weekIndex) => (
          <View key={weekIndex} style={[styles.weekRow, isRTL && styles.containerRTL]}>
            {weekRow.map((date, dateIndex) => (
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
  cellContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    height: '100%',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'column',
  },
  containerRTL: {
     flexDirection: 'row-reverse',
  },
  dateCell: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    margin: 2,
    minHeight: 40,
  },
  dateCellText: {
    color: '#333',
    fontSize: 14,
  },
  dateWithEvents: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  eventIndicator: {
    backgroundColor: '#1a73e8',
    borderRadius: 2,
    height: 4,
    marginTop: 2,
    width: 4,
  },
  monthContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  outOfMonthDate: {
    backgroundColor: '#f8f8f8',
  },
  selectedDate: {
    backgroundColor: '#e6f3ff',
  },
  weekContainer: {
    height: 115,
    overflow: 'hidden',
  },
  weekDayCell: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  weekDaysContainer: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 30,
    marginBottom: 4,
    paddingBottom: 4,
    width: '100%',
    flexShrink: 0,
  },
  weekRow: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    minHeight: 50,
  },
});
