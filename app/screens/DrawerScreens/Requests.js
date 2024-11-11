import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Table } from "../../components";
import {
  latestRequests,
  userRequestsHistory,
} from "../../../assets/data/lists";

import { useTheme } from "../../../assets/colors/ThemeContext";
export default function Requests() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Table headings={latestRequests.heading} tableTitle={"Latest Requests"} />
      <Table
        headings={userRequestsHistory.heading}
        tableTitle={"Request History"}
        emailColumnIndex={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
