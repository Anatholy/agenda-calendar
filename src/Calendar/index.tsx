import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Event, LocalizationSettings} from '../types';
import {CalendarView} from "./CalendarView";
import {SlotView, ViewMode} from "./types";
import {CalendarHeader} from "./CalendarHeader";
import {CalendarSwiper} from "./CalendarSwiper";

interface CalendarProps<T extends Event> {
  isRTL?: boolean;
  localization?: LocalizationSettings;
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
    const views = getSlotViews(currentDate);
    setSlotViews(views);
  }, [currentDate]);

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
    height: 300,
    justifyContent: 'center',
  },
});

export default Calendar;


function getSlotViews(date: Date) : SlotView[] {
  const views = [];
  const middleMonth = { month: date.getMonth(), year: date.getFullYear(), week: 0 };
  const prevMonth = new Date(middleMonth.year, middleMonth.month - 1, 1);
  const nextMonth = new Date(middleMonth.year, middleMonth.month + 1, 1);

  views.push({ month: prevMonth.getMonth(), year: prevMonth.getFullYear(), week: 0 });
  views.push(middleMonth);
  views.push({ month: nextMonth.getMonth(), year: nextMonth.getFullYear(), week: 0 });

  return views;
}
