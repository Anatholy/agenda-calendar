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
  theWeek: {
    month: number;
    year: number;
    week: number;
  },
  events?: T[];
  onNavigate?: (direction: 'prev' | 'next') => void;
  style?: any;
  modeProgress: Animated.Value;
}

export function CalendarView<T extends Event>({ modeProgress, ...props }: CalendarViewProps<T>) {
  const {
    isRTL,
    localization,
    renderCell: customRenderCell,
    selectedDate,
    onDateChange,
    events = [],
    theWeek,
    mode,
    style,
  } = props;

  const heightAnim = React.useRef(new Animated.Value(mode === 'week' ? 115 : 380)).current;

  React.useEffect(() => {
    Animated.spring(heightAnim, {
      toValue: mode === 'week' ? 115 : 380,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const renderCell = customRenderCell || defaultRenderCell;

  const calendarDates = useMemo(() => {

    const firstDay = new Date(theWeek.year, theWeek.month - 1, 1);
    const lastDay = new Date(theWeek.year, theWeek.month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar: Date[][] = [];
    let weekDates: Date[] = [];

    // Fill empty cells at start with previous month dates
    for (let i = 0; i < startingDay; i++) {
      weekDates.push(new Date(theWeek.year, theWeek.month - 1, -startingDay + i + 1));
    }

    // Fill current month dates
    for (let day = 1; day <= daysInMonth; day++) {
      weekDates.push(new Date(theWeek.year, theWeek.month - 1, day));

      if (weekDates.length === 7) {
        calendar.push(weekDates);
        weekDates = [];
      }
    }

    // Fill empty cells at end with next month dates
    let nextMonthDay = 1;
    while (weekDates.length < 7 && weekDates.length > 0) {
      const nextDay = new Date(theWeek.year, theWeek.month, nextMonthDay++);
      weekDates.push(nextDay);
    }

    if (weekDates.length > 0) {
      calendar.push(weekDates);
    }

    return calendar;

  }, [theWeek, mode]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  // Calculate the target Y position for the current week
  const selectedWeekIndex = calendarDates.findIndex(week => 
    week.some(date => 
      selectedDate && 
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  ) || 0;
  const weekOffset = selectedWeekIndex * 40; // Assuming each week row is 40 pixels high

  // Interpolate Y position based on mode progress
  const translateY = modeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-weekOffset, 0] // In week mode, shift up to show selected week
  });

  return (
    <View style={style}>
      <View style={[styles.weekDaysContainer, isRTL && styles.containerRTL]}>
        {(localization?.weekDayNames || []).map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}{theWeek.week}</Text>
          </View>
        ))}
      </View>

      <View style={[
        styles.monthContainer,
        mode === 'week' && styles.weekModeContainer,
      ]}>
        <Animated.View
          style={{
            transform: [{translateY}]
          }}
        >
          {calendarDates.map((weekRow, weekIndex) => (
            <View
              key={weekIndex}
              style={[
                styles.weekRow,
                isRTL && styles.containerRTL,
                mode === 'week' && {
                  transform: [{ translateY: -(theWeek.week - 1) * 50 }] // 50 is the weekRow height
                }
              ]}
            >
              {weekRow.map((date, dateIndex) => (
                <TouchableOpacity
                  key={dateIndex}
                  onPress={() => onDateChange?.(date)}
                  style={[
                    styles.dateCell,
                    date.getMonth() !== theWeek.month - 1 && styles.outOfMonthDate,
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
        </Animated.View>
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
    flexDirection: 'column',
    flex: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    flexDirection: 'column',
    width: '100%',
  },
  outOfMonthDate: {
    backgroundColor: '#f8f8f8',
  },
  selectedDate: {
    backgroundColor: '#e6f3ff',
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
    flexShrink: 0,
    height: 30,
    marginBottom: 4,
    paddingBottom: 4,
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 50,
    width: '100%',
  },
  weekModeContainer: {
    overflow: 'hidden', // Hide other weeks in week mode
  },
});
