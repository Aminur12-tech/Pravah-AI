
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
  onOfferSupport: () => void;
};

const requiredResources = [
  {
    icon: "◉",
    name: "Drinking Water Kits",
    quantity: "200 packs",
    needed: "180 still needed",
    color: "#079A86",
    background: "#E0F5EE",
  },
  {
    icon: "✚",
    name: "Food Packets",
    quantity: "200 packs",
    needed: "150 still needed",
    color: "#F28B25",
    background: "#FFF0E2",
  },
  {
    icon: "▰",
    name: "Blankets",
    quantity: "100 pcs",
    needed: "60 still needed",
    color: "#8A5D4D",
    background: "#F4E9E4",
  },
];

export default function RequestDetailsScreen({
  onBack,
  onOfferSupport,
}: Props) {
  const handleOfferSupport = () => {
    Alert.alert(
      "Offer Support",
      "Would you like to offer resources for this request?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue", onPress: onOfferSupport },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FAF8" />

      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <Text style={styles.statusIcons}>▴  ▰  ●</Text>
      </View>

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.priorityRow}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityIcon}>⚠</Text>
            <Text style={styles.priorityText}>High Priority</Text>
          </View>
        </View>

        <Text style={styles.requestTitle}>
          Drinking water and food supplies
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <View style={styles.metaIconBlue}>
              <Text style={styles.metaIconText}>◆</Text>
            </View>
            <Text style={styles.metaText}>Flood</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.locationIcon}>⌖</Text>
            <Text style={styles.metaText}>Kamalpur</Text>
          </View>
        </View>

        <View style={styles.affectedRow}>
          <Text style={styles.affectedIcon}>♟</Text>
          <Text style={styles.affectedLabel}>Affected People:</Text>
          <Text style={styles.affectedValue}>50+</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Families are stranded due to rising water levels. Need drinking
            water, packed food and basic supplies.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Required Resources</Text>

        <View style={styles.resourcesCard}>
          {requiredResources.map((resource, index) => (
            <View
              key={resource.name}
              style={[
                styles.resourceRow,
                index !== requiredResources.length - 1 &&
                  styles.resourceDivider,
              ]}
            >
              <View
                style={[
                  styles.resourceIcon,
                  { backgroundColor: resource.background },
                ]}
              >
                <Text
                  style={[styles.resourceIconText, { color: resource.color }]}
                >
                  {resource.icon}
                </Text>
              </View>

              <View style={styles.resourceInfo}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourceQuantity}>
                  {resource.quantity}
                </Text>
                <Text style={styles.resourceNeeded}>{resource.needed}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.supportButton}
          onPress={handleOfferSupport}
          activeOpacity={0.85}
        >
          <Text style={styles.supportButtonText}>Offer Support</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Sample incident information for demonstration purposes.
        </Text>
      </ScrollView>
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
  headerRow: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  backButton: {
    width: 34,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backArrow: { fontSize: 29, color: "#244D45" },
  headerTitle: { fontSize: 15, color: "#244D45", fontWeight: "800" },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 25 },
  priorityRow: { flexDirection: "row", marginBottom: 9 },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#FFE7E7",
  },
  priorityIcon: { color: "#E44D57", fontSize: 10 },
  priorityText: { color: "#E44D57", fontSize: 9, fontWeight: "800" },
  requestTitle: {
    color: "#244D45",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "900",
    marginBottom: 13,
  },
  metaRow: { flexDirection: "row", gap: 20, marginBottom: 13 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaIconBlue: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E5F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  metaIconText: { color: "#1688F8", fontSize: 8 },
  locationIcon: { fontSize: 17, color: "#648078" },
  metaText: { color: "#648078", fontSize: 10, fontWeight: "700" },
  affectedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2ECE8",
    marginBottom: 16,
    gap: 7,
  },
  affectedIcon: { color: "#648078", fontSize: 14 },
  affectedLabel: { color: "#42635C", fontSize: 10, flex: 1 },
  affectedValue: { color: "#31534D", fontSize: 10, fontWeight: "800" },
  sectionTitle: {
    color: "#31534D",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE7",
    borderRadius: 10,
    padding: 11,
    marginBottom: 16,
  },
  descriptionText: {
    color: "#648078",
    fontSize: 10,
    lineHeight: 16,
  },
  resourcesCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE7",
    borderRadius: 11,
    paddingHorizontal: 11,
    marginBottom: 17,
  },
  resourceRow: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    gap: 9,
  },
  resourceDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  resourceIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceIconText: { fontSize: 13, fontWeight: "900" },
  resourceInfo: { flex: 1 },
  resourceName: { color: "#42635C", fontSize: 10, fontWeight: "800" },
  resourceQuantity: {
    color: "#648078",
    fontSize: 9,
    textAlign: "right",
    marginTop: 3,
  },
  resourceNeeded: {
    color: "#E44D57",
    fontSize: 9,
    textAlign: "right",
    marginTop: 3,
  },
  supportButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#089574",
    alignItems: "center",
    justifyContent: "center",
  },
  supportButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  disclaimer: {
    color: "#81938F",
    fontSize: 9,
    textAlign: "center",
    marginTop: 11,
  },
});
