import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ViewMode} from './types';
import {LocalizationSettings} from '../types';
import {Month} from "./index";

interface CalendarHeaderProps {
    selectedDate: Date,
    mode: ViewMode,
    onModeToggle: () => void,
    onNavigate: (direction: 'prev' | 'next') => void,
    isRTL: boolean,
    localization: LocalizationSettings,
    month: Month,
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
                                                                  selectedDate,
                                                                  mode,
                                                                  onModeToggle,
                                                                  onNavigate,
                                                                  isRTL = false,
                                                                  localization,
                                                                  month
                                                              }) => {
  const [monthName, setMonthName] = React.useState('');

  useEffect(() => {
    const m = localization?.monthNames[month.month - 1];
    setMonthName(`${m} ${month.year}`);
  }, [month, localization]);

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
                        <Text style={styles.title}>{monthName}</Text>
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
