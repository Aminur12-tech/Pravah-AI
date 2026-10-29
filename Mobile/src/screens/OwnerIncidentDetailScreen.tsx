
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

type Props = {
  onBack: () => void;
  onAssignResources: () => void;
};

type Tab = "Overview" | "AI Analysis" | "Related";

export default function OwnerIncidentDetailScreen({
  onBack,
  onAssignResources,
}: Props) {
  const [tab, setTab] = useState<Tab>("Overview");

  const assignResources = () => {
    Alert.alert(
      "Assign Resources",
      "This demo can show the assignment workflow, but it does not dispatch real resources.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: onAssignResources },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <View style={styles.hero}>
        <View style={styles.statusRow}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incident Details</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.idRow}>
          <Text style={styles.reportId}>#PRAV-001</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>In Progress</Text>
          </View>
        </View>

        <Text style={styles.incidentTitle}>
          Water entering homes near the river
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.category}>● Flood</Text>
          <Text style={styles.metaText}>•  High</Text>
          <Text style={styles.metaText}>•  2h ago</Text>
        </View>

        <View style={styles.tabs}>
          {(["Overview", "AI Analysis", "Related"] as Tab[]).map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tab, tab === item && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === item && styles.activeTabText]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Overview" && (
          <>
            <View style={styles.mapPreview}>
              <View style={styles.parkOne} />
              <View style={styles.parkTwo} />
              <View style={styles.roadOne} />
              <View style={styles.roadTwo} />
              <View style={styles.river} />
              <View style={styles.mapPin}>
                <Text style={styles.pinText}>●</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>⌖</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationTitle}>River location, Guwahati</Text>
                <Text style={styles.locationCoords}>26.1445, 91.7362</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Impact</Text>
            <View style={styles.impactGrid}>
              <ImpactCard label="People affected" value="12" />
              <ImpactCard label="Injuries" value="0" />
            </View>

            <Text style={styles.sectionTitle}>Resource Gap</Text>
            <View style={styles.resourceCard}>
              <ResourceGap label="Drinking water kits" value="40 missing" color="#E65C58" />
              <ResourceGap label="Blankets" value="32 missing" color="#E99B38" />
              <ResourceGap label="First-aid kits" value="0 missing" color="#16996F" />
            </View>
          </>
        )}

        {tab === "AI Analysis" && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>AI Risk Assessment</Text>
            <View style={styles.riskBadge}>
              <Text style={styles.riskBadgeText}>HIGH RISK</Text>
            </View>
            <Text style={styles.bodyText}>
              Demo assessment: rising water levels may affect nearby households.
              Confirm conditions with local responders before taking action.
            </Text>
            <Text style={styles.smallHeading}>Recommended Actions</Text>
            <Text style={styles.bodyText}>• Verify the affected area</Text>
            <Text style={styles.bodyText}>• Prioritize vulnerable residents</Text>
            <Text style={styles.bodyText}>• Coordinate water and rescue supplies</Text>
          </View>
        )}

        {tab === "Related" && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Related Reports (2)</Text>
            <RelatedRow id="PRAV-005" title="Water logging near Main Road" />
            <View style={styles.separator} />
            <RelatedRow id="PRAV-006" title="Blocked drainage in nearby area" />
          </View>
        )}

        <TouchableOpacity
          style={styles.assignButton}
          onPress={assignResources}
          activeOpacity={0.85}
        >
          <Text style={styles.assignButtonText}>Assign Resources</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Sample incident details for demonstration only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ImpactCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.impactCard}>
      <Text style={styles.impactLabel}>{label}</Text>
      <Text style={styles.impactValue}>{value}</Text>
    </View>
  );
}

function ResourceGap({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.resourceRow}>
      <Text style={styles.resourceBullet}>◉</Text>
      <Text style={styles.resourceLabel}>{label}</Text>
      <Text style={[styles.resourceValue, { color }]}>{value}</Text>
    </View>
  );
}

