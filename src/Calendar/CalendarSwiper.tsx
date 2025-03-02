import {SlotView} from "./types";
import React from "react";
import {View, StyleSheet} from "react-native";

export function CalendarSwiper(props: {
    slotViews: SlotView[],
    callbackfn: (view: SlotView, index: number) => React.JSX.Element
}) {
    return <View style={styles.container}>
        {props.slotViews.map(props.callbackfn)}
    </View>;
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});
