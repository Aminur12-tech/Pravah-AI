
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  title: string;
  description?: string;
  category: string;
  priority?: string;
  status: string;
  location?: {
    address?: string;
  };
  urgentNeeds?: string[];
  peopleAffected?: number;
  injuriesReported?: number;
  createdAt?: string;
};

type Assignment = {
  _id: string;
  status: string;
  incident: Incident | string;
  instructions?: string;
};

type IncidentsResponse = {
  success: boolean;
  data: Incident[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

type AssignmentsResponse = {
  success: boolean;
  data: Assignment[];
  count?: number;
};

type Props = {
  onBack: () => void;
  onOpenRequest: (requestId: string) => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onProfile: () => void;
};

const filters = ["All", "Food", "Medical", "Shelter", "Other"] as const;
type Filter = (typeof filters)[number];

function getIncidentId(incident: Incident | string): string {
  return typeof incident === "string" ? incident : incident._id;
}

function matchesFilter(incident: Incident, filter: Filter): boolean {
  if (filter === "All") return true;

  const category = incident.category.toLowerCase();
  const needs = (incident.urgentNeeds ?? []).map((need) =>
    need.toLowerCase()
  );

  if (filter === "Food") {
    return (
      category === "food" ||
      needs.includes("food") ||
      needs.includes("drinking_water")
    );
  }

  if (filter === "Medical") {
    return (
      category === "medical" ||
      needs.includes("medical_help") ||
      needs.includes("first_aid")
    );
  }

  if (filter === "Shelter") {
    return (
      category === "shelter" ||
      needs.includes("shelter") ||
      needs.includes("blankets")
    );
  }

  return (
    category === "other" ||
    needs.includes("other") ||
    (!needs.length &&
      !["food", "medical", "shelter"].includes(category))
  );
}

function priorityLabel(priority?: string): string {
  const value = priority?.toLowerCase();

  if (value === "critical" || value === "urgent") return "URGENT";
  if (value === "high") return "HIGH";
  if (value === "low") return "LOW";

  return value ? value.toUpperCase() : "REPORTED";
}

function priorityColor(priority?: string): string {
  const value = priority?.toLowerCase();

  if (value === "critical" || value === "urgent" || value === "high") {
    return "#B9382F";
  }

  if (value === "medium") return "#A86B12";
  if (value === "low") return "#087C68";

  return "#648078";
}

function formatDate(date?: string): string {
  if (!date) return "Recently reported";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently reported";

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function formatCategory(category: string): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function NearbyRequestsScreen({
  onBack,
  onOpenRequest,
  onHome,
  onResources,
  onRequests,
  onProfile,
}: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [incidentResponse, assignmentResponse] = await Promise.all([
        apiRequest<IncidentsResponse>("/incidents?page=1&limit=50"),
        apiRequest<AssignmentsResponse>("/assignments"),
      ]);

      setIncidents(
        Array.isArray(incidentResponse.data) ? incidentResponse.data : []
      );
      setAssignments(
        Array.isArray(assignmentResponse.data) ? assignmentResponse.data : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load incident requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const assignedIncidentIds = useMemo(() => {
    return new Set(
      assignments
        .filter((assignment) =>
          ["assigned", "in_progress"].includes(
            assignment.status.toLowerCase()
          )
        )
        .map((assignment) => getIncidentId(assignment.incident))
    );
  }, [assignments]);

  const openIncidents = useMemo(() => {
    return incidents.filter((incident) =>
      ["submitted", "under_review", "assigned", "in_progress"].includes(
        incident.status.toLowerCase()
      )
    );
  }, [incidents]);

  const filteredIncidents = useMemo(() => {
    return openIncidents.filter((incident) =>
      matchesFilter(incident, activeFilter)
    );
  }, [openIncidents, activeFilter]);

  const navItems = [
    { label: "Home", icon: "⌂", action: onHome },
    { label: "Resources", icon: "▤", action: onResources },
    { label: "Requests", icon: "▣", action: onRequests },
    { label: "Profile", icon: "♙", action: onProfile },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAF8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadRequests(true)}
            tintColor="#087C68"
            colors={["#087C68"]}
          />
        }
      >
        <View style={styles.statusBar}>
          <Text style={styles.brand}>PRAVAH AI</Text>
          <Text style={styles.liveLabel}>● Live Requests</Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.pageTitle}>Nearby Requests</Text>
            <Text style={styles.subtitle}>
              Find communities that need support
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => void loadRequests(true)}
            style={styles.refreshButton}
            accessibilityLabel="Refresh requests"
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryIconText}>⌖</Text>
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Open incident reports</Text>
            <Text style={styles.summarySubtitle}>
              Latest reports from the community
            </Text>
          </View>
          <Text style={styles.summaryCount}>
            {loading ? "—" : openIncidents.length}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Filter by need</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && (
          <View style={styles.stateCard}>
            <ActivityIndicator size="large" color="#087C68" />
            <Text style={styles.stateText}>Loading incident reports...</Text>
          </View>
        )}

        {!loading && !!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Couldn't load requests</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadRequests()}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && filteredIncidents.length === 0 && (
          <View style={styles.stateCard}>
            <Text style={styles.emptyIcon}>⌕</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.stateText}>
              Try another filter or refresh to check for new reports.
            </Text>
            {activeFilter !== "All" && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setActiveFilter("All")}
              >
                <Text style={styles.retryText}>Show All Requests</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {!loading &&
          !error &&
          filteredIncidents.map((incident) => {
            const isAssigned = assignedIncidentIds.has(incident._id);
            const priority = priorityLabel(incident.priority);
            const color = priorityColor(incident.priority);

            return (
              <TouchableOpacity
                key={incident._id}
                style={styles.requestCard}
                activeOpacity={0.85}
                onPress={() => onOpenRequest(incident._id)}
              >
                <View style={styles.cardTopRow}>
                  <Text style={styles.requestId}>
                    {incident.reportNumber || `INC-${incident._id.slice(-6).toUpperCase()}`}
                  </Text>

                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: `${color}18` },
                    ]}
                  >
                    <Text style={[styles.priorityText, { color }]}>
                      {priority}
                    </Text>
                  </View>
                </View>

                <Text style={styles.requestTitle}>{incident.title}</Text>

                <Text style={styles.categoryText}>
                  {formatCategory(incident.category)}
                </Text>

                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>⌖</Text>
                  <Text style={styles.locationText} numberOfLines={2}>
                    {incident.location?.address || "Location not provided"}
                  </Text>
                </View>

                {!!incident.urgentNeeds?.length && (
                  <View style={styles.needsContainer}>
                    <Text style={styles.needsHeading}>Urgent needs</Text>
                    <View style={styles.needsRow}>
                      {incident.urgentNeeds.slice(0, 3).map((need) => (
                        <View key={need} style={styles.needTag}>
                          <Text style={styles.needTagText}>
                            {formatCategory(need)}
                          </Text>
                        </View>
                      ))}
                      {incident.urgentNeeds.length > 3 && (
                        <Text style={styles.moreNeeds}>
                          +{incident.urgentNeeds.length - 3}
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.cardDivider} />

                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={styles.dateText}>
                      Reported {formatDate(incident.createdAt)}
                    </Text>
                    {typeof incident.peopleAffected === "number" && (
                      <Text style={styles.peopleText}>
                        {incident.peopleAffected} people affected
                      </Text>
                    )}
                  </View>

                  <View style={styles.openAction}>
                    <Text style={styles.openActionText}>
                      {isAssigned ? "Assigned to you" : "View details"} ›
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

        {!loading && !error && assignments.length > 0 && (
          <View style={styles.assignmentNote}>
            <Text style={styles.assignmentNoteTitle}>Your assignments</Text>
            <Text style={styles.assignmentNoteText}>
              {assignments.filter((item) =>
                ["assigned", "in_progress"].includes(item.status.toLowerCase())
              ).length}{" "}
              active assignment(s) are linked to your provider account.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={item.action}
          >
            <Text
              style={[
                styles.navIcon,
                item.label === "Requests" && styles.activeNavText,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                item.label === "Requests" && styles.activeNavText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FAF8" },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 24 },
  statusBar: {
    height: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { fontSize: 11, color: "#193E38", fontWeight: "900" },
  liveLabel: { fontSize: 10, color: "#087C68", fontWeight: "700" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 15,
    gap: 9,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E4F2EC",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 29, color: "#087C68", lineHeight: 32 },
  headerText: { flex: 1 },
  pageTitle: { color: "#244D45", fontSize: 17, fontWeight: "900" },
  subtitle: { color: "#81938F", fontSize: 10, marginTop: 3 },
  refreshButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: { fontSize: 23, color: "#087C68" },
  summaryCard: {
    backgroundColor: "#E9F6F0",
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 19,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#D1EDE1",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryIconText: { fontSize: 23, color: "#087C68" },
  summaryText: { flex: 1 },
  summaryTitle: { fontSize: 12, fontWeight: "800", color: "#244D45" },
  summarySubtitle: { fontSize: 9, color: "#648078", marginTop: 4 },
  summaryCount: { fontSize: 22, fontWeight: "900", color: "#087C68" },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#244D45",
    marginBottom: 9,
  },
  filterRow: { gap: 8, paddingBottom: 15 },
  filterChip: {
    borderWidth: 1,
    borderColor: "#DCE9E4",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  activeFilterChip: { backgroundColor: "#087C68", borderColor: "#087C68" },
  filterText: { fontSize: 10, fontWeight: "700", color: "#648078" },
  activeFilterText: { color: "#FFFFFF" },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    padding: 13,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#E0ECE7",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestId: { fontSize: 9, color: "#81938F", fontWeight: "800" },
  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  priorityText: { fontSize: 8, fontWeight: "900" },
  requestTitle: {
    color: "#244D45",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 9,
  },
  categoryText: {
    color: "#087C68",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 9,
    gap: 6,
  },
  locationIcon: { color: "#648078", fontSize: 14 },
  locationText: { color: "#648078", fontSize: 10, flex: 1, lineHeight: 15 },
  needsContainer: { marginTop: 11 },
  needsHeading: {
    fontSize: 9,
    fontWeight: "800",
    color: "#244D45",
    marginBottom: 6,
  },
  needsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  needTag: {
    backgroundColor: "#E9F6F0",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  needTagText: { color: "#087C68", fontSize: 8, fontWeight: "700" },
  moreNeeds: { fontSize: 9, color: "#648078", alignSelf: "center" },
  cardDivider: { height: 1, backgroundColor: "#EDF2EF", marginVertical: 11 },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dateText: { color: "#81938F", fontSize: 9 },
  peopleText: { color: "#648078", fontSize: 9, marginTop: 4 },
  openAction: {
    backgroundColor: "#E9F6F0",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 8,
  },
  openActionText: { color: "#087C68", fontSize: 9, fontWeight: "800" },
  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    gap: 9,
    marginBottom: 15,
  },
  stateText: {
    color: "#648078",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 16,
  },
  emptyIcon: { fontSize: 29, color: "#087C68" },
  emptyTitle: { fontSize: 13, color: "#244D45", fontWeight: "900" },
  errorCard: {
    backgroundColor: "#FFF2F0",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F2D4CF",
    marginBottom: 15,
  },
  errorTitle: { fontSize: 12, fontWeight: "900", color: "#9E3428" },
  errorText: { fontSize: 10, color: "#814B45", marginTop: 6, lineHeight: 16 },
  retryButton: {
    backgroundColor: "#087C68",
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 9,
  },
  retryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  assignmentNote: {
    padding: 12,
    backgroundColor: "#E9F6F0",
    borderRadius: 11,
    marginTop: 5,
    marginBottom: 12,
  },
  assignmentNoteTitle: {
    color: "#244D45",
    fontSize: 11,
    fontWeight: "900",
  },
  assignmentNoteText: {
    color: "#648078",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },
  bottomNav: {
    height: 61,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFEBE7",
    flexDirection: "row",
    alignItems: "center",
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { fontSize: 19, color: "#8BA09A" },
  navLabel: { fontSize: 9, color: "#8BA09A" },
  activeNavText: { color: "#087C68", fontWeight: "800" },
});
