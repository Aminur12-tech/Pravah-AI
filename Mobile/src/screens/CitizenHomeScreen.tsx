
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";

type Props = {
  onNavigate?: (screen: string) => void;
};

export default function CitizenHomeScreen({ onNavigate }: Props) {
  const openFeature = (feature: string) => {
    if (onNavigate) {
      onNavigate(feature);
    } else {
      Alert.alert(feature, `${feature} will be available here.`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FBFA" />

      <View style={styles.phoneStatus}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>▴  ▰  ●</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Priya!</Text>
            <Text style={styles.subtitle}>
              Stay safe. Report issues. Help your community.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => openFeature("Notifications")}
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
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <TouchableOpacity onPress={() => openFeature("All Alerts")}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.alertCard}
          onPress={() => openFeature("Heavy rainfall alert")}
          activeOpacity={0.8}
        >
          <View style={styles.alertIcon}>
            <Text style={styles.alertEmoji}>🌧️</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>
              Heavy rainfall expected in your area
            </Text>
            <Text style={styles.alertMeta}>IMD · 2 hours ago</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

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
      style={[styles.actionCard, { backgroundColor: background, borderColor: border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.actionIcon, { backgroundColor: color }]}>
        <Text style={styles.actionEmoji}>{icon}</Text>
      </View>
      <Text style={[styles.actionTitle, { color }]}>{title}</Text>
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
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
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
    fontSize: 11,
    fontWeight: "700",
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
  greeting: {
    fontSize: 23,
    fontWeight: "800",
    color: "#17443E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: "#54716D",
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
    marginBottom: 14,
  },
  alertIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  alertEmoji: {
    fontSize: 17,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    color: "#244D48",
  },
  alertMeta: {
    marginTop: 4,
    fontSize: 10,
    color: "#7B918D",
  },
  chevron: {
    fontSize: 23,
    color: "#8CA6A1",
    paddingLeft: 5,
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
