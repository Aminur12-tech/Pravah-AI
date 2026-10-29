
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { apiRequest } from "../services/api";

type Props = {
  onNavigate?: (screen: string) => void;
  userName?: string;
};

type Incident = {
  _id: string;
  reportNumber?: string;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  createdAt?: string;
  location?: {
    address?: string;
  };
};

type IncidentResponse = {
  success: boolean;
  data: Incident[];
  pagination?: {
    total: number;
    pages: number;
  };
};

const CATEGORY_DETAILS: Record<string, { icon: string; color: string }> = {
  flood: { icon: "🌊", color: "#1688E8" },
  earthquake: { icon: "🌍", color: "#B76A38" },
  landslide: { icon: "⛰️", color: "#9B6A45" },
  fire: { icon: "🔥", color: "#F04452" },
  storm: { icon: "🌪️", color: "#7B61C9" },
  road_damage: { icon: "🚧", color: "#D18A20" },
  waste: { icon: "♻️", color: "#14996F" },
  drainage: { icon: "💧", color: "#1688E8" },
  water_shortage: { icon: "🚰", color: "#1688E8" },
  other: { icon: "📍", color: "#14996F" },
};

function formatLabel(value?: string) {
  if (!value) return "Unknown";

  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function timeAgo(date?: string) {
  if (!date) return "Date unavailable";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "Date unavailable";

  const difference = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Date(timestamp).toLocaleDateString();
}

export default function CitizenHomeScreen({
  onNavigate,
  userName,
}: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const openFeature = (feature: string) => {
    if (onNavigate) {
      onNavigate(feature);
    } else {
      Alert.alert(feature, `${feature} navigation is not connected yet.`);
    }
  };

  const loadIncidents = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await apiRequest<IncidentResponse>(
        "/incidents?page=1&limit=3"
      );

      setIncidents(response.data ?? []);
      setTotalIncidents(
        response.pagination?.total ?? response.data?.length ?? 0
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load recent incidents."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  // Display the first name from the registered user's full name.
  const displayName = userName?.trim()
    ? userName.trim().split(/\s+/)[0]
    : "there";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.phoneStatus}>
        <Text style={styles.statusText}>PRAVAH AI</Text>
        <Text style={styles.statusText}>● LIVE RESPONSE</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadIncidents(true)}
            tintColor="#087C68"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello, {displayName}!</Text>
            <Text style={styles.subtitle}>
              Stay safe. Report issues. Help your community.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => openFeature("Notifications")}
            accessibilityLabel="Open notifications"
          >
            <Text style={styles.notificationIcon}>♧</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <ActionCard
            icon="🛑"
            title="Report Incident"
            color="#F04452"
            background="#FFF4F3"
            border="#FFD9D5"
            onPress={() => openFeature("Report Incident")}
          />

          <ActionCard
            icon="👤"
            title="My Reports"
            color="#1688E8"
            background="#F0F8FF"
            border="#D4EAFE"
            onPress={() => openFeature("My Reports")}
          />

          <ActionCard
            icon="🚨"
            title="Official Alerts"
            color="#F47A35"
            background="#FFF8F1"
            border="#FFE2C9"
            onPress={() => openFeature("Official Alerts")}
          />

          <ActionCard
            icon="🌳"
            title="Nearby Resources"
            color="#14996F"
            background="#EDFBF6"
            border="#CFF2E6"
            onPress={() => openFeature("Nearby Resources")}
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recent Incidents</Text>
            <Text style={styles.sectionSubtitle}>
              {totalIncidents} reported incident
              {totalIncidents === 1 ? "" : "s"} in the system
            </Text>
          </View>

          <TouchableOpacity onPress={() => openFeature("All Alerts")}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color="#087C68" />
            <Text style={styles.stateText}>
              Loading recent incidents...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>⚠️</Text>
            <Text style={styles.stateTitle}>
              Couldn't load incidents
            </Text>
            <Text style={styles.stateText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadIncidents()}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : incidents.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateEmoji}>🌿</Text>
            <Text style={styles.stateTitle}>All quiet for now</Text>
            <Text style={styles.stateText}>
              No incidents have been reported yet. You can help your
              community by reporting an issue when needed.
            </Text>
          </View>
        ) : (
          incidents.map((incident) => {
            const category =
              CATEGORY_DETAILS[incident.category ?? "other"] ??
              CATEGORY_DETAILS.other;

            return (
              <TouchableOpacity
                key={incident._id}
                style={styles.alertCard}
                activeOpacity={0.8}
                onPress={() => openFeature("All Alerts")}
              >
                <View
                  style={[
                    styles.alertIcon,
                    { backgroundColor: `${category.color}18` },
                  ]}
                >
                  <Text style={styles.alertEmoji}>
                    {category.icon}
                  </Text>
                </View>

                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle} numberOfLines={2}>
                    {incident.title || formatLabel(incident.category)}
                  </Text>

                  <Text style={styles.alertMeta} numberOfLines={1}>
                    {incident.location?.address || "Location unavailable"}
                  </Text>

                  <View style={styles.incidentMetaRow}>
                    <Text style={styles.incidentTime}>
                      {timeAgo(incident.createdAt)}
                    </Text>

                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>
                        {formatLabel(incident.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity
          style={styles.banner}
          onPress={() => openFeature("Community")}
          activeOpacity={0.9}
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Stronger Together</Text>
            <Text style={styles.bannerSubtitle}>
              For a Safer Community
            </Text>
            <Text style={styles.bannerSmall}>
              Every report can make a difference.
            </Text>
          </View>

          <Text style={styles.bannerPeople}>🌳🌲🌳</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem
          icon="⌂"
          label="Home"
          active
          onPress={() => openFeature("Home")}
        />

        <NavItem
          icon="▤"
          label="Reports"
          onPress={() => openFeature("My Reports")}
        />

        <NavItem
          icon="♧"
          label="Alerts"
          onPress={() => openFeature("Official Alerts")}
        />

        <NavItem
          icon="♙"
          label="Profile"
          onPress={() => openFeature("Profile")}
        />
      </View>
    </SafeAreaView>
  );
}

type ActionCardProps = {
  icon: string;
  title: string;
  color: string;
  background: string;
  border: string;
  onPress: () => void;
};

function ActionCard({
  icon,
  title,
  color,
  background,
  border,
  onPress,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionCard,
        { backgroundColor: background, borderColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Text style={styles.actionEmoji}>{icon}</Text>
      </View>

      <Text style={[styles.actionTitle, { color }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

type NavItemProps = {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
};

function NavItem({ icon, label, active, onPress }: NavItemProps) {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      accessibilityRole="button"
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
  phoneStatus: {
    height: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    color: "#284744",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 17,
    paddingTop: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerText: {
    flex: 1,
    paddingRight: 8,
  },
  greeting: {
    fontSize: 23,
    fontWeight: "800",
    color: "#17443E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: "#54716D",
    lineHeight: 16,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E6F5F1",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    color: "#087C68",
    fontSize: 22,
  },
  notificationDot: {
    position: "absolute",
    right: 7,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F04452",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 21,
  },
  actionCard: {
    width: "48.3%",
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 5,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  actionEmoji: {
    fontSize: 17,
  },
  actionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#214A45",
  },
  sectionSubtitle: {
    fontSize: 10,
    color: "#7B918D",
    marginTop: 3,
  },
  viewAll: {
    color: "#087C68",
    fontSize: 11,
    fontWeight: "700",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EFEC",
    borderRadius: 13,
    padding: 11,
    marginBottom: 10,
  },
  alertIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  alertEmoji: {
    fontSize: 18,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    color: "#244D48",
  },
  alertMeta: {
    marginTop: 4,
    fontSize: 10,
    color: "#7B918D",
  },
  incidentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 7,
    gap: 7,
  },
  incidentTime: {
    fontSize: 9,
    color: "#7B918D",
  },
  statusBadge: {
    backgroundColor: "#EAF5F1",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusBadgeText: {
    color: "#087C68",
    fontSize: 9,
    fontWeight: "700",
  },
  chevron: {
    fontSize: 23,
    color: "#8CA6A1",
    paddingLeft: 5,
  },
  stateCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1EFEC",
    borderRadius: 13,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },
  stateEmoji: {
    fontSize: 25,
    marginBottom: 8,
  },
  stateTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#214A45",
    textAlign: "center",
    marginBottom: 6,
  },
  stateText: {
    fontSize: 11,
    color: "#718984",
    textAlign: "center",
    lineHeight: 17,
    marginTop: 7,
  },
  retryButton: {
    backgroundColor: "#087C68",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 9,
    marginTop: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  banner: {
    minHeight: 102,
    backgroundColor: "#087C68",
    borderRadius: 14,
    overflow: "hidden",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#F8E98B",
    marginBottom: 3,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerSmall: {
    fontSize: 9,
    color: "#D6F2E8",
    marginTop: 8,
  },
  bannerPeople: {
    fontSize: 24,
    marginLeft: 4,
  },
  bottomSpace: {
    height: 8,
  },
  bottomNav: {
    height: 65,
    borderTopWidth: 1,
    borderTopColor: "#DCEBE7",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navIcon: {
    fontSize: 21,
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
