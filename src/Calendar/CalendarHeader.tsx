import {View, Text, Pressable, StyleSheet} from "react-native";
import {SlotView, ViewMode} from "./types";

interface CalendarHeaderProps {
    selectedDate: Date;
    mode: ViewMode;
    onModeToggle: () => void;
    onNavigate: (direction: 'next' | 'prev') => void;
}

export function CalendarHeader(props: CalendarHeaderProps) {

    return (
        <View style={styles.container}>
            <Pressable onPress={() => props.onNavigate('prev')}>
                <Text>&lt;</Text>
            </Pressable>
            <Pressable onPress={props.onModeToggle}>
                <Text>{props.selectedDate.getMonth()} {props.selectedDate.getFullYear()}</Text>
            </Pressable>
            <Pressable onPress={() => props.onNavigate('next')}>
                <Text>&gt;</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
