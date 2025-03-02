import {Event, LocalizationSettings} from "../types";
import {StyleSheet, Text, View} from "react-native";
import React from "react";

import {ViewMode} from "./types";

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

export function CalendarView<T extends Event>(props: CalendarViewProps<T>) {
  const { isRTL, localization, renderCell: customRenderCell, selectedDate, onDateChange, events } = props;

  const renderCell = customRenderCell || defaultRenderCell;

  return (
    <View>
      <Text>{props.mode} {props.month} {props.year} {props.week}</Text>
    </View>
  );
}

function defaultRenderCell(date: Date, events: Event[], isRTL: boolean) {
  const styles = StyleSheet.create({
    cell: {
      height: 30,
      width: 30,
    },
  });
  return (
  <View style={styles.cell}>
    { /* TODO: Render week days */}
    { /* TODO: Render month dates table */}
  </View>
  );
}
