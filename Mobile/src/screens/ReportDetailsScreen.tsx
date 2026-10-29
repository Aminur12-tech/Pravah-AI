
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

type Incident = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location?: {
    address?: string;
    coordinates?: [number, number];
  };
  peopleAffected?: number;
  injuriesReported?: number;
  urgentNeeds?: string[];
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
};

type IncidentResponse = {
  success: boolean;
  data: Incident;
  message?: string;
};

type Props = {
  onBack: () => void;
  onTrackProgress: () => void;
  incidentId: string;
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const CATEGORY_LABELS: Record<string, string> = {
  flood: "Flood",
  earthquake: "Earthquake",
  landslide: "Landslide",
  fire: "Fire",
  storm: "Storm",
  road_damage: "Road Damage",
  waste: "Waste",
  drainage: "Drainage",
  water_shortage: "Water Shortage",
  other: "Other",
};

const NEED_LABELS: Record<string, string> = {
  drinking_water: "Drinking Water",
  food: "Food",
  rescue: "Rescue",
  medical_help: "Medical Help",
  shelter: "Shelter",
  blankets: "Blankets",
  first_aid: "First Aid",
  other: "Other",
};

function formatDate(value?: string): string {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLabel(value?: string): string {
  if (!value) return "Not specified";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusColor(status: string) {
  switch (status) {
    case "resolved":
      return {
        background: "#E4F7ED",
        text: "#168253",
      };
    case "in_progress":
      return {
        background: "#E8F4FF",
        text: "#287DB9",
      };
    case "assigned":
      return {
        background: "#F0EAFE",
        text: "#7651B5",
      };
    case "under_review":
      return {
        background: "#FFF3DC",
        text: "#A56A10",
      };
    default:
      return {
        background: "#E8F4FF",
        text: "#287DB9",
      };
  }
}

export default function ReportDetailsScreen({
  onBack,
  onTrackProgress,
  incidentId,
}: Props) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadIncident = useCallback(async (pullToRefresh = false) => {
    if (!incidentId) {
      setError("No incident was selected. Please return and select a report.");
      setLoading(false);
      return;
    }

    if (pullToRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await apiRequest<IncidentResponse>(
        `/incidents/${encodeURIComponent(incidentId)}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load incident details.");
      }

      setIncident(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load incident details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [incidentId]);

  useEffect(() => {
    void loadIncident();
  }, [loadIncident]);

  const status = incident?.status ?? "submitted";
  const statusColors = getStatusColor(status);

  if (loading && !incident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#087C68" />
          <Text style={styles.stateTitle}>Loading incident...</Text>
          <Text style={styles.stateMessage}>
            Fetching the latest information from PRAVAH AI.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!incident) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.centerState}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.stateTitle}>Couldn't load this report</Text>
          <Text style={styles.stateMessage}>
            {error || "Please try again."}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => void loadIncident()}
            activeOpacity={0.85}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to My Reports</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const urgentNeeds = incident.urgentNeeds ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Report Details</Text>

        <TouchableOpacity
          onPress={() => void loadIncident(true)}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadIncident(true)}
            tintColor="#087C68"
          />
        }
      >
        {error ? (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              Refresh failed: {error}. Showing the last loaded details.
            </Text>
            <TouchableOpacity onPress={() => void loadIncident(true)}>
              <Text style={styles.warningRetry}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.reportHeading}>
          <Text style={styles.eyebrow}>INCIDENT REPORT</Text>
          <Text style={styles.reportTitle}>{incident.title}</Text>
          <Text style={styles.reportId}>
            ID: {incident._id}
          </Text>
          <Text style={styles.reportDate}>
            Reported {formatDate(incident.createdAt)}
          </Text>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors.background },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: statusColors.text }]}>
              {STATUS_LABELS[status] ?? formatLabel(status)}
            </Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {CATEGORY_LABELS[incident.category] ??
                formatLabel(incident.category)}
            </Text>
          </View>
        </View>

        <SectionTitle title="Incident Information" />

        <View style={styles.card}>
          <InfoRow
            label="Category"
            value={
              CATEGORY_LABELS[incident.category] ??
              formatLabel(incident.category)
            }
          />
          <View style={styles.separator} />

          <InfoRow
            label="Current Status"
            value={STATUS_LABELS[status] ?? formatLabel(status)}
          />
          <View style={styles.separator} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {incident.location?.address || "Location not provided"}
            </Text>

            {incident.location?.coordinates ? (
              <Text style={styles.coordinates}>
                Coordinates: {incident.location.coordinates[1]},{" "}
                {incident.location.coordinates[0]}
              </Text>
            ) : null}
          </View>

          <View style={styles.separator} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.description}>
              {incident.description}
            </Text>
          </View>
        </View>

        <SectionTitle title="Impact Information" />

        <View style={styles.card}>
          <InfoRow
            label="People Affected"
            value={
              incident.peopleAffected !== undefined
                ? String(incident.peopleAffected)
                : "Not reported"
            }
          />
          <View style={styles.separator} />
          <InfoRow
            label="Injuries Reported"
            value={
              incident.injuriesReported !== undefined
                ? String(incident.injuriesReported)
                : "Not reported"
            }
          />
        </View>

        <SectionTitle title={`Urgent Needs (${urgentNeeds.length})`} />

        <View style={styles.card}>
          {urgentNeeds.length > 0 ? (
            <View style={styles.needsContainer}>
              {urgentNeeds.map((need) => (
                <View key={need} style={styles.needChip}>
                  <Text style={styles.needChipText}>
                    {NEED_LABELS[need] ?? formatLabel(need)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.mutedText}>
              No urgent needs were specified for this report.
            </Text>
          )}
        </View>

        {incident.photos && incident.photos.length > 0 ? (
          <>
            <SectionTitle title={`Photo References (${incident.photos.length})`} />
            <View style={styles.card}>
              <Text style={styles.mutedText}>
                This report contains {incident.photos.length} photo reference(s).
                Photo previews can be added when image URLs are supported in
                this screen.
              </Text>
            </View>
          </>
        ) : null}

        <TouchableOpacity
          style={styles.timelineButton}
          onPress={onTrackProgress}
          activeOpacity={0.85}
        >
          <Text style={styles.timelineButtonText}>View Timeline</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Incident information is provided by the reporter. Response teams
          should verify details before taking action.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5FBFA",
  },
  header: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 36,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 31,
    color: "#087C68",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: "#17443E",
  },
  headerSpacer: {
    width: 36,
  },
  refreshButton: {
    width: 36,
    alignItems: "flex-end",
  },
  refreshText: {
    fontSize: 25,
    color: "#087C68",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  reportHeading: {
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#087C68",
    marginBottom: 7,
  },
  reportTitle: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "800",
    color: "#17443E",
  },
  reportId: {
    marginTop: 7,
    fontSize: 10,
    color: "#64817B",
  },
  reportDate: {
    marginTop: 5,
    fontSize: 11,
    color: "#64817B",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 17,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  categoryBadge: {
    backgroundColor: "#E5F4EF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  categoryBadgeText: {
    color: "#087C68",
    fontSize: 10,
    fontWeight: "800",
  },
  sectionHeading: {
    marginTop: 5,
    marginBottom: 9,
  },
  sectionTitle: {
    color: "#244D48",
    fontSize: 13,
    fontWeight: "800",
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
  },
  infoBlock: {
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4A6862",
    marginBottom: 5,
  },
  infoValue: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: "#31534E",
    textAlign: "right",
  },
  description: {
    fontSize: 12,
    lineHeight: 19,
    color: "#31534E",
  },
  coordinates: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 15,
    color: "#64817B",
  },
  separator: {
    height: 1,
    backgroundColor: "#EAF2EF",
  },
  needsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 10,
  },
  needChip: {
    backgroundColor: "#E5F4EF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  needChipText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#087C68",
  },
  mutedText: {
    paddingVertical: 10,
    fontSize: 11,
    lineHeight: 17,
    color: "#64817B",
  },
  timelineButton: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#087C68",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  timelineButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  disclaimer: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 15,
    color: "#81938F",
  },
  centerState: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stateTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "800",
    color: "#17443E",
    textAlign: "center",
  },
  stateMessage: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 19,
    color: "#64817B",
    textAlign: "center",
  },
  errorIcon: {
    width: 44,
    height: 44,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFF0EF",
    color: "#D94343",
    fontSize: 27,
    fontWeight: "800",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#087C68",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  backLink: {
    marginTop: 16,
    padding: 8,
  },
  backLinkText: {
    color: "#087C68",
    fontSize: 12,
    fontWeight: "700",
  },
  warningCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFF3DC",
    borderRadius: 10,
  },
  warningText: {
    fontSize: 11,
    lineHeight: 16,
    color: "#805A18",
  },
  warningRetry: {
    marginTop: 8,
    color: "#805A18",
    fontSize: 11,
    fontWeight: "800",
  },
});
