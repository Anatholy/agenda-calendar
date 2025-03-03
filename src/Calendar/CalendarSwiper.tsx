import React, {useState, useCallback, useEffect} from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    GestureResponderEvent,
    PanResponderGestureState,
    ScaledSize
} from 'react-native';
import {CalendarView} from './CalendarView';
import {Event, LocalizationSettings} from '../types';
import {ViewMode} from './types';
import {Month} from "./index";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

interface CalendarSwiperProps<T extends Event> {
    mode: ViewMode,
    isRTL: boolean,
    localization?: LocalizationSettings,
    renderCell?: (date: Date, events: Event[]) => React.ReactNode,
    selectedDate: Date,
    onDateChange?: (date: Date) => void,
    events: T[],
    onMonthChange: (month: Month) => void,
}




export function CalendarSwiper<T extends Event>(props: CalendarSwiperProps<T>) {
    const {
        selectedDate,
        mode,
        onMonthChange,
    } = props;

    const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({window}) => {
            setDimensions(window);
        });

        return () => subscription.remove();
    }, []);

    const [calendars, setCalendars] = useState(getSlotViews(selectedDate, mode));

    const position = React.useRef(new Animated.Value(0)).current;
    const [swiping, setSwiping] = React.useState(false);

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => !swiping,
            onPanResponderGrant: () => {
                position.setValue(0);
            },
            onPanResponderMove: (_, gestureState) => {
                position.setValue(gestureState.dx);
            },
            onPanResponderRelease: (_, gestureState) => {
                handleSwipeEnd(gestureState, dimensions.width);
            },
        })
    ).current;

    const handleSwipeEnd = (gestureState: PanResponderGestureState, screenWidth: number) => {
        const {dx, vx} = gestureState;

        if (
            Math.abs(dx) > SWIPE_THRESHOLD ||
            Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD
        ) {
            const direction = dx > 0 ? 'prev' : 'next';
            setSwiping(true);

            Animated.timing(position, {
                toValue: direction === 'prev' ? screenWidth : -screenWidth,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                position.setValue(0);
                setSwiping(false);
                handleNavigate(direction);
            });
        } else {
            Animated.spring(position, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    };

    useEffect(() =>
            setCalendars(getSlotViews(selectedDate, mode)),
        [mode, selectedDate]);

    useEffect(() => {
        if (calendars.length > 0) {
            onMonthChange(calendars[1]); // Always notify about the middle (current) calendar
        }
    }, [calendars, onMonthChange]);

    const handleNavigate = useCallback((direction: 'prev' | 'next') => {
        setCalendars(currentCalendars => {
            if (direction === 'next') {
                const newNext = getNextMonth(currentCalendars[2], mode);
                return [currentCalendars[1], currentCalendars[2], newNext];
            } else {
                const newPrev = getPrevMonth(currentCalendars[0], mode);
                return [newPrev, currentCalendars[0], currentCalendars[1]];
            }
        });
    }, [mode]);

    // Add effect to reset position when mode changes
    useEffect(() => {
        position.setValue(0);
    }, [mode]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: dimensions.width,
                    height: mode === 'week' ? 115 : 380,
                }
            ]}
            {...panResponder.panHandlers}
        >
            <Animated.View
                style={[
                    styles.calendarRow,
                    {
                        width: dimensions.width * 3,
                        left: -dimensions.width,
                        transform: [{translateX: position}]
                    }
                ]}
            >
                {calendars.map((calendar, index) => (
                    <View
                        key={`${calendar.month}-${calendar.year}-${calendar.week}`}
                        style={{width: dimensions.width}}
                    >
                        <CalendarView
                            {...props}
                            theWeek={calendar}
                            style={styles.calendar}
                        />
                    </View>
                ))}
            </Animated.View>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    calendar: {
        flex: 1,
        height: '100%',
        position: 'relative',
    },
    calendarRow: {
        alignItems: 'stretch',
        flexDirection: 'row',
        height: '100%',
        position: 'absolute',
    },
    container: {
        backgroundColor: '#fff',
        height: 380,
        overflow: 'hidden',
        position: 'relative',
    },
});


function getCurrentMonth(selectedDate: Date) : Week {
  const res = getMonthWeekNumber(selectedDate);
  return {
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
    week: res.week,
  };
}

function getSlotViews(selectedDate: Date, mode: "month" | "week") {
  const current: Week = getCurrentMonth(selectedDate);
  const prev = getPrevMonth(current, mode);
  const next = getNextMonth(current, mode);
  return [prev, current, next];
}

interface Week extends Month { week: number }
function getNextMonth(current: Week, mode: ViewMode) : Week {
  if (mode === 'month') {
    if (current.month === 12) {
      return {month: 1, year: current.year + 1, week: -1};
    }
    return {month: current.month + 1, year: current.year, week: -1};
  }
  // For week mode, check if next week is in the next month
  const lastDate = new Date(current.year, current.month, 0);
  const lastWeek = getMonthWeekNumber(lastDate);
  if (current.week < lastWeek.week) {
    return {
      month: current.month,
      year: current.year,
      week: current.week + 1,
    };
  }
  const nextWeekStart = addWeeks(lastWeek.firstInTheWeek, 1);
  const nextWeek = getMonthWeekNumber(nextWeekStart);
  return {
    month: nextWeek.firstInTheWeek.getMonth() + 1,
    year: nextWeek.firstInTheWeek.getFullYear(),
    week: nextWeek.week
  }
}

function getPrevMonth(current: Week, mode: ViewMode) : Week {
  if (mode === 'month') {
    if (current.month === 1) {
      return {month: 12, year: current.year - 1, week: -1};
    }
    return {month: current.month - 1, year: current.year, week: -1};
  }

  if (current.week > 0) {
    return {
      month: current.month,
      year: current.year,
      week: current.week - 1,
    };
  }

  const firstDate = new Date(current.year, current.month - 1, 1);
  const firstWeek = getMonthWeekNumber(firstDate);
  const prevWeekStart = addWeeks(firstWeek.firstInTheWeek, -1);
  const prevWeek = getMonthWeekNumber(prevWeekStart);
  return {
    month: prevWeek.firstInTheWeek.getMonth() + 1,
    year: prevWeek.firstInTheWeek.getFullYear(),
    week: prevWeek.week
  }
}

function getMonthWeekNumber(date: Date): { week: number, firstInTheWeek: Date } {
  // Clone the date to avoid modifying the original
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Get first day of the month
  const firstDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);

  // Find first Sunday before or on the first day of month
  const firstSundayOfCalendar = new Date(firstDayOfMonth);
  while (firstSundayOfCalendar.getDay() !== 0) {
    firstSundayOfCalendar.setDate(firstSundayOfCalendar.getDate() - 1);
  }

  // Find the Sunday that starts the week containing our target date
  const firstDateOfTargetWeek = new Date(targetDate);
  while (firstDateOfTargetWeek.getDay() !== 0) {
    firstDateOfTargetWeek.setDate(firstDateOfTargetWeek.getDate() - 1);
  }

  // Calculate week number by counting Sundays between first Sunday and target week's Sunday
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(
      (firstDateOfTargetWeek.getTime() - firstSundayOfCalendar.getTime()) / millisecondsPerWeek
  );

  return {
    week: weekNumber,
    firstInTheWeek: firstDateOfTargetWeek
  };
}

function addWeeks(firstInTheWeek: Date, number: number): Date {
  return new Date(
      firstInTheWeek.getFullYear(),
      firstInTheWeek.getMonth(),
      firstInTheWeek.getDate() + number * 7
  );
}
