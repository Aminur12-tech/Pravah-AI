
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

type Props = {
  onDashboard: () => void;
  onIncidents: () => void;
  onResources: () => void;
  onProfile: () => void;
};

const categories = [
  { label: "Flood", count: 6, color: "#1688F8" },
  { label: "Earthquake", count: 2, color: "#F5A623" },
  { label: "Landslide", count: 1, color: "#22B88A" },
  { label: "Fire", count: 1, color: "#F06B4F" },
  { label: "Other", count: 2, color: "#9B83D5" },
];

const recentActivity = [
  {
    title: "Water kits assigned - 20",
    time: "2h ago",
    icon: "✓",
  },
  {
    title: "Status updated to In Progress",
    time: "3h ago",
    icon: "◷",
  },
];

export default function AnalyticsReportsScreen({
  onDashboard,
  onIncidents,
  onResources,
  onProfile,
}: Props) {
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <View style={styles.header}>
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.menuIcon}>☷</Text>
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
        </View>

        <View style={styles.tabs}>
          <View style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Overview</Text>
          </View>
          <TouchableOpacity style={styles.tab} onPress={onIncidents}>
            <Text style={styles.tabText}>Incidents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={onResources}>
            <Text style={styles.tabText}>Resources</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Incident Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.chartArea}>
            <View style={styles.donut}>
              <View style={styles.donutHole}>
                <Text style={styles.totalNumber}>{total}</Text>
                <Text style={styles.totalLabel}>Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.legend}>
            {categories.map((category) => (
              <View style={styles.legendRow} key={category.label}>
                <View
                  style={[styles.legendDot, { backgroundColor: category.color }]}
                />
                <Text style={styles.legendLabel}>{category.label}</Text>
                <Text style={styles.legendCount}>{category.count}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Resource Inventory</Text>

        <View style={styles.inventoryCard}>
          <View style={styles.inventoryStats}>
            <View style={styles.inventoryStat}>
              <Text style={styles.inventoryLabel}>Total</Text>
              <Text style={styles.inventoryValue}>180</Text>
            </View>
            <View style={styles.inventoryStat}>
              <Text style={styles.inventoryLabel}>Available</Text>
              <Text style={styles.inventoryValue}>120</Text>
            </View>
            <View style={styles.inventoryStat}>
              <Text style={styles.inventoryLabel}>Allocated</Text>
              <Text style={styles.inventoryValue}>60</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressCaption}>67% available</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>

        <View style={styles.activityCard}>
          {recentActivity.map((activity, index) => (
            <View
              key={activity.title}
              style={[
                styles.activityRow,
                index !== recentActivity.length - 1 && styles.activityDivider,
              ]}
            >
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>{activity.icon}</Text>
              </View>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          Demo analytics — figures are sample values.
        </Text>
      </ScrollView>

      <AnalyticsBottomNav
        active="Dashboard"
        onDashboard={onDashboard}
        onIncidents={onIncidents}
        onResources={onResources}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
}

function AnalyticsBottomNav({
  active,
  onDashboard,
  onIncidents,
  onResources,
  onProfile,
}: {
  active: string;
  onDashboard: () => void;
  onIncidents: () => void;
  onResources: () => void;
  onProfile: () => void;
}) {
  const items = [
    { label: "Dashboard", icon: "▦", action: onDashboard },
    { label: "Incidents", icon: "▤", action: onIncidents },
    { label: "Resources", icon: "♧", action: onResources },
    { label: "Profile", icon: "♙", action: onProfile },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const selected = item.label === active;
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={item.action}
          >
            <Text style={[styles.navIcon, selected && styles.navActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.navLabel, selected && styles.navActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F8F7" },
  header: {
    backgroundColor: "#064D48",
    paddingHorizontal: 15,
    paddingBottom: 0,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  statusBar: {
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  statusIcons: { color: "#FFFFFF", fontSize: 10 },
  titleRow: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  menuIcon: { color: "#FFFFFF", fontSize: 20 },
  headerTitle: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  tabs: { flexDirection: "row", gap: 7, marginTop: 7 },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  activeTab: { backgroundColor: "#087C68" },
  tabText: { color: "#D2E8E1", fontSize: 10, fontWeight: "700" },
  activeTabText: { color: "#FFFFFF" },
  content: { padding: 14, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#244D45",
    marginBottom: 10,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE8",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  chartArea: {
    width: "53%",
    alignItems: "center",
    justifyContent: "center",
  },
  donut: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1688F8",
    borderWidth: 13,
    borderTopColor: "#1688F8",
    borderRightColor: "#F5A623",
    borderBottomColor: "#22B88A",
    borderLeftColor: "#9B83D5",
    transform: [{ rotate: "-25deg" }],
  },
  donutHole: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "25deg" }],
  },
  totalNumber: { fontSize: 19, color: "#294D47", fontWeight: "800" },
  totalLabel: { fontSize: 9, color: "#81938F", marginTop: 1 },
  legend: { flex: 1, paddingLeft: 5, gap: 10 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: 9, color: "#547169" },
  legendCount: { fontSize: 9, color: "#294D47", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#E0EBE7", marginVertical: 15 },
  inventoryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE8",
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
  },
  inventoryStats: { flexDirection: "row", justifyContent: "space-between" },
  inventoryStat: { flex: 1 },
  inventoryLabel: { fontSize: 9, color: "#81938F" },
  inventoryValue: {
    fontSize: 16,
    color: "#31534D",
    fontWeight: "800",
    marginTop: 5,
  },
  progressTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E3ECE8",
    marginTop: 13,
    overflow: "hidden",
  },
  progressFill: {
    width: "67%",
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#087C68",
  },
  progressCaption: {
    fontSize: 9,
    color: "#087C68",
    textAlign: "right",
    marginTop: 5,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE8",
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  activityRow: {
    minHeight: 51,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: "#EDF3F0" },
  activityIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2F5ED",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIconText: { fontSize: 11, color: "#087C68", fontWeight: "800" },
  activityTitle: { flex: 1, fontSize: 10, color: "#42635C" },
  activityTime: { fontSize: 9, color: "#81938F" },
  disclaimer: {
    textAlign: "center",
    fontSize: 9,
    color: "#81938F",
    marginTop: 12,
  },
  bottomNav: {
    height: 61,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFEBE7",
    alignItems: "center",
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { fontSize: 19, color: "#8BA09A" },
  navLabel: { fontSize: 9, color: "#8BA09A" },
  navActive: { color: "#087C68", fontWeight: "800" },
});
