
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MyContributionsScreenProps = {
  onBack: () => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onProfile: () => void;
};

export default function MyContributionsScreen({
  onBack,
  onHome,
  onResources,
  onRequests,
  onProfile,
}: MyContributionsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>RESOURCE PROVIDER</Text>
        <Text style={styles.title}>My Contributions</Text>
        <Text style={styles.subtitle}>
          Your community support and resource contributions.
        </Text>

        <View style={styles.card}>
          <Text style={styles.icon}>🤝</Text>
          <Text style={styles.cardTitle}>Your impact starts here</Text>
          <Text style={styles.description}>
            Your contributions will be displayed here when the resource
            contribution data is connected to the backend.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Quick navigation</Text>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onHome}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.activeButton]}
          onPress={onResources}
        >
          <Text style={[styles.navText, styles.activeText]}>
            My Contributions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onRequests}
        >
          <Text style={styles.navText}>Nearby Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onProfile}
        >
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8F7",
  },
  content: {
    flexGrow: 1,
    padding: 22,
    paddingBottom: 36,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 18,
  },
  backText: {
    color: "#087C68",
    fontSize: 15,
    fontWeight: "700",
  },
  eyebrow: {
    color: "#087C68",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: "#173F35",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 8,
  },
  subtitle: {
    color: "#60766D",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0EBE6",
    marginBottom: 28,
  },
  icon: {
    fontSize: 42,
    marginBottom: 14,
  },
  cardTitle: {
    color: "#173F35",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    color: "#60766D",
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#173F35",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  navButton: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0EBE6",
    marginBottom: 10,
  },
  activeButton: {
    backgroundColor: "#E4F4ED",
    borderColor: "#087C68",
  },
  navText: {
    color: "#35594E",
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {
    color: "#087C68",
    fontWeight: "800",
  },
});
