
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

type Resource = {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: "available" | "limited" | "unavailable";
};

type ResourcesResponse = {
  success: boolean;
  data: Resource[];
  count: number;
};

type Props = {
  onAddResources: () => void;
  onViewRequests: () => void;
  onUpdateAvailability: () => void;
  onViewImpact: () => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onProfile: () => void;
};

const quickActions = [
  {
    title: "Add Resources",
    subtitle: "List what you can provide",
    icon: "＋",
    color: "#087C68",
    action: "add",
  },
  {
    title: "View Requests",
    subtitle: "See nearby needs",
    icon: "▣",
    color: "#087C68",
    action: "requests",
  },
  {
    title: "Update Availability",
    subtitle: "Manage your inventory",
    icon: "◉",
    color: "#087C68",
    action: "availability",
  },
  {
    title: "View Impact",
    subtitle: "Track your contribution",
    icon: "↗",
    color: "#087C68",
    action: "impact",
  },
];

export default function ProviderDashboardScreen({
  onAddResources,
  onViewRequests,
  onUpdateAvailability,
  onViewImpact,
  onHome,
  onResources,
  onRequests,
  onProfile,
}: Props) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadResources = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await apiRequest<ResourcesResponse>("/resources");
      setResources(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your resources."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  const totalResources = resources.length;
  const availableResources = resources.filter(
    (resource) => resource.status === "available"
  ).length;
  const attentionResources = resources.filter(
    (resource) =>
      resource.status === "limited" ||
      resource.status === "unavailable"
  ).length;

  const handleAction = (action: string) => {
    switch (action) {
      case "add":
        onAddResources();
        break;
      case "requests":
        onViewRequests();
        break;
      case "availability":
        onUpdateAvailability();
        break;
      case "impact":
        onViewImpact();
        break;
    }
  };

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
            onRefresh={() => void loadResources(true)}
            tintColor="#087C68"
            colors={["#087C68"]}
          />
        }
      >
        <View style={styles.statusBar}>
          <Text style={styles.time}>PRAVAH AI</Text>
          <Text style={styles.statusIcons}>● Live Dashboard</Text>
        </View>

        <View style={styles.topTitleRow}>
          <Text style={styles.pageTitle}>☷  Provider Dashboard</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onProfile}
            accessibilityLabel="Open provider profile"
          >
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>♧</Text>
          </View>

          <View style={styles.profileText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.organization}>Resource Provider</Text>
            <Text style={styles.tagline}>
              Your support makes a difference
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>Connected</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? "—" : totalResources}
            </Text>
            <Text style={styles.statLabel}>Listed{"\n"}Resources</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? "—" : availableResources}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? "—" : attentionResources}
            </Text>
            <Text style={styles.statLabel}>Limited /{"\n"}Unavailable</Text>
          </View>
        </View>

        {loading && (
          <View style={styles.messageCard}>
            <ActivityIndicator color="#087C68" />
            <Text style={styles.messageText}>
              Loading your resources...
            </Text>
          </View>
        )}

        {!loading && !!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Could not load dashboard data
            </Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => void loadResources()}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && totalResources === 0 && (
          <View style={styles.messageCard}>
            <Text style={styles.emptyTitle}>No resources listed yet</Text>
            <Text style={styles.messageText}>
              Add your first resource to start managing your inventory.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onAddResources}
            >
              <Text style={styles.retryText}>＋ Add Resource</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity onPress={() => void loadResources(true)}>
            <Text style={styles.refreshText}>Refresh ↻</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity
              key={item.action}
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => handleAction(item.action)}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: item.color },
                ]}
              >
                <Text style={styles.actionIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>✓</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Make a difference today</Text>
            <Text style={styles.infoSubtitle}>
              Keep your resource quantities and availability up to date
              to help communities faster.
            </Text>
          </View>
        </View>
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
                item.label === "Home" && styles.activeNavText,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                item.label === "Home" && styles.activeNavText,
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
  scrollContent: { paddingHorizontal: 15, paddingBottom: 20 },
  statusBar: {
    height: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { fontSize: 11, color: "#193E38", fontWeight: "800" },
  statusIcons: { fontSize: 10, color: "#087C68", fontWeight: "700" },
  topTitleRow: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: { color: "#244D45", fontSize: 14, fontWeight: "800" },
  menuButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: { fontSize: 23, color: "#42635C" },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    marginTop: 7,
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#DDF3EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarIcon: { fontSize: 25, color: "#087C68" },
  profileText: { flex: 1 },
  greeting: { fontSize: 12, fontWeight: "800", color: "#244D45" },
  organization: {
    fontSize: 11,
    fontWeight: "800",
    color: "#244D45",
    marginTop: 3,
  },
  tagline: { fontSize: 9, color: "#81938F", marginTop: 4 },
  liveBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DFF5E9",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 4,
  },
  liveText: { color: "#087C68", fontSize: 8, fontWeight: "800" },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    minHeight: 75,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  statNumber: { fontSize: 20, fontWeight: "900", color: "#244D45" },
  statLabel: {
    fontSize: 9,
    textAlign: "center",
    color: "#648078",
    marginTop: 4,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#244D45",
    fontWeight: "800",
  },
  refreshText: { fontSize: 10, color: "#087C68", fontWeight: "700" },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  actionCard: {
    width: "48%",
    flexGrow: 1,
    minHeight: 108,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    borderRadius: 12,
    padding: 10,
  },
  actionIcon: {
    width: 29,
    height: 29,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  actionIconText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  actionTitle: { fontSize: 10, fontWeight: "800", color: "#244D45" },
  actionSubtitle: { fontSize: 9, color: "#81938F", marginTop: 4 },
  infoBanner: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#E9F6F0",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  infoIcon: { fontSize: 16, fontWeight: "900", color: "#087C68" },
  infoTextContainer: { flex: 1 },
  infoTitle: { color: "#244D45", fontSize: 10, fontWeight: "800" },
  infoSubtitle: {
    color: "#648078",
    fontSize: 9,
    marginTop: 4,
    lineHeight: 14,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    marginBottom: 16,
    gap: 8,
  },
  messageText: {
    fontSize: 11,
    color: "#648078",
    textAlign: "center",
    lineHeight: 17,
  },
  emptyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#244D45",
  },
  errorCard: {
    backgroundColor: "#FFF2F0",
    borderRadius: 11,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F2D4CF",
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#9E3428",
  },
  errorText: {
    fontSize: 10,
    color: "#814B45",
    marginTop: 6,
    lineHeight: 16,
  },
  retryButton: {
    backgroundColor: "#087C68",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 8,
  },
  retryText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
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
