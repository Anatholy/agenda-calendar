import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AgendaCalendarProps, Event } from '../types';
import { LocalizationSettings } from '../types';

type ViewMode = 'month' | 'week';
type SlotView = { month: number, year: number, week: number };

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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <View style={styles.calendar}>
      <Text style={styles.calendarText}>Calendar Component Placeholder 3</Text>
      {slotViews.map((view, index) => (
        <CalendarView key={`${view.month}-${view.year}-${view.week}`} {...view} 
        mode={viewMode}
        events={events} 
        isRTL={isRTL} 
        localization={localization} 
        renderCell={renderCell} 
        selectedDate={selectedDate} 
        onDateChange={handleDateChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    height: 300,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calendarText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Calendar;

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

function CalendarView<T extends Event>(props: CalendarViewProps<T>) {
  const { isRTL, localization, renderCell: customRenderCell, selectedDate, onDateChange, events } = props;

  const renderCell = customRenderCell || defaultRenderCell;

  return (
    <View style={styles.calendar}>
      <Text style={styles.calendarText}>{props.mode} {props.month} {props.year} {props.week}</Text>
    </View>
  );
}


function defaultRenderCell(date: Date, events: Event[], isRTL: boolean) {
  const styles = StyleSheet.create({
    cell: {
      width: 30,
      height: 30,
    },
    cellText: {
      fontSize: 12,
      color: '#666',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
  });
  return (
  <View style={styles.cell}>
    { /* TODO: Render week days */}
    { /* TODO: Render month dates table */}
  </View>
  );
}


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