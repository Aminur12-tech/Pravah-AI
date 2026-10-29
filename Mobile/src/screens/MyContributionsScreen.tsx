
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiRequest } from "../services/api";

type Props = {
  onBack: () => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onProfile: () => void;
};

type Resource = {
  _id: string;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  unit: string;
  status: "available" | "limited" | "unavailable";
  location?: {
    address?: string;
  };
  createdAt?: string;
};

type ResourcesResponse = {
  success: boolean;
  data: Resource[];
  count?: number;
  message?: string;
};

const typeLabels: Record<string, string> = {
  drinking_water: "Drinking Water",
  food: "Food & Nutrition",
  medicine: "Medical Supplies",
  first_aid: "First Aid",
  blankets: "Blankets",
  clothing: "Clothing",
  shelter: "Shelter",
  rescue_equipment: "Rescue Equipment",
  other: "Other",
};

const statusLabels: Record<Resource["status"], string> = {
  available: "Available",
  limited: "Limited",
  unavailable: "Unavailable",
};

export default function MyContributionsScreen({
  onBack,
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

      if (!response.success || !Array.isArray(response.data)) {
        throw new Error(response.message || "Unexpected resource response.");
      }

      setResources(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your contributions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever this screen is opened.
  // This component does not require React Navigation to be installed.
  React.useEffect(() => {
    loadResources();
  }, [loadResources]);

  const totalItems = resources.length;
  const availableItems = resources.filter(
    (resource) => resource.status === "available"
  ).length;
  const totalQuantity = resources.reduce(
    (sum, resource) => sum + (Number(resource.quantity) || 0),
    0
  );

  const confirmDeactivate = (resource: Resource) => {
    Alert.alert(
      "Deactivate resource?",
      `${resource.name} will no longer appear in active resource listings.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(`/resources/${resource._id}`, {
                method: "DELETE",
              });
              await loadResources(true);
              Alert.alert("Resource deactivated", "Your resource was removed from active listings.");
            } catch (err) {
              Alert.alert(
                "Could not deactivate",
                err instanceof Error ? err.message : "Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F8F7" />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => loadResources(true)}
          accessibilityLabel="Refresh contributions"
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>↻ Refresh</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadResources(true)}
            tintColor="#087C68"
          />
        }
      >
        <Text style={styles.eyebrow}>RESOURCE PROVIDER</Text>
        <Text style={styles.title}>My Contributions</Text>
        <Text style={styles.subtitle}>
          Manage the resources you have shared with your community.
        </Text>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#087C68" />
            <Text style={styles.loadingText}>Loading your resources…</Text>
          </View>
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>Unable to load resources</Text>
            <Text style={styles.description}>{error}</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => loadResources()}
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalItems}</Text>
                <Text style={styles.statLabel}>Resources</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{availableItems}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalQuantity}</Text>
                <Text style={styles.statLabel}>Total Quantity</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your resources</Text>
              <Text style={styles.countText}>{resources.length} items</Text>
            </View>

            {resources.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.icon}>🤝</Text>
                <Text style={styles.cardTitle}>Your impact starts here</Text>
                <Text style={styles.description}>
                  You haven't added any resources yet. Add your first resource
                  to make it visible in your resource listings.
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onResources}
                >
                  <Text style={styles.primaryButtonText}>Add a Resource</Text>
                </TouchableOpacity>
              </View>
            ) : (
              resources.map((resource) => (
                <View key={resource._id} style={styles.resourceCard}>
                  <View style={styles.resourceHeader}>
                    <View style={styles.resourceTitleWrap}>
                      <Text style={styles.resourceName}>{resource.name}</Text>
                      <Text style={styles.resourceType}>
                        {typeLabels[resource.type] || resource.type}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        resource.status === "available" && styles.availableBadge,
                        resource.status === "limited" && styles.limitedBadge,
                        resource.status === "unavailable" && styles.unavailableBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {statusLabels[resource.status] || resource.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.quantity}>
                    {resource.quantity} {resource.unit}
                  </Text>

                  {!!resource.location?.address && (
                    <Text style={styles.detailText}>
                      ⌖ {resource.location.address}
                    </Text>
                  )}

                  {!!resource.description && (
                    <Text style={styles.description}>
                      {resource.description}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={styles.deactivateButton}
                    onPress={() => confirmDeactivate(resource)}
                  >
                    <Text style={styles.deactivateText}>Deactivate resource</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>Quick navigation</Text>

        <TouchableOpacity style={styles.navButton} onPress={onHome}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.activeButton]}
          onPress={onResources}
        >
          <Text style={[styles.navText, styles.activeText]}>
            My Contributions / Resources
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onRequests}>
          <Text style={styles.navText}>Nearby Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onProfile}>
          <Text style={styles.navText}>My Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F8F7" },
  content: { flexGrow: 1, padding: 22, paddingBottom: 36 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  backButton: { paddingVertical: 10, marginBottom: 8 },
  backText: { color: "#087C68", fontSize: 15, fontWeight: "700" },
  refreshButton: { paddingVertical: 10, paddingHorizontal: 8 },
  refreshText: { color: "#087C68", fontSize: 12, fontWeight: "700" },
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
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0EBE6",
    padding: 12,
  },
  statNumber: { color: "#087C68", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#60766D", fontSize: 10, marginTop: 5 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#173F35",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  countText: { color: "#60766D", fontSize: 11 },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: { color: "#60766D", fontSize: 13, marginTop: 12 },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0EBE6",
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
  icon: { fontSize: 42, marginBottom: 14 },
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
    marginTop: 8,
  },
  resourceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0EBE6",
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  resourceTitleWrap: { flex: 1 },
  resourceName: {
    color: "#173F35",
    fontSize: 15,
    fontWeight: "800",
  },
  resourceType: { color: "#60766D", fontSize: 11, marginTop: 5 },
  statusBadge: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  availableBadge: { backgroundColor: "#E0F5E9" },
  limitedBadge: { backgroundColor: "#FFF0D8" },
  unavailableBadge: { backgroundColor: "#E8EEEC" },
  statusText: { color: "#31534D", fontSize: 10, fontWeight: "700" },
  quantity: {
    color: "#087C68",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 14,
  },
  detailText: { color: "#60766D", fontSize: 12, marginTop: 10 },
  deactivateButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#FFF0F0",
  },
  deactivateText: { color: "#C04444", fontSize: 11, fontWeight: "700" },
  primaryButton: {
    backgroundColor: "#087C68",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  navButton: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0EBE6",
    marginBottom: 10,
  },
  activeButton: { backgroundColor: "#E4F4ED", borderColor: "#087C68" },
  navText: { color: "#35594E", fontSize: 14, fontWeight: "600" },
  activeText: { color: "#087C68", fontWeight: "800" },
});
