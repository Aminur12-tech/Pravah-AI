
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { apiRequest } from "../services/api";

type Incident = {
  _id: string;
  reportNumber?: string;
  title?: string;
  category?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
  location?: {
    address?: string;
  };
};

type Resource = {
  _id: string;
  name?: string;
  status?: string;
  quantity?: number;
};

type Assignment = {
  _id: string;
  status?: string;
};

type IncidentsResponse = {
  success: boolean;
  data: Incident[];
};

type ResourcesResponse = {
  success: boolean;
  data: Resource[];
};

type AssignmentsResponse = {
  success: boolean;
  data: Assignment[];
};

type Props = {
  onOpenIncidents: () => void;
  onOpenIncident: () => void;
  onResources: () => void;
  onProfile: () => void;
};

const categoryIcons: Record<string, string> = {
  flood: "💧",
  earthquake: "🌋",
  landslide: "⛰️",
  fire: "🔥",
  storm: "🌪️",
  road_damage: "🚧",
  waste: "♻️",
  drainage: "🌊",
  water_shortage: "🚰",
  other: "⚠️",
};

const categoryColors: Record<string, string> = {
  flood: "#1688F8",
  earthquake: "#F58A43",
  landslide: "#8B6253",
  fire: "#E94E55",
  storm: "#7B68C8",
  road_damage: "#C8872D",
  waste: "#27A66E",
  drainage: "#1688F8",
  water_shortage: "#1688F8",
  other: "#7B8D88",
};

function formatTime(dateString?: string) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  const elapsed = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(elapsed / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function getPriority(incident: Incident) {
  if (incident.priority) {
    const priority = incident.priority.toLowerCase();

    if (priority === "high" || priority === "critical") {
      return "High";
    }

    if (priority === "medium") return "Medium";
    if (priority === "low") return "Low";
  }

  return "Not set";
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under Review";
    case "assigned":
      return "Assigned";
    case "in_progress":
      return "In Progress";
    case "resolved":
      return "Resolved";
    default:
      return status?.replace(/_/g, " ") || "Unknown";
  }
}

