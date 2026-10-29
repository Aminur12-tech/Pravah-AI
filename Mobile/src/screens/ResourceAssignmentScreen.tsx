
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
  onApproved: () => void;
};

const initialResources = [
  { id: "water", name: "Drinking water kits", shortage: 40, available: 20 },
  { id: "blankets", name: "Blankets", shortage: 32, available: 50 },
  { id: "firstaid", name: "First-aid kits", shortage: 0, available: 25 },
];

const teams = [
  "Relief Team - North Zone",
  "Relief Team - South Zone",
  "Emergency Response Team",
];

export default function ResourceAssignmentScreen({
  onBack,
  onApproved,
}: Props) {
  const [quantities, setQuantities] = useState<Record<string, string>>({
    water: "20",
    blankets: "50",
    firstaid: "25",
  });
  const [team, setTeam] = useState(teams[0]);
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);

  const approveAssignment = () => {
    const selected = initialResources.filter(
      (resource) => Number(quantities[resource.id] || 0) > 0
    );

    if (selected.length === 0) {
      Alert.alert("Select resources", "Enter a quantity for at least one resource.");
      return;
    }

    Alert.alert(
      "Approve Assignment",
      `Assign ${selected.length} resource type(s) to ${team}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: onApproved },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Resources</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.incidentCard}>
          <Text style={styles.mutedLabel}>Incident #PRAV-001</Text>
          <Text style={styles.incidentTitle}>Flood · High priority</Text>
        </View>

        <Text style={styles.sectionTitle}>Resource Gap</Text>
        <View style={styles.card}>
          {initialResources.map((resource, index) => (
            <View
              key={resource.id}
              style={[
                styles.gapRow,
                index !== initialResources.length - 1 && styles.rowDivider,
              ]}
            >
              <Text style={styles.resourceIcon}>♧</Text>
              <Text style={styles.resourceName}>{resource.name}</Text>
              <Text
                style={[
                  styles.shortage,
                  { color: resource.shortage ? "#E65353" : "#15966B" },
                ]}
              >
                {resource.shortage ? `${resource.shortage} missing` : "0 missing"}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Available Resources</Text>
        <View style={styles.card}>
          {initialResources.map((resource, index) => (
            <View
              key={resource.id}
              style={[
                styles.quantityRow,
                index !== initialResources.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.quantityInfo}>
                <Text style={styles.resourceIcon}>♧</Text>
                <Text style={styles.resourceName}>{resource.name}</Text>
              </View>
              <TextInput
                value={quantities[resource.id]}
                onChangeText={(value) =>
                  setQuantities((previous) => ({
                    ...previous,
                    [resource.id]: value.replace(/[^0-9]/g, ""),
                  }))
                }
                keyboardType="number-pad"
                style={styles.quantityInput}
                maxLength={4}
                accessibilityLabel={`Quantity of ${resource.name}`}
              />
            </View>
          ))}
          <Text style={styles.helperText}>
            Enter the quantity to allocate for each resource.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Assign to</Text>
        <TouchableOpacity
          style={styles.teamSelector}
          onPress={() => setTeamPickerOpen(!teamPickerOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.teamText}>{team}</Text>
          <Text style={styles.dropdownArrow}>
            {teamPickerOpen ? "⌃" : "⌄"}
          </Text>
        </TouchableOpacity>

        {teamPickerOpen && (
          <View style={styles.teamOptions}>
            {teams.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.teamOption}
                onPress={() => {
                  setTeam(item);
                  setTeamPickerOpen(false);
                }}
              >
                <Text style={[styles.teamOptionText, item === team && styles.selectedTeam]}>
                  {item}
                </Text>
                {item === team && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.approveButton}
          onPress={approveAssignment}
          activeOpacity={0.85}
        >
          <Text style={styles.approveButtonText}>Approve Assignment</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Demo only — approving does not dispatch physical supplies.
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
  statusRow: {
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
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0ECE7",
    marginBottom: 18,
  },
  mutedLabel: { fontSize: 10, color: "#81938F" },
  incidentTitle: {
    marginTop: 5,
    fontSize: 12,
    color: "#31534D",
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#244D45",
    marginBottom: 9,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: "#E0ECE7",
    marginBottom: 17,
  },
  gapRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 43,
    gap: 7,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#EDF3F0" },
  resourceIcon: { color: "#3D6C63", fontSize: 15, width: 20 },
  resourceName: { flex: 1, fontSize: 10, color: "#42635C" },
  shortage: { fontSize: 9, fontWeight: "800" },
  quantityRow: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  quantityInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  quantityInput: {
    width: 68,
    height: 34,
    borderWidth: 1,
    borderColor: "#D8E8E2",
    borderRadius: 7,
    paddingHorizontal: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#31534D",
    backgroundColor: "#FAFCFB",
  },
  helperText: { fontSize: 9, color: "#81938F", paddingVertical: 9 },
  teamSelector: {
    minHeight: 43,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 9,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  teamText: { flex: 1, fontSize: 10, color: "#42635C" },
  dropdownArrow: { fontSize: 17, color: "#62847B" },
  teamOptions: {
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    marginTop: -5,
    marginBottom: 13,
    overflow: "hidden",
  },
  teamOption: {
    minHeight: 42,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  teamOptionText: { flex: 1, fontSize: 10, color: "#42635C" },
  selectedTeam: { color: "#087C68", fontWeight: "800" },
  check: { color: "#087C68", fontWeight: "800" },
  approveButton: {
    minHeight: 45,
    backgroundColor: "#087C68",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  approveButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  disclaimer: {
    textAlign: "center",
    marginTop: 10,
    color: "#81938F",
    fontSize: 9,
  },
});
