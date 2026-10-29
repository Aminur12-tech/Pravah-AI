
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

type Props = {
  onBack: () => void;
  onOpenReport: () => void;
  onHome: () => void;
  onAlerts: () => void;
  onProfile: () => void;
};

type Filter = "All" | "Active" | "Resolved";

const reports = [
  {
    id: "PRAV-008",
    title: "Flood Near Riverside",
    category: "Flood",
    priority: "High",
    status: "In Progress",
    time: "2 hours ago",
    icon: "🌊",
    color: "#1688B8",
  },
  {
    id: "PRAV-007",
    title: "Road Damage",
    category: "Road Damage",
    priority: "Medium",
    status: "Under Review",
    time: "5 hours ago",
    icon: "⚠️",
    color: "#E99A35",
  },
  {
    id: "PRAV-006",
    title: "Water Shortage",
    category: "Water",
    priority: "Low",
    status: "Resolved",
    time: "1 day ago",
    icon: "💧",
    color: "#169E77",
  },
  {
    id: "PRAV-005",
    title: "Fire",
    category: "Fire",
    priority: "High",
    status: "Under Review",
    time: "1 day ago",
    icon: "🔥",
    color: "#EF6262",
  },
];

export default function MyReportsScreen({
  onBack,
  onOpenReport,
  onHome,
  onAlerts,
  onProfile,
}: Props) {
  const [filter, setFilter] = useState<Filter>("All");

  const visibleReports = reports.filter((report) => {
    if (filter === "Active") return report.status !== "Resolved";
    if (filter === "Resolved") return report.status === "Resolved";
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FBFA" />

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>▴  ▰  ●</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.filterRow}>
        {(["All", "Active", "Resolved"] as Filter[]).map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterButton,
              filter === item && styles.filterSelected,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filter === item && styles.filterTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {visibleReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={onOpenReport}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.reportIcon,
                { backgroundColor: `${report.color}20` },
              ]}
            >
              <Text style={styles.reportEmoji}>{report.icon}</Text>
            </View>

            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportId}>{report.id}</Text>

              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.priorityBadge,
                    report.priority === "High" && styles.highPriority,
                    report.priority === "Medium" && styles.mediumPriority,
                    report.priority === "Low" && styles.lowPriority,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      report.priority === "High" && { color: "#D74747" },
                      report.priority === "Medium" && { color: "#A96A14" },
                      report.priority === "Low" && { color: "#14845F" },
                    ]}
                  >
                    {report.priority}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.reportRight}>
              <View
                style={[
                  styles.statusBadge,
                  report.status === "Resolved"
                    ? styles.resolvedBadge
                    : styles.activeBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    report.status === "Resolved"
                      ? styles.resolvedText
                      : styles.activeText,
                  ]}
                >
                  {report.status}
                </Text>
              </View>
              <Text style={styles.reportTime}>{report.time}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {visibleReports.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No reports here yet</Text>
            <Text style={styles.emptyText}>
              Reports matching this filter will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomItem icon="⌂" label="Home" onPress={onHome} />
        <BottomItem icon="▤" label="Reports" active onPress={onBack} />
        <BottomItem icon="♧" label="Alerts" onPress={onAlerts} />
        <BottomItem icon="♙" label="Profile" onPress={onProfile} />
      </View>
    </SafeAreaView>
  );
}

function BottomItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
      <Text style={[styles.navLabel, active && styles.navActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FBFA" },
  statusBar: {
    height: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: { fontSize: 11, color: "#284744", fontWeight: "700" },
  header: {
    height: 48,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 36 },
  backArrow: { fontSize: 32, color: "#087C68" },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#17443E" },
  headerSpacer: { width: 36 },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 17,
    marginTop: 8,
    marginBottom: 14,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#EAF4F1",
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  filterSelected: { backgroundColor: "#087C68" },
  filterText: { fontSize: 11, fontWeight: "700", color: "#64817B" },
  filterTextSelected: { color: "#FFFFFF" },
  list: { paddingHorizontal: 15, paddingBottom: 18, gap: 10 },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 14,
    minHeight: 96,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  reportEmoji: { fontSize: 18 },
  reportInfo: { flex: 1, justifyContent: "center" },
  reportTitle: { fontSize: 12, fontWeight: "800", color: "#294D47" },
  reportId: { fontSize: 9, color: "#8A9E99", marginTop: 4 },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  priorityBadge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 },
  highPriority: { backgroundColor: "#FFF0EF" },
  mediumPriority: { backgroundColor: "#FFF5E6" },
  lowPriority: { backgroundColor: "#E9F8F0" },
  badgeText: { fontSize: 9, fontWeight: "800" },
  reportRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 5,
    maxWidth: "38%",
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },
  activeBadge: { backgroundColor: "#E8F8F2" },
  resolvedBadge: { backgroundColor: "#EDF8F0" },
  statusBadgeText: { fontSize: 9, fontWeight: "800" },
  activeText: { color: "#12866A" },
  resolvedText: { color: "#4D9870" },
  reportTime: { fontSize: 9, color: "#81938F", marginTop: 6 },
  chevron: { fontSize: 19, color: "#8CA6A1", marginTop: 2 },
  emptyState: { alignItems: "center", padding: 35 },
  emptyEmoji: { fontSize: 32, marginBottom: 10 },
  emptyTitle: { color: "#244D48", fontSize: 15, fontWeight: "800" },
  emptyText: { color: "#81938F", fontSize: 12, textAlign: "center", marginTop: 6 },
  bottomNav: {
    height: 62,
    borderTopWidth: 1,
    borderTopColor: "#DCEBE7",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { fontSize: 20, color: "#829A95" },
  navLabel: { fontSize: 10, color: "#829A95" },
  navActive: { color: "#087C68", fontWeight: "800" },
});