export default function OwnerDashboardScreen({
  onOpenIncidents,
  onOpenIncident,
  onResources,
  onProfile,
}: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrors([]);

    const results = await Promise.allSettled([
      apiRequest<IncidentsResponse>("/incidents?page=1&limit=50"),
      apiRequest<ResourcesResponse>("/resources"),
      apiRequest<AssignmentsResponse>("/assignments"),
    ]);

    const nextErrors: string[] = [];

    if (results[0].status === "fulfilled") {
      setIncidents(results[0].value.data ?? []);
    } else {
      nextErrors.push("Incidents could not be loaded.");
    }

    if (results[1].status === "fulfilled") {
      setResources(results[1].value.data ?? []);
    } else {
      nextErrors.push("Resources could not be loaded.");
    }

    if (results[2].status === "fulfilled") {
      setAssignments(results[2].value.data ?? []);
    } else {
      nextErrors.push(
        "Assignments could not be loaded. Check that you are logged in as a project owner."
      );
    }

    setErrors(nextErrors);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const totalIncidents = incidents.length;

  const inProgress = incidents.filter(
    (incident) => incident.status === "in_progress"
  ).length;

  const resolved = incidents.filter(
    (incident) => incident.status === "resolved"
  ).length;

  const pending = incidents.filter(
    (incident) =>
      incident.status === "submitted" ||
      incident.status === "under_review"
  ).length;

  const availableResources = resources.filter(
    (resource) => resource.status === "available"
  ).length;

  const activeAssignments = assignments.filter(
    (assignment) =>
      assignment.status === "assigned" ||
      assignment.status === "in_progress"
  ).length;

  const recentIncidents = incidents.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadDashboard(true)}
            tintColor="#07866D"
          />
        }
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
              <Text style={styles.greeting}>Welcome, Admin!</Text>
              <Text style={styles.greetingSub}>
                Here's what's happening today
              </Text>
            </View>

            <TouchableOpacity
              onPress={onProfile}
              style={styles.menuButton}
              accessibilityLabel="Open profile"
            >
              <Text style={styles.menuText}>☷</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && incidents.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#07866D" />
            <Text style={styles.loadingText}>
              Loading dashboard data...
            </Text>
          </View>
        ) : (
          <>
            {errors.length > 0 && (
              <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>
                  Some dashboard data is unavailable
                </Text>

                {errors.map((error) => (
                  <Text key={error} style={styles.errorMessage}>
                    • {error}
                  </Text>
                ))}

                <TouchableOpacity
                  onPress={() => void loadDashboard()}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.statsGrid}>
              <StatCard
                icon="▤"
                title="Total Incidents"
                value={String(totalIncidents)}
                trend="Reported incidents"
                color="#1688F8"
                onPress={onOpenIncidents}
              />

              <StatCard
                icon="◷"
                title="In Progress"
                value={String(inProgress)}
                trend="Being addressed"
                color="#E9A044"
                onPress={onOpenIncidents}
              />

              <StatCard
                icon="✓"
                title="Resolved"
                value={String(resolved)}
                trend="Marked resolved"
                color="#27A66E"
                onPress={onOpenIncidents}
              />

              <StatCard
                icon="⚑"
                title="Pending"
                value={String(pending)}
                trend="Awaiting review"
                color="#D58C42"
                onPress={onOpenIncidents}
              />
            </View>

            <View style={styles.operationsCard}>
              <View style={styles.operationItem}>
                <Text style={styles.operationValue}>
                  {resources.length}
                </Text>
                <Text style={styles.operationLabel}>
                  Listed Resources
                </Text>
              </View>

              <View style={styles.operationDivider} />

              <View style={styles.operationItem}>
                <Text style={styles.operationValue}>
                  {availableResources}
                </Text>
                <Text style={styles.operationLabel}>
                  Available Resources
                </Text>
              </View>

              <View style={styles.operationDivider} />

              <View style={styles.operationItem}>
                <Text style={styles.operationValue}>
                  {activeAssignments}
                </Text>
                <Text style={styles.operationLabel}>
                  Active Assignments
                </Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Incidents</Text>

              <TouchableOpacity onPress={onOpenIncidents}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentIncidents.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  No incidents to display
                </Text>
                <Text style={styles.emptyText}>
                  Newly reported incidents will appear here.
                </Text>
              </View>
            ) : (
              <View style={styles.incidentList}>
                {recentIncidents.map((incident, index) => {
                  const category = incident.category || "other";
                  const color =
                    categoryColors[category] || categoryColors.other;
                  const title =
                    incident.title ||
                    category.replace(/_/g, " ").replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    );

                  const priority = getPriority(incident);

                  return (
                    <TouchableOpacity
                      key={incident._id}
                      style={[
                        styles.incidentRow,
                        index === recentIncidents.length - 1 &&
                          styles.lastIncidentRow,
                      ]}
                      onPress={onOpenIncident}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.incidentIcon,
                          { backgroundColor: `${color}20` },
                        ]}
                      >
                        <Text style={styles.incidentEmoji}>
                          {categoryIcons[category] || "⚠️"}
                        </Text>
                      </View>

                      <View style={styles.incidentInfo}>
                        <Text
                          style={styles.incidentTitle}
                          numberOfLines={1}
                        >
                          {title}
                        </Text>

                        <Text style={styles.incidentId} numberOfLines={1}>
                          {incident.reportNumber ||
                            `INC-${incident._id.slice(-6).toUpperCase()}`}
                        </Text>

                        <Text style={styles.incidentStatus}>
                          {getStatusLabel(incident.status)}
                        </Text>
                      </View>

                      <View style={styles.incidentRight}>
                        <PriorityBadge priority={priority} />
                        <Text style={styles.incidentTime}>
                          {formatTime(incident.createdAt)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        )}

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
      : priority === "Low"
      ? "#168B69"
      : "#7E918B";

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
  operationsCard: {
    marginHorizontal: 15,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 7,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E1ECE8",
    flexDirection: "row",
    alignItems: "center",
  },
  operationItem: { flex: 1, alignItems: "center" },
  operationValue: {
    color: "#193F39",
    fontSize: 18,
    fontWeight: "800",
  },
  operationLabel: {
    color: "#648079",
    fontSize: 9,
    textAlign: "center",
    marginTop: 4,
  },
  operationDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E1ECE8",
  },
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
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F1",
  },
  lastIncidentRow: { borderBottomWidth: 0 },
  incidentIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  incidentEmoji: { fontSize: 17 },
  incidentInfo: { flex: 1, paddingRight: 5 },
  incidentTitle: { fontSize: 11, fontWeight: "800", color: "#31534D" },
  incidentId: { fontSize: 9, color: "#8AA09A", marginTop: 4 },
  incidentStatus: {
    fontSize: 9,
    color: "#648079",
    marginTop: 3,
    textTransform: "capitalize",
  },
  incidentRight: { alignItems: "flex-end", gap: 5 },
  priorityBadge: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  priorityText: { fontSize: 9, fontWeight: "800" },
  incidentTime: { fontSize: 9, color: "#829792" },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: { color: "#648079", fontSize: 11, marginTop: 10 },
  errorCard: {
    marginHorizontal: 15,
    marginTop: 14,
    padding: 12,
    backgroundColor: "#FFF2F0",
    borderColor: "#F3C7C2",
    borderWidth: 1,
    borderRadius: 10,
  },
  errorTitle: { color: "#B42318", fontSize: 11, fontWeight: "800" },
  errorMessage: {
    color: "#9C3932",
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: "#B42318",
    borderRadius: 7,
  },
  retryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  emptyCard: {
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2ECE8",
    alignItems: "center",
  },
  emptyTitle: { color: "#31534D", fontSize: 12, fontWeight: "800" },
  emptyText: {
    color: "#829792",
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
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