function RelatedRow({ id, title }: { id: string; title: string }) {
  return (
    <View style={styles.relatedRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.relatedTitle}>{title}</Text>
        <Text style={styles.relatedId}>{id}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F8F7" },
  hero: {
    backgroundColor: "#064D48",
    paddingHorizontal: 17,
    paddingBottom: 12,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  statusRow: {
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  statusIcons: { color: "#FFFFFF", fontSize: 10 },
  header: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 30 },
  backArrow: { fontSize: 30, color: "#FFFFFF" },
  headerTitle: { fontSize: 16, color: "#FFFFFF", fontWeight: "800" },
  headerSpacer: { width: 30 },
  content: { paddingHorizontal: 15, paddingTop: 13, paddingBottom: 25 },
  idRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportId: { fontSize: 10, color: "#68817A", fontWeight: "700" },
  statusBadge: { backgroundColor: "#DFF5EB", padding: 6, borderRadius: 8 },
  statusBadgeText: { fontSize: 9, color: "#118360", fontWeight: "800" },
  incidentTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#214B43",
    fontWeight: "800",
    marginTop: 10,
  },
  metaRow: { flexDirection: "row", gap: 9, marginTop: 8, marginBottom: 14 },
  category: { color: "#1688B8", fontSize: 10, fontWeight: "700" },
  metaText: { color: "#82948E", fontSize: 10 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#DCEAE5",
    marginBottom: 12,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 11 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#087C68" },
  tabText: { color: "#7A918B", fontSize: 10, fontWeight: "700" },
  activeTabText: { color: "#087C68" },
  mapPreview: {
    height: 100,
    borderRadius: 11,
    overflow: "hidden",
    backgroundColor: "#E5F0D9",
    borderWidth: 1,
    borderColor: "#D4E5D4",
    justifyContent: "center",
    alignItems: "center",
  },
  parkOne: {
    position: "absolute",
    width: 90,
    height: 40,
    top: 5,
    left: 10,
    borderRadius: 20,
    backgroundColor: "#C6E2B7",
  },
  parkTwo: {
    position: "absolute",
    width: 100,
    height: 40,
    bottom: 4,
    right: 8,
    borderRadius: 20,
    backgroundColor: "#B9DDAA",
  },
  roadOne: {
    position: "absolute",
    height: 8,
    width: "120%",
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-17deg" }],
  },
  roadTwo: {
    position: "absolute",
    width: 8,
    height: 150,
    backgroundColor: "#FFFFFF",
    left: "40%",
    transform: [{ rotate: "28deg" }],
  },
  river: {
    position: "absolute",
    width: "120%",
    height: 15,
    backgroundColor: "#B4E3F2",
    top: 20,
    transform: [{ rotate: "8deg" }],
  },
  mapPin: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#1688F8",
    borderColor: "#FFFFFF",
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  pinText: { fontSize: 6, color: "#FFFFFF" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    gap: 8,
  },
  locationPin: { fontSize: 20, color: "#087C68" },
  locationTitle: { fontSize: 10, color: "#31534D", fontWeight: "800" },
  locationCoords: { fontSize: 9, color: "#81938F", marginTop: 3 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#244D45",
    marginTop: 8,
    marginBottom: 9,
  },
  impactGrid: { flexDirection: "row", gap: 10, marginBottom: 13 },
  impactCard: {
    flex: 1,
    borderRadius: 11,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
  },
  impactLabel: { fontSize: 9, color: "#728A83" },
  impactValue: { fontSize: 19, fontWeight: "800", color: "#254C44", marginTop: 5 },
  resourceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E0ECE7",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
    gap: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  resourceBullet: { fontSize: 10, color: "#087C68" },
  resourceLabel: { flex: 1, fontSize: 10, color: "#42635C" },
  resourceValue: { fontSize: 9, fontWeight: "800" },
  assignButton: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#087C68",
    alignItems: "center",
    justifyContent: "center",
  },
  assignButtonText: { fontSize: 12, fontWeight: "800", color: "#FFFFFF" },
  disclaimer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 9,
    color: "#81938F",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
  },
  riskBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF0EF",
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 8,
    marginVertical: 10,
  },
  riskBadgeText: { color: "#D74747", fontSize: 10, fontWeight: "800" },
  bodyText: { fontSize: 11, lineHeight: 17, color: "#42635C", marginBottom: 6 },
  smallHeading: { fontSize: 11, fontWeight: "800", color: "#244D45", marginTop: 12, marginBottom: 8 },
  separator: { height: 1, backgroundColor: "#EDF3F0" },
  relatedRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  relatedTitle: { fontSize: 11, fontWeight: "700", color: "#31534D" },
  relatedId: { fontSize: 9, color: "#81938F", marginTop: 4 },
  chevron: { fontSize: 21, color: "#829A95" },
});
