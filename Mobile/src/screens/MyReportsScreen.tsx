
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { apiRequest } from "../services/api";

type Props = {
  onBack: () => void;
  onOpenReport: (id: string) => void;
  onHome: () => void;
  onAlerts: () => void;
  onProfile: () => void;
};

type Filter = "All" | "Active" | "Resolved";

type BackendStatus =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "resolved";

type Incident = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status?: BackendStatus;
  location?: {
    address?: string;
  };
  createdAt?: string;
  urgentNeeds?: string[];
};

type IncidentResponse = {
  success: boolean;
  data: Incident[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const categoryDetails: Record<
  string,
  { icon: string; color: string }
> = {
  flood: { icon: "🌊", color: "#1688B8" },
  earthquake: { icon: "🌍", color: "#E99A35" },
  landslide: { icon: "⛰️", color: "#A66C45" },
  fire: { icon: "🔥", color: "#EF6262" },
  storm: { icon: "🌪️", color: "#7A72CF" },
  road_damage: { icon: "⚠️", color: "#E99A35" },
  waste: { icon: "♻️", color: "#169E77" },
  drainage: { icon: "💧", color: "#1688B8" },
  water_shortage: { icon: "🚰", color: "#1688B8" },
  other: { icon: "📍", color: "#718096" },
};

function readable(value?: string): string {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatus(status?: BackendStatus): string {
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
      return "Submitted";
  }
}

function getTimeLabel(date?: string): string {
  if (!date) return "Recently reported";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "Recently reported";

  const difference = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(date).toLocaleDateString();
}

function getPriority(incident: Incident): "High" | "Medium" | "Low" {
  const text = [
    incident.title,
    incident.description,
    ...(incident.urgentNeeds ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("urgent") ||
    text.includes("trapped") ||
    text.includes("rescue") ||
    text.includes("injury") ||
    text.includes("life-threatening")
  ) {
    return "High";
  }

  if (
    incident.category === "flood" ||
    incident.category === "fire" ||
    incident.category === "earthquake" ||
    incident.category === "landslide" ||
    incident.category === "storm"
  ) {
    return "Medium";
  }

  return "Low";
}

export default function MyReportsScreen({
  onBack,
  onOpenReport,
  onHome,
  onAlerts,
  onProfile,
}: Props) {
  const [filter, setFilter] = useState<Filter>("All");
  const [reports, setReports] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    try {
      setError("");

      const response = await apiRequest<IncidentResponse>(
        "/incidents?page=1&limit=50"
      );

      if (!response.success || !Array.isArray(response.data)) {
        throw new Error("The server returned an invalid incident list.");
      }

      setReports(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load incident reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    void loadReports();
  }, [loadReports]);

  const visibleReports = reports.filter((report) => {
    const status = getStatus(report.status);

    if (filter === "Active") return status !== "Resolved";
    if (filter === "Resolved") return status === "Resolved";

    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>PRAVAH AI</Text>
        <Text style={styles.statusText}>Community Safety</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryNumber}>{reports.length}</Text>
          <Text style={styles.summaryLabel}>Reports loaded</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View>
          <Text style={styles.summaryNumber}>
            {reports.filter((item) => item.status === "resolved").length}
          </Text>
          <Text style={styles.summaryLabel}>Resolved</Text>
        </View>
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

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#087C68" />
          <Text style={styles.stateText}>Loading incident reports...</Text>
        </View>
      ) : error ? (
        <ScrollView
          contentContainerStyle={styles.stateContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#087C68"
            />
          }
        >
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Couldn't load reports</Text>
          <Text style={styles.emptyText}>{error}</Text>

          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.retryButton}
            disabled={refreshing}
          >
            <Text style={styles.retryText}>
              {refreshing ? "Retrying..." : "Try again"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#087C68"
            />
          }
        >
          {visibleReports.map((report) => {
            const category =
              categoryDetails[report.category] ?? categoryDetails.other;

            const status = getStatus(report.status);
            const priority = getPriority(report);

            return (
              <TouchableOpacity
                key={report._id}
                style={styles.reportCard}
                onPress={() => onOpenReport(report._id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.reportIcon,
                    { backgroundColor: `${category.color}20` },
                  ]}
                >
                  <Text style={styles.reportEmoji}>{category.icon}</Text>
                </View>

                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle} numberOfLines={2}>
                    {report.title}
                  </Text>

                  <Text style={styles.reportId} numberOfLines={1}>
                    ID: {report._id}
                  </Text>

                  <Text style={styles.categoryText}>
                    {readable(report.category)}
                  </Text>

                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.priorityBadge,
                        priority === "High" && styles.highPriority,
                        priority === "Medium" && styles.mediumPriority,
                        priority === "Low" && styles.lowPriority,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          priority === "High" && { color: "#D74747" },
                          priority === "Medium" && { color: "#A96A14" },
                          priority === "Low" && { color: "#14845F" },
                        ]}
                      >
                        {priority} priority
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.locationText} numberOfLines={2}>
                    📍 {report.location?.address ?? "Location not provided"}
                  </Text>
                </View>

                <View style={styles.reportRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      status === "Resolved"
                        ? styles.resolvedBadge
                        : styles.activeBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        status === "Resolved"
                          ? styles.resolvedText
                          : styles.activeText,
                      ]}
                    >
                      {status}
                    </Text>
                  </View>

                  <Text style={styles.reportTime}>
                    {getTimeLabel(report.createdAt)}
                  </Text>

                  <Text style={styles.chevron}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {!visibleReports.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTitle}>No reports here yet</Text>
              <Text style={styles.emptyText}>
                {filter === "Resolved"
                  ? "You don't have any resolved reports in the loaded list."
                  : filter === "Active"
                    ? "There are no active reports in the loaded list."
                    : "Submit an incident report to get started."}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <BottomItem icon="⌂" label="Home" onPress={onHome} />
        <BottomItem
          icon="▤"
          label="Reports"
          active
          onPress={() => setFilter("All")}
        />
        <BottomItem
          icon="♧"
          label="Alerts"
          onPress={onAlerts}
        />
        <BottomItem
          icon="♙"
          label="Profile"
          onPress={onProfile}
        />
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
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.navIcon, active && styles.navActive]}>
        {icon}
      </Text>
      <Text style={[styles.navLabel, active && styles.navActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5FBFA",
  },
  statusBar: {
    height: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    color: "#284744",
    fontWeight: "700",
  },
  header: {
    height: 48,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
  },
  backArrow: {
    fontSize: 32,
    color: "#087C68",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#17443E",
  },
  headerSpacer: {
    width: 36,
  },
  summaryRow: {
    marginHorizontal: 17,
    marginTop: 8,
    marginBottom: 12,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#EAF4F1",
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  summaryNumber: {
    color: "#087C68",
    fontSize: 21,
    fontWeight: "900",
  },
  summaryLabel: {
    color: "#64817B",
    fontSize: 10,
    marginTop: 3,
  },
  summaryDivider: {
    height: 35,
    width: 1,
    backgroundColor: "#C9DED7",
  },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 17,
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
  filterSelected: {
    backgroundColor: "#087C68",
  },
  filterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64817B",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 18,
    gap: 10,
    flexGrow: 1,
  },
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 14,
    minHeight: 110,
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
  reportEmoji: {
    fontSize: 18,
  },
  reportInfo: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#294D47",
  },
  reportId: {
    fontSize: 9,
    color: "#8A9E99",
    marginTop: 4,
  },
  categoryText: {
    fontSize: 10,
    color: "#64817B",
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
  },
  priorityBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  highPriority: {
    backgroundColor: "#FFF0EF",
  },
  mediumPriority: {
    backgroundColor: "#FFF5E6",
  },
  lowPriority: {
    backgroundColor: "#E9F8F0",
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  locationText: {
    color: "#728780",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 6,
  },
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
  activeBadge: {
    backgroundColor: "#E8F8F2",
  },
  resolvedBadge: {
    backgroundColor: "#EDF8F0",
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
  },
  activeText: {
    color: "#12866A",
  },
  resolvedText: {
    color: "#4D9870",
  },
  reportTime: {
    fontSize: 9,
    color: "#81938F",
    marginTop: 6,
    textAlign: "right",
  },
  chevron: {
    fontSize: 19,
    color: "#8CA6A1",
    marginTop: 2,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  stateContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  stateText: {
    color: "#64817B",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 35,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    color: "#244D48",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    color: "#81938F",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
  },
  retryButton: {
    backgroundColor: "#087C68",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 18,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  bottomNav: {
    height: 62,
    borderTopWidth: 1,
    borderTopColor: "#DCEBE7",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  navIcon: {
    fontSize: 20,
    color: "#829A95",
  },
  navLabel: {
    fontSize: 10,
    color: "#829A95",
  },
  navActive: {
    color: "#087C68",
    fontWeight: "800",
  },
});
