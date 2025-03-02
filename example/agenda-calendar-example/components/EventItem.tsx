import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { EventType, ExtendedEvent } from '../types/types';


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


const isBorderRTL = (isRTL: boolean) => {
    // if (Platform.OS === 'android') {
    //     return !isRTL;
    // }
    return isRTL;
};

export const EventItem  = ({event, isRTL}:{event: ExtendedEvent, isRTL: boolean}) => {

    return (
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
}



const styles = StyleSheet.create({
    avatar: {
        fontSize: 24,
    },
    containerRTL: {
        flexDirection: 'row-reverse',
    },
    eventDetails: {
        flexDirection: 'row',
        marginTop: 4,
    },
    eventHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    eventItem: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 3,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    eventLocation: {
        color: '#666',
        fontSize: 14,
    },
    eventTime: {
        color: '#666',
        fontSize: 14,
        marginLeft: 8,
    },
    eventTitle: {
        color: '#1a1a1a',
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    iconRTL: {
        marginLeft: 8,
        marginRight: 0,
    },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    titleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
});
