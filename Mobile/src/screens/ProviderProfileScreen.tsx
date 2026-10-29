
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";

type Props = {
  onBack: () => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onLogout: () => void;
};

const profileOptions = [
  { icon: "▤", label: "Organization Details" },
  { icon: "▣", label: "Verification Documents" },
  { icon: "▰", label: "Contact Information" },
  { icon: "✚", label: "Supported Areas" },
  { icon: "♟", label: "Notification Settings" },
  { icon: "?", label: "Help & Support" },
];

export default function ProviderProfileScreen({
  onBack,
  onHome,
  onResources,
  onRequests,
  onLogout,
}: Props) {
  const openOption = (label: string) => {
    Alert.alert(label, `${label} settings can be connected here.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAF8" />

      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <Text style={styles.statusIcons}>▴  ▰  ●</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.organizationAvatar}>
            <Text style={styles.avatarIcon}>♟</Text>
          </View>

          <View style={styles.organizationInfo}>
            <Text style={styles.organizationName}>Helping Hands NGO</Text>

            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedCheck}>✓</Text>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>

            <Text style={styles.organizationType}>
              NGO / Non-Profit Organization
            </Text>
            <Text style={styles.joinedText}>Joined on 5 Apr 2025</Text>
          </View>
        </View>

        <View style={styles.optionsCard}>
          {profileOptions.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.optionRow,
                index !== profileOptions.length - 1 &&
                  styles.optionDivider,
              ]}
              onPress={() => openOption(item.label)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconWrap}>
                <Text style={styles.optionIcon}>{item.icon}</Text>
              </View>

              <Text style={styles.optionLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() =>
            Alert.alert("Log Out", "Do you want to return to the welcome screen?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: onLogout },
            ])
          }
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>PRAVAH AI • Provider Account</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { label: "Home", icon: "⌂", action: onHome },
          { label: "Resources", icon: "▤", action: onResources },
          { label: "Requests", icon: "▣", action: onRequests },
          { label: "Profile", icon: "♙", action: () => {} },
        ].map((item) => {
          const active = item.label === "Profile";
          return (
            <TouchableOpacity
              key={item.label}
              style={styles.navItem}
              onPress={item.action}
            >
              <Text style={[styles.navIcon, active && styles.navActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, active && styles.navActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FAF8" },
  statusBar: {
    height: 27,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 17,
  },
  time: { fontSize: 11, color: "#193E38", fontWeight: "800" },
  statusIcons: { fontSize: 10, color: "#193E38" },
  header: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EFEB",
  },
  backButton: { width: 34 },
  backArrow: { fontSize: 29, color: "#244D45" },
  headerTitle: { fontSize: 15, color: "#244D45", fontWeight: "800" },
  content: { padding: 14, paddingBottom: 25 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 17,
    paddingHorizontal: 7,
    marginBottom: 9,
  },
  organizationAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#07584F",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { color: "#FFFFFF", fontSize: 27 },
  organizationInfo: { flex: 1 },
  organizationName: {
    color: "#244D45",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#DDF6E9",
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
    marginBottom: 5,
  },
  verifiedCheck: { fontSize: 9, color: "#07866D", fontWeight: "900" },
  verifiedText: { fontSize: 9, color: "#07866D", fontWeight: "800" },
  organizationType: { fontSize: 9, color: "#648078", marginBottom: 3 },
  joinedText: { fontSize: 9, color: "#81938F" },
  optionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1ECE7",
    paddingHorizontal: 11,
  },
  optionRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  optionIconWrap: {
    width: 21,
    alignItems: "center",
  },
  optionIcon: { fontSize: 15, color: "#07866D", fontWeight: "800" },
  optionLabel: { flex: 1, color: "#42635C", fontSize: 10, fontWeight: "600" },
  chevron: { fontSize: 22, color: "#7E9990" },
  logoutButton: {
    minHeight: 45,
    backgroundColor: "#B8E3D9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  logoutText: { color: "#244D45", fontSize: 11, fontWeight: "900" },
  versionText: {
    textAlign: "center",
    color: "#91A59F",
    fontSize: 9,
    marginTop: 15,
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
