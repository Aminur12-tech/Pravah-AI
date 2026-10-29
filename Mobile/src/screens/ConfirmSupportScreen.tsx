
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";

type Props = {
  onBackToDashboard: () => void;
};

export default function ConfirmSupportScreen({
  onBackToDashboard,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAF8" />

      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <Text style={styles.statusIcons}>▴  ▰  ●</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.headerTitle}>Confirm Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successCheck}>✓</Text>
        </View>

        <Text style={styles.title}>Your support has been submitted!</Text>

        <Text style={styles.subtitle}>
          The project owner will review your offer. You will be notified once
          it is approved.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Support Summary</Text>

        <View style={styles.summaryCard}>
          <SummaryRow label="Resource Type" value="Drinking Water Kits" />
          <SummaryRow label="Quantity" value="50 packs" />
          <SummaryRow label="Delivery Location" value="Kamalpur" />
          <SummaryRow
            label="Expected Availability"
            value="Today / Within 24 hours"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Your offer is awaiting approval. You can review your contributions
            from the provider dashboard.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onBackToDashboard}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FAF8" },
  statusBar: {
    height: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 17,
  },
  time: { fontSize: 11, color: "#193E38", fontWeight: "800" },
  statusIcons: { fontSize: 10, color: "#193E38" },
  header: {
    height: 45,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E6EFEB",
  },
  backArrow: { fontSize: 28, color: "#244D45", marginRight: 12 },
  headerTitle: { fontSize: 14, color: "#244D45", fontWeight: "800" },
  content: { padding: 17, paddingBottom: 30 },
  successCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#079574",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  successCheck: { color: "#FFFFFF", fontSize: 34, fontWeight: "800" },
  title: {
    color: "#244D45",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 9,
  },
  subtitle: {
    color: "#648078",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 23,
  },
  divider: { height: 1, backgroundColor: "#DFEAE5", marginBottom: 17 },
  sectionTitle: {
    fontSize: 12,
    color: "#31534D",
    fontWeight: "900",
    marginBottom: 10,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  summaryRow: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  summaryLabel: { flex: 1, color: "#648078", fontSize: 10 },
  summaryValue: {
    flex: 1.2,
    color: "#31534D",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "right",
  },
  infoBox: {
    marginTop: 14,
    backgroundColor: "#E9F6F1",
    borderRadius: 9,
    padding: 12,
  },
  infoText: { color: "#42635C", fontSize: 10, lineHeight: 16 },
  primaryButton: {
    height: 45,
    backgroundColor: "#07866D",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
});
