import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import AgendaCalendar, { Event, LocalizationSettings } from '../../src';

type EventType = 'lesson' | 'test' | 'innerExam' | 'other';

interface ExtendedEvent extends Event {
  startTime: string;
  endTime: string;
  location: string;
  type: EventType;
}

const LOCALIZATIONS: Record<string, LocalizationSettings> = {
  'English (US)': {
    locale: 'en-US',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    timeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  },
  'Hebrew': {
    locale: 'he-IL',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    timeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  },
  'Arabic': {
    locale: 'ar-SA',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    timeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  },
  'Russian': {
    locale: 'ru-RU',
    dateFormat: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    timeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  }
};

const EVENT_TYPE_CONFIG: Record<EventType, { color: string; icon: string }> = {
  lesson: {
    color: '#4CAF50',
    icon: '📚'
  },
  test: {
    color: '#F44336',
    icon: '📝'
  },
  innerExam: {
    color: '#9C27B0',
    icon: '📋'
  },
  other: {
    color: '#2196F3',
    icon: '📌'
  }
};

export default function App() {
  const [selectedLocale, setSelectedLocale] = useState<string>('English (US)');
  
  const events: ExtendedEvent[] = [
    {
      id: '1',
      title: 'Mathematics Lecture',
      date: new Date('2024-03-20'),
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 101',
      type: 'lesson'
    },
    {
      id: '2',
      title: 'Physics Test',
      date: new Date('2024-03-20'),
      startTime: '11:00',
      endTime: '12:30',
      location: 'Main Hall',
      type: 'test'
    },
    {
      id: '3',
      title: 'Final Examination',
      date: new Date('2024-03-20'),
      startTime: '14:00',
      endTime: '16:00',
      location: 'Examination Center',
      type: 'innerExam'
    },
    {
      id: '4',
      title: 'Study Group Meeting',
      date: new Date('2024-03-21'),
      startTime: '10:00',
      endTime: '11:30',
      location: 'Library',
      type: 'other'
    },
    {
      id: '5',
      title: 'Chemistry Lab',
      date: new Date('2024-03-22'),
      startTime: '13:00',
      endTime: '14:30',
      location: 'Lab 3',
      type: 'lesson'
    },
    {
      id: '6',
      title: 'Biology Quiz',
      date: new Date('2024-03-22'),
      startTime: '15:00',
      endTime: '16:00',
      location: 'Room 205',
      type: 'test'
    }
  ];

  const handleEventPress = (event: ExtendedEvent) => {
    console.log('Event pressed:', event);
  };

  const isBorderRTL = (isRTL: boolean) => {
    if (Platform.OS === 'android') {
      return !isRTL;
    }
    return isRTL;
  };

  const renderEventItem = (event: ExtendedEvent) => (
    <View style={[
      styles.eventItem, 
      { 
        borderLeftWidth: isBorderRTL(isRTL) ? 0 : 4,
        borderRightWidth: isBorderRTL(isRTL) ? 4: 0,
        borderLeftColor: EVENT_TYPE_CONFIG[event.type].color,
        borderRightColor: EVENT_TYPE_CONFIG[event.type].color,
      }
    ]}>
      <View style={[styles.eventHeader, isRTL && styles.containerRTL]}>
        <View style={[styles.titleContainer, isRTL && styles.containerRTL]}>
          <Text style={[styles.icon, styles.avatar, isRTL && styles.iconRTL]}>
            {EVENT_TYPE_CONFIG[event.type].icon}
          </Text>
          <Text style={[styles.eventTitle, isRTL && styles.rtlText]}>
            {event.title}
          </Text>
        </View>
        <Text style={[styles.eventTime, isRTL && styles.rtlText]}>
          {event.startTime} - {event.endTime}
        </Text>
      </View>
      <View style={[styles.eventDetails,isRTL && styles.containerRTL]}>
          <Text style={[styles.icon, isRTL && styles.iconRTL]}>
            📍
          </Text>
          <Text style={[styles.eventLocation, isRTL && styles.rtlText]}>
            {event.location}
          </Text>
      </View>
    </View>
  );

  const isRTL = ['Hebrew', 'Arabic'].includes(selectedLocale);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.localeSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(LOCALIZATIONS).map((localeName) => (
              <TouchableOpacity
                key={localeName}
                style={[
                  styles.localeButton,
                  selectedLocale === localeName && styles.localeButtonSelected
                ]}
                onPress={() => setSelectedLocale(localeName)}
              >
                <Text style={[
                  styles.localeButtonText,
                  selectedLocale === localeName && styles.localeButtonTextSelected
                ]}>
                  {localeName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <AgendaCalendar<ExtendedEvent>
          events={events}
          onEventPress={handleEventPress}
          renderItem={renderEventItem}
          isRTL={isRTL}
          localization={LOCALIZATIONS[selectedLocale]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  localeSelector: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  localeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  localeButtonSelected: {
    backgroundColor: '#2196F3',
  },
  localeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  localeButtonTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  eventItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    fontSize: 24,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  iconRTL: {
    marginRight: 0,
    marginLeft: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventDetails: {
    marginTop: 4,
    flexDirection: 'row',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
}); 