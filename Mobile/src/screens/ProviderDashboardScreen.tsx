
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
      >
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>

        <View style={styles.topTitleRow}>
          <Text style={styles.pageTitle}>☷  Relief Report</Text>
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
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.organization}>Helping Hands NGO</Text>
            <Text style={styles.tagline}>
              Your support makes a difference
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Active{"\n"}Requests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Fulfilled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

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
              Keep your available resources updated to help communities faster.
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
  statusIcons: { fontSize: 10, color: "#193E38" },
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
  verifiedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DFF5E9",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
    marginLeft: 4,
  },
  verifiedText: { color: "#087C68", fontSize: 8, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    minHeight: 75,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0ECE7",
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: { fontSize: 20, fontWeight: "900", color: "#244D45" },
  statLabel: {
    fontSize: 9,
    textAlign: "center",
    color: "#648078",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#244D45",
    fontWeight: "800",
    marginBottom: 10,
  },
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
  infoIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: "#087C68",
  },
  infoTextContainer: { flex: 1 },
  infoTitle: { color: "#244D45", fontSize: 10, fontWeight: "800" },
  infoSubtitle: { color: "#648078", fontSize: 9, marginTop: 4, lineHeight: 14 },
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
