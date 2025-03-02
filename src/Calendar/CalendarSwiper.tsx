import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions, GestureResponderEvent, PanResponderGestureState, ScaledSize } from 'react-native';
import { CalendarView } from './CalendarView';
import { Event, LocalizationSettings } from '../types';
import { ViewMode } from './types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

interface CalendarSwiperProps<T extends Event> {
  mode: ViewMode;
  isRTL?: boolean;
  localization?: LocalizationSettings;
  renderCell?: (date: Date, events: Event[]) => React.ReactNode;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: T[];
  initialMonth?: number;
  initialYear?: number;
  initialWeek?: number;
}

export function CalendarSwiper<T extends Event>(props: CalendarSwiperProps<T>) {
  const {
    initialMonth = new Date().getMonth() + 1,
    initialYear = new Date().getFullYear(),
    initialWeek = 1,
  } = props;

  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  const [calendars, setCalendars] = useState(() => {
    const current = { month: initialMonth, year: initialYear, week: initialWeek };
    const prev = getPrevMonth(current.month, current.year);
    const next = getNextMonth(current.month, current.year);
    return [prev, current, next];
  });

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
    const { dx, vx } = gestureState;
    
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

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    setCalendars(currentCalendars => {
      if (direction === 'next') {
        const newNext = getNextMonth(currentCalendars[2].month, currentCalendars[2].year);
        return [currentCalendars[1], currentCalendars[2], newNext];
      } else {
        const newPrev = getPrevMonth(currentCalendars[0].month, currentCalendars[0].year);
        return [newPrev, currentCalendars[0], currentCalendars[1]];
      }
    });
  }, []);

  return (
    <View style={[styles.container, { width: dimensions.width }]} {...panResponder.panHandlers}>
      <Animated.View 
        style={[
          styles.calendarRow,
          {
            width: dimensions.width * 3,
            left: -dimensions.width,
            transform: [{ translateX: position }]
          }
        ]}
      >
        {calendars.map((calendar, index) => (
          <CalendarView
            key={`${calendar.month}-${calendar.year}`}
            {...props}
            month={calendar.month}
            year={calendar.year}
            week={calendar.week}
            style={[styles.calendar, { width: dimensions.width }]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

function getNextMonth(month: number, year: number) {
  if (month === 12) {
    return { month: 1, year: year + 1, week: 1 };
  }
  return { month: month + 1, year, week: 1 };
}

function getPrevMonth(month: number, year: number) {
  if (month === 1) {
    return { month: 12, year: year - 1, week: 1 };
  }
  return { month: month - 1, year, week: 1 };
}

const styles = StyleSheet.create({
  container: {
    height: 380,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  calendar: {
    height: '100%',
    position: 'relative',
  },
  calendarRow: {
    flexDirection: 'row',
    position: 'absolute',
    height: '100%',
  },
});
