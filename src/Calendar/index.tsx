import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Event, LocalizationSettings} from '../types';
import {CalendarView} from "./CalendarView";
import {SlotView, ViewMode} from "./types";
import {CalendarHeader} from "./CalendarHeader";
import {CalendarSwiper} from "./CalendarSwiper";

interface CalendarProps<T extends Event> {
  isRTL: boolean;
  localization: LocalizationSettings;
  renderCell?: (date: Date, events: Event[]) => React.ReactNode;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  events?: T[];
}

function Calendar<T extends Event>(props: CalendarProps<T>) {
  const { isRTL, localization, renderCell, selectedDate, onDateChange, events } = props;

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const [slotViews, setSlotViews] = useState<SlotView[]>([]);

  useEffect(() => {
    const views = getSlotViews(currentDate, viewMode);
    setSlotViews(views);
  }, [currentDate, viewMode]);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    onDateChange?.(date);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    console.log('Navigate', direction);
  };


  return (
    <View style={styles.calendar}>
      <CalendarHeader
          isRTL={isRTL}
          localization={localization}
          selectedDate={currentDate}
          mode={viewMode}
          onModeToggle={() => setViewMode(x => x === 'month' ? 'week' : 'month')}
          onNavigate={handleNavigate}/>
      <CalendarSwiper slotViews={slotViews} callbackfn={(view, index) => (
          <CalendarView key={`${view.month}-${view.year}-${view.week}`} {...view}
                        mode={viewMode}
                        events={events}
                        isRTL={isRTL}
                        localization={localization}
                        renderCell={renderCell}
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
          />
      )}/>
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


function getSlotViews(date: Date, mode: ViewMode) : SlotView[] {
  const views = [];
  const month = date.getMonth();
  const middleMonth = { month: month + 1, year: date.getFullYear(), week: 0 };

  if (mode === 'month') {
      const prevMonth = new Date(middleMonth.year, month - 1, 1);
      const nextMonth = new Date(middleMonth.year, month + 1, 1);

      views.push({ month: prevMonth.getMonth() + 1, year: prevMonth.getFullYear(), week: 0 });
      views.push(middleMonth);
      views.push({ month: nextMonth.getMonth() + 1, year: nextMonth.getFullYear(), week: 0 });
      return views;
  }

  const mid = getMonthWeekNumber(date);
  middleMonth.week = mid.week;
  const prev =
      getMonthWeekNumber(addWeeks(mid.firstInTheWeek, -1));
  const next =
    getMonthWeekNumber(addWeeks(mid.firstInTheWeek, 1));

    views.push({ month: prev.firstInTheWeek.getMonth() + 1, year: prev.firstInTheWeek.getFullYear(), week: prev.week });
    views.push(middleMonth);
    views.push({ month: next.firstInTheWeek.getMonth() + 1, year: next.firstInTheWeek.getFullYear(), week: next.week });

  return views;
}

function addWeeks(firstInTheWeek: Date, number: number) {
    return new Date(firstInTheWeek.getFullYear(), firstInTheWeek.getMonth(), firstInTheWeek.getDate() + number * 7);
}

function getMonthWeekNumber(date: Date): { week: number, firstInTheWeek: Date } {
    const theDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let firstWeekDate = firstDay;
    for (let i = 0; i < 7; i++) {
        if (firstWeekDate.getDay() === i) {
            break;
        }
        firstWeekDate = new Date(firstWeekDate.getFullYear(), firstWeekDate.getMonth(), firstWeekDate.getDate() - 1);
    }
    let week = 0;
    let firstInTheWeek = firstWeekDate;
    while (firstInTheWeek <= lastDay) {
        if (theDate >= firstInTheWeek && theDate <= new Date(firstInTheWeek.getFullYear(), firstInTheWeek.getMonth(), firstInTheWeek.getDate() + 6)) {
            break;
        }
        week++;
        firstInTheWeek = new Date(firstInTheWeek.getFullYear(), firstInTheWeek.getMonth(), firstInTheWeek.getDate() + 7);
    }
    return { week, firstInTheWeek };
}
