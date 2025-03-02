import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import AgendaCalendar, { LocalizationSettings } from '../../src';
import { EventItem } from './components/EventItem';
import { ExtendedEvent } from './types/types';
import { events } from './data/events';

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


export default function App() {
  const [selectedLocale, setSelectedLocale] = useState<string>('English (US)');

  const handleEventPress = (event: ExtendedEvent) => {
    console.log('Event pressed:', event);
  };

  const renderEventItem = (event: ExtendedEvent) => {
    return <EventItem event={event} isRTL={isRTL} />;
  };

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
        
        <AgendaCalendar
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
}); 