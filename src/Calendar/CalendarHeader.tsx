import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ViewMode } from './types';
import { LocalizationSettings } from '../types';

interface CalendarHeaderProps {
  selectedDate: Date;
  mode: ViewMode;
  onModeToggle: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isRTL?: boolean;
  localization?: LocalizationSettings;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  mode,
  onModeToggle,
  onNavigate,
  isRTL = false,
  localization,
}) => {
  const formatHeaderDate = () => {
    const monthName = selectedDate.toLocaleString(localization?.locale || 'default', { month: 'long' });
    const year = selectedDate.getFullYear();
    
    if (mode === 'week') {
      const weekStart = new Date(selectedDate);
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const formatDate = (date: Date) => date.getDate();
      return `${formatDate(weekStart)} - ${formatDate(weekEnd)} ${monthName} ${year}`;
    }
    
    return `${monthName} ${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.navigationContainer, isRTL && styles.containerRTL]}>
          <TouchableOpacity
            onPress={() => onNavigate('prev')}
            style={styles.navigationButton}
          >
            <Text style={styles.navigationText}>{isRTL ? '›' : '‹'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onModeToggle} 
            style={[styles.titleContainer, isRTL && styles.containerRTL]}>
            <Text style={styles.title}>{formatHeaderDate()}</Text>
            <Text style={styles.modeIndicator}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigate('next')}
            style={styles.navigationButton}
          >
            <Text style={styles.navigationText}>{isRTL ? '‹' : '›'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationButton: {
    padding: 10,
    borderRadius: 8,
  },
  navigationText: {
    fontSize: 24,
    color: '#666666',
    fontWeight: '300',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  modeIndicator: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
});
