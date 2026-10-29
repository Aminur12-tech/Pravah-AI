
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
  onOpenIncidents: () => void;
  onOpenIncident: () => void;
  onResources: () => void;
  onProfile: () => void;
};

const recentIncidents = [
  {
    icon: "💧",
    title: "Flood",
    id: "PRAV-001",
    priority: "High",
    time: "2h ago",
    color: "#1688F8",
  },
  {
    icon: "🌋",
    title: "Earthquake",
    id: "PRAV-002",
    priority: "Medium",
    time: "5h ago",
    color: "#F58A43",
  },
  {
    icon: "⛰️",
    title: "Landslide",
    id: "PRAV-003",
    priority: "High",
    time: "1d ago",
    color: "#8B6253",
  },
];

export default function OwnerDashboardScreen({
  onOpenIncidents,
  onOpenIncident,
  onResources,
  onProfile,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.statusRow}>
            <Text style={styles.time}>9:41</Text>
            <Text style={styles.statusIcons}>▴  ▰  ●</Text>
          </View>

          <View style={styles.greetingRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>Good Morning, Admin!</Text>
              <Text style={styles.greetingSub}>
                Here's what's happening today
              </Text>
            </View>
            <TouchableOpacity
              onPress={onProfile}
              style={styles.menuButton}
            >
              <Text style={styles.menuText}>☷</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="▤"
            title="Total Incidents"
            value="12"
            trend="↑ 2 today"
            color="#1688F8"
            onPress={onOpenIncidents}
          />
          <StatCard
            icon="◷"
            title="In Progress"
            value="5"
            trend="↑ 1 today"
            color="#E9A044"
            onPress={onOpenIncidents}
          />
          <StatCard
            icon="✓"
            title="Resolved"
            value="3"
            trend="↑ 1 today"
            color="#27A66E"
            onPress={onOpenIncidents}
          />
          <StatCard
            icon="⚑"
            title="Pending"
            value="4"
            trend="0 today"
            color="#D58C42"
            onPress={onOpenIncidents}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Incidents</Text>
          <TouchableOpacity onPress={onOpenIncidents}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.incidentList}>
          {recentIncidents.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={styles.incidentRow}
              onPress={onOpenIncident}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.incidentIcon,
                  { backgroundColor: `${incident.color}20` },
                ]}
              >
                <Text style={styles.incidentEmoji}>{incident.icon}</Text>
              </View>

              <View style={styles.incidentInfo}>
                <Text style={styles.incidentTitle}>{incident.title}</Text>
                <Text style={styles.incidentId}>{incident.id}</Text>
              </View>

              <View style={styles.incidentRight}>
                <PriorityBadge priority={incident.priority} />
                <Text style={styles.incidentTime}>{incident.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <OwnerBottomNav
        active="Dashboard"
        onDashboard={() => {}}
        onIncidents={onOpenIncidents}
        onResources={onResources}
        onProfile={onProfile}
      />
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  value: string;
  trend: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.statTitleRow}>
        <Text style={[styles.statIcon, { color }]}>{icon}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statTrend, { color }]}>{trend}</Text>
    </TouchableOpacity>
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

export function OwnerBottomNav({
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
  scrollContent: { paddingBottom: 15 },
  hero: {
    backgroundColor: "#064D48",
    paddingHorizontal: 17,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statusRow: {
    height: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  statusIcons: { color: "#FFFFFF", fontSize: 10 },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#D0F0E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 9,
  },
  avatarText: { fontSize: 16, fontWeight: "800", color: "#087C68" },
  greetingText: { flex: 1 },
  greeting: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  greetingSub: { color: "#D4EAE5", fontSize: 10, marginTop: 4 },
  menuButton: { padding: 7 },
  menuText: { color: "#FFFFFF", fontSize: 23 },
  statsGrid: {
    paddingHorizontal: 15,
    marginTop: -12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  statCard: {
    width: "48.5%",
    minHeight: 94,
    padding: 11,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E1ECE8",
  },
  statTitleRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  statIcon: { fontSize: 13, fontWeight: "800" },
  statTitle: { fontSize: 10, color: "#648079", fontWeight: "600" },
  statValue: {
    marginTop: 7,
    fontSize: 22,
    fontWeight: "800",
    color: "#193F39",
  },
  statTrend: { marginTop: 3, fontSize: 9, fontWeight: "700" },
  sectionHeader: {
    marginTop: 20,
    marginHorizontal: 17,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#234B44" },
  viewAll: { fontSize: 10, color: "#087C68", fontWeight: "800" },
  incidentList: {
    marginHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2ECE8",
    paddingHorizontal: 10,
  },
  incidentRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F1",
  },
  incidentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  incidentEmoji: { fontSize: 17 },
  incidentInfo: { flex: 1 },
  incidentTitle: { fontSize: 11, fontWeight: "800", color: "#31534D" },
  incidentId: { fontSize: 9, color: "#8AA09A", marginTop: 4 },
  incidentRight: { alignItems: "flex-end", gap: 5 },
  priorityBadge: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 9, fontWeight: "800" },
  incidentTime: { fontSize: 9, color: "#829792" },
  bottomSpace: { height: 10 },
  bottomNav: {
    height: 62,
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
