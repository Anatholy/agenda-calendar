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

    // Add debug log when component receives props
    console.log('CalendarSwiper props mode:', mode);

    // Create a ref to track the current mode
    const modeRef = React.useRef(mode);
    
    // Keep the ref updated with the latest mode
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({window}) => {
            setDimensions(window);
        });

        return () => subscription.remove();
    }, []);

    const [calendars, setCalendars] = useState([] as Week[]);

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

    useEffect(() => {
        console.log('getSlotViews called with mode:', mode);
        const c = getSlotViews(selectedDate, mode);
        setCalendars(c);
        onMonthChange(c[1]);
    }, [mode, selectedDate]);

    useEffect(() => {
        if (calendars.length > 0) {
            onMonthChange(calendars[1]); // Always notify about the middle (current) calendar
        }
    }, [calendars, onMonthChange]);

    const handleNavigate = useCallback((direction: 'prev' | 'next') => {
        // Use modeRef.current to ensure we have the latest mode value
        const currentMode = modeRef.current;
        console.log('handleNavigate called with mode:', currentMode);
        
        setCalendars(currentCalendars => {
            if (direction === 'next') {
                const newNext = getNextMonth(currentCalendars[2], currentMode);
                console.log('getNextMonth called with:', {current: currentCalendars[2], mode: currentMode});
                console.log('getNextMonth result:', newNext);
                return [currentCalendars[1], currentCalendars[2], newNext];
            } else {
                const newPrev = getPrevMonth(currentCalendars[0], currentMode);
                console.log('getPrevMonth called with:', {current: currentCalendars[0], mode: currentMode});
                console.log('getPrevMonth result:', newPrev);
                return [newPrev, currentCalendars[0], currentCalendars[1]];
            }
        });
    }, []); // Remove mode from dependencies since we're using ref

    // Add effect to reset position when mode changes
    useEffect(() => {
        console.log('mode changed', mode);
        position.setValue(0);
    }, [mode]);

    // Add animated value for height
    const heightAnim = React.useRef(new Animated.Value(mode === 'week' ? 115 : 380)).current;

    // Add animation progress value (0 = week mode, 1 = month mode)
    const modeProgress = React.useRef(new Animated.Value(mode === 'week' ? 0 : 1)).current;

    // Update both height and mode progress animations when mode changes
    useEffect(() => {
        Animated.parallel([
            Animated.timing(heightAnim, {
                toValue: mode === 'week' ? 115 : 380,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(modeProgress, {
                toValue: mode === 'week' ? 0 : 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
        
        position.setValue(0);
    }, [mode, heightAnim, modeProgress]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    width: dimensions.width,
                    height: heightAnim,
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
                            modeProgress={modeProgress}
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
        overflow: 'hidden',
        position: 'relative',
        // Remove fixed height from here since we're animating it
    },
});


function getCurrentMonth(selectedDate: Date): Week {
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
    console.log('getSlotViews', current, mode);
    const next = getNextMonth(current, mode);
    return [prev, current, next];
}

interface Week extends Month { week: number }
function getNextMonth(current: Week, mode: ViewMode) : Week {
    console.log('getNextMonth input:', {current, mode});
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

    // Get the first day of the week containing the first day of month
    const firstWeekStart = new Date(firstDayOfMonth);
    while (firstWeekStart.getDay() !== 0) {
        firstWeekStart.setDate(firstWeekStart.getDate() - 1);
    }

    // Get the start of the week containing our target date
    const targetWeekStart = new Date(targetDate);
    while (targetWeekStart.getDay() !== 0) {
        targetWeekStart.setDate(targetWeekStart.getDate() - 1);
    }

    // Calculate week number (0-based)
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weekNumber = Math.floor(
        (targetWeekStart.getTime() - firstWeekStart.getTime()) / millisecondsPerWeek
    );

    return {
        week: weekNumber,
        firstInTheWeek: targetWeekStart
    };
}

function addWeeks(firstInTheWeek: Date, number: number): Date {
    return new Date(
        firstInTheWeek.getFullYear(),
        firstInTheWeek.getMonth(),
        firstInTheWeek.getDate() + number * 7
    );
}
