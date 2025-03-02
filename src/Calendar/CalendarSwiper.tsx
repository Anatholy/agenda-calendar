import {SlotView} from "./types";
import React from "react";
import {View, StyleSheet, Dimensions} from "react-native";

const CALENDAR_HEIGHT = 410; // Match the CalendarView container height
const SCREEN_WIDTH = Dimensions.get('window').width;

export function CalendarSwiper(props: {
    slotViews: SlotView[],
    callbackfn: (view: SlotView, index: number) => React.JSX.Element
}) {
    return (
        <View style={styles.container}>
            <View style={styles.calendarRow}>
                {props.slotViews.map(props.callbackfn)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: CALENDAR_HEIGHT,
        width: SCREEN_WIDTH,
        overflow: 'hidden', // Hide calendars outside the view
    },
    calendarRow: {
        flexDirection: 'row',
        width: SCREEN_WIDTH * 3, // Width for all three calendars
        transform: [{ translateX: -SCREEN_WIDTH }], // Show only middle calendar
    },
});
