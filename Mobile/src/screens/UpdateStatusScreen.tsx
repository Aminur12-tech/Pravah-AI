
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";

type Props = {
  onBack: () => void;
  onUpdated: () => void;
};

const statusOptions = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
];

const initialTimeline = [
  { title: "Submitted", time: "2h ago", complete: true },
  { title: "Under Review", time: "2h ago", complete: true },
  { title: "Assigned", time: "1h ago", complete: true },
  { title: "In Progress", time: "Now", complete: false },
  { title: "Resolved", time: "Pending", complete: false },
];

export default function UpdateStatusScreen({ onBack, onUpdated }: Props) {
  const [status, setStatus] = useState("In Progress");
  const [note, setNote] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateStatus = () => {
    if (!status) {
      Alert.alert("Choose a status", "Please select an incident status.");
      return;
    }

    Alert.alert(
      "Update Status",
      `Change incident PRAV-001 to "${status}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert(
              "Status updated",
              "This is a demo. The status and note are not saved to a server.",
              [{ text: "OK", onPress: onUpdated }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Status</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.incidentCard}>
          <Text style={styles.reportId}>Incident #PRAV-001</Text>
          <Text style={styles.incidentName}>💧  Flood</Text>
        </View>

        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.timelineCard}>
          {initialTimeline.map((item, index) => {
            const current = item.title === status;
            const done =
              item.complete ||
              statusOptions.indexOf(item.title) < statusOptions.indexOf(status);

            return (
              <View style={styles.timelineRow} key={item.title}>
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.dot,
                      done && styles.completedDot,
                      current && styles.currentDot,
                    ]}
                  />
                  {index < initialTimeline.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        done && index < statusOptions.indexOf(status) && styles.completedLine,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineInfo}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      current && styles.currentTimelineTitle,
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.timelineTime}>
                    {current ? "Current status" : item.time}
                  </Text>
                </View>

                {current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>NOW</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>New Status</Text>
        <TouchableOpacity
          style={styles.statusSelector}
          onPress={() => setPickerOpen(!pickerOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.statusSelectorText}>{status}</Text>
          <Text style={styles.dropdownArrow}>{pickerOpen ? "⌃" : "⌄"}</Text>
        </TouchableOpacity>

        {pickerOpen && (
          <View style={styles.optionsBox}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.option}
                onPress={() => {
                  setStatus(option);
                  setPickerOpen(false);
                }}
              >
                <Text style={[styles.optionText, status === option && styles.selectedOption]}>
                  {option}
                </Text>
                {status === option && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Add Note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Resources dispatched to location..."
          placeholderTextColor="#90A39D"
          multiline
          textAlignVertical="top"
          maxLength={500}
          style={styles.noteInput}
        />
        <Text style={styles.counter}>{note.length}/500</Text>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateStatus}
          activeOpacity={0.85}
        >
          <Text style={styles.updateButtonText}>Update Status</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Demo only — changes are not persisted.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F8F7" },
  header: {
    backgroundColor: "#064D48",
    paddingHorizontal: 17,
    paddingBottom: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  statusBar: {
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  statusIcons: { color: "#FFFFFF", fontSize: 10 },
  headerRow: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 30 },
  backArrow: { fontSize: 30, color: "#FFFFFF" },
  headerTitle: { fontSize: 16, color: "#FFFFFF", fontWeight: "800" },
  headerSpacer: { width: 30 },
  content: { padding: 15, paddingBottom: 28 },
  incidentCard: {
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    marginBottom: 17,
  },
  reportId: { fontSize: 10, color: "#81938F" },
  incidentName: { fontSize: 12, fontWeight: "800", color: "#31534D", marginTop: 6 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#244D45",
    marginBottom: 9,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0ECE7",
    paddingHorizontal: 13,
    paddingTop: 15,
    paddingBottom: 3,
    marginBottom: 18,
  },
  timelineRow: { flexDirection: "row", minHeight: 49 },
  rail: { width: 22, alignItems: "center", marginRight: 8 },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#B4D2CA",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  completedDot: { backgroundColor: "#087C68", borderColor: "#087C68" },
  currentDot: { backgroundColor: "#D2F1E6", borderColor: "#087C68" },
  line: { flex: 1, width: 2, backgroundColor: "#DDEAE5", marginTop: -1 },
  completedLine: { backgroundColor: "#087C68" },
  timelineInfo: { flex: 1, paddingBottom: 10 },
  timelineTitle: { fontSize: 11, fontWeight: "700", color: "#31534D" },
  currentTimelineTitle: { color: "#087C68", fontWeight: "800" },
  timelineTime: { fontSize: 9, color: "#81938F", marginTop: 4 },
  currentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E1F5ED",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
  },
  currentBadgeText: { fontSize: 8, color: "#087C68", fontWeight: "800" },
  statusSelector: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DCEAE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statusSelectorText: { fontSize: 11, fontWeight: "700", color: "#31534D" },
  dropdownArrow: { fontSize: 17, color: "#62847B" },
  optionsBox: {
    borderWidth: 1,
    borderColor: "#DCEAE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    marginTop: -10,
    marginBottom: 15,
    overflow: "hidden",
  },
  option: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  optionText: { flex: 1, fontSize: 10, color: "#42635C" },
  selectedOption: { color: "#087C68", fontWeight: "800" },
  check: { color: "#087C68", fontWeight: "800" },
  noteInput: {
    minHeight: 105,
    borderWidth: 1,
    borderColor: "#DCEAE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 11,
    fontSize: 11,
    color: "#31534D",
  },
  counter: {
    textAlign: "right",
    color: "#81938F",
    fontSize: 9,
    marginTop: 5,
    marginBottom: 13,
  },
  updateButton: {
    minHeight: 45,
    backgroundColor: "#087C68",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: { fontSize: 12, fontWeight: "800", color: "#FFFFFF" },
  disclaimer: { textAlign: "center", marginTop: 10, color: "#81938F", fontSize: 9 },
});
