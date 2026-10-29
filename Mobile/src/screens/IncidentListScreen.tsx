
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { OwnerBottomNav } from "./OwnerDashboardScreen";

type Props = {
  onBack: () => void;
  onOpenIncident: () => void;
  onDashboard: () => void;
  onResources: () => void;
  onProfile: () => void;
};

type Priority = "All" | "High" | "Medium" | "Low";

const incidents = [
  {
    id: "PRAV-001",
    title: "Water entering homes near the river",
    category: "Flood",
    priority: "High",
    time: "2h ago",
    icon: "💧",
    color: "#1688F8",
  },
  {
    id: "PRAV-002",
    title: "Minor tremors felt in the area",
    category: "Earthquake",
    priority: "Medium",
    time: "5h ago",
    icon: "🌋",
    color: "#F58A43",
  },
  {
    id: "PRAV-003",
    title: "Road blocked by landslide",
    category: "Landslide",
    priority: "High",
    time: "1d ago",
    icon: "⛰️",
    color: "#8B6253",
  },
  {
    id: "PRAV-004",
    title: "Fire in residential area",
    category: "Fire",
    priority: "Medium",
    time: "1d ago",
    icon: "🔥",
    color: "#EF6262",
  },
  {
    id: "PRAV-005",
    title: "Drainage blockage",
    category: "Drainage",
    priority: "Low",
    time: "2d ago",
    icon: "🌊",
    color: "#16A6B7",
  },
];

export default function IncidentListScreen({
  onBack,
  onOpenIncident,
  onDashboard,
  onResources,
  onProfile,
}: Props) {
  const [filter, setFilter] = useState<Priority>("All");

  const filteredIncidents = incidents.filter(
    (incident) => filter === "All" || incident.priority === filter
  );

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
          <Text style={styles.headerTitle}>Incidents</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <View style={styles.filterRow}>
        {(["All", "High", "Medium", "Low"] as Priority[]).map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.filterButton, filter === item && styles.selectedFilter]}
          >
            <Text style={[styles.filterText, filter === item && styles.selectedFilterText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filteredIncidents.map((incident) => (
          <TouchableOpacity
            key={incident.id}
            style={styles.card}
            onPress={onOpenIncident}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: `${incident.color}20` }]}>
              <Text style={styles.emoji}>{incident.icon}</Text>
            </View>

            <View style={styles.incidentInfo}>
              <Text style={styles.incidentTitle}>{incident.title}</Text>
              <Text style={styles.incidentId}>{incident.id}</Text>
              <View style={styles.metaRow}>
                <Text style={[styles.category, { color: incident.color }]}>
                  {incident.category}
                </Text>
                <PriorityBadge priority={incident.priority} />
              </View>
              <Text style={styles.timeAgo}>{incident.time}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {filteredIncidents.length === 0 && (
          <Text style={styles.emptyText}>No incidents match this filter.</Text>
        )}
      </ScrollView>

      <OwnerBottomNav
        active="Incidents"
        onDashboard={onDashboard}
        onIncidents={onBack}
        onResources={onResources}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const color =
    priority === "High"
      ? "#E94E55"
      : priority === "Medium"
      ? "#C8872D"
      : "#168B69";

  return (
    <View style={[styles.priorityBadge, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.priorityText, { color }]}>{priority}</Text>
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
  headerTitle: { fontSize: 17, color: "#FFFFFF", fontWeight: "800" },
  headerSpacer: { width: 30 },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 13,
    marginBottom: 12,
    padding: 4,
    backgroundColor: "#E5F0ED",
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: "center",
  },
  selectedFilter: { backgroundColor: "#087C68" },
  filterText: { fontSize: 11, fontWeight: "700", color: "#58756E" },
  selectedFilterText: { color: "#FFFFFF" },
  list: { paddingHorizontal: 14, paddingBottom: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    minHeight: 92,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE8",
    borderRadius: 14,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  emoji: { fontSize: 18 },
  incidentInfo: { flex: 1 },
  incidentTitle: { fontSize: 11, lineHeight: 16, fontWeight: "800", color: "#294D47" },
  incidentId: { fontSize: 9, color: "#8AA09A", marginTop: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 5 },
  category: { fontSize: 10, fontWeight: "700" },
  priorityBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  priorityText: { fontSize: 9, fontWeight: "800" },
  timeAgo: { fontSize: 9, color: "#81938F", marginTop: 5 },
  chevron: { fontSize: 22, color: "#8CA6A1", marginLeft: 5 },
  emptyText: { textAlign: "center", padding: 30, color: "#81938F", fontSize: 12 },
});
