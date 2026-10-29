
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { apiRequest } from "../services/api";

type Incident = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status?: string;
  location: {
    address: string;
  };
  urgentNeeds?: string[];
  createdAt?: string;
};

type IncidentListResponse = {
  success: boolean;
  data: Incident[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

type Props = {
  onBack: () => void;
  onSelectIncident: (id: string) => void;
};

function readable(value?: string): string {
  if (!value) return "Unknown";
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function IncidentListScreen({
  onBack,
  onSelectIncident,
}: Props) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadIncidents = useCallback(async () => {
    try {
      setError("");

      const result = await apiRequest<IncidentListResponse>(
        "/incidents?page=1&limit=50"
      );

      setIncidents(result.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load incidents."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void loadIncidents();
  }, [loadIncidents]);

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.eyebrow}>COMMUNITY INCIDENTS</Text>
      <Text style={styles.heading}>Incident reports</Text>
      <Text style={styles.subtitle}>
        Latest reports received by PRAVAH AI.
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#167D76" />
          <Text style={styles.message}>Loading reports...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Could not load reports</Text>
          <Text style={styles.message}>{error}</Text>
          <Pressable onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          contentContainerStyle={
            incidents.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#167D76"
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.message}>
                Submitted incident reports will appear here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelectIncident(item._id)}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.category}>
                  {readable(item.category)}
                </Text>
                <Text style={styles.status}>
                  {readable(item.status ?? "submitted")}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>

              <Text style={styles.location} numberOfLines={2}>
                📍 {item.location?.address ?? "Location not provided"}
              </Text>

              {item.createdAt ? (
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              ) : null}

              <Text style={styles.openText}>View details →</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingTop: 12,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  backText: {
    color: "#344054",
    fontSize: 16,
    fontWeight: "600",
  },
  eyebrow: {
    color: "#167D76",
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    marginHorizontal: 22,
    marginBottom: 9,
  },
  heading: {
    color: "#172033",
    fontSize: 27,
    fontWeight: "800",
    marginHorizontal: 22,
  },
  subtitle: {
    color: "#667085",
    fontSize: 14,
    marginHorizontal: 22,
    marginTop: 7,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E5EAF1",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  category: {
    color: "#167D76",
    backgroundColor: "#DDF5F0",
    overflow: "hidden",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "800",
  },
  status: {
    color: "#667085",
    fontSize: 11,
    fontWeight: "700",
  },
  cardTitle: {
    color: "#172033",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },
  description: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 20,
  },
  location: {
    color: "#475467",
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
  date: {
    color: "#98A2B3",
    fontSize: 11,
    marginTop: 9,
  },
  openText: {
    color: "#167D76",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 13,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    color: "#667085",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
  },
  emptyTitle: {
    color: "#172033",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  errorTitle: {
    color: "#B42318",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#167D76",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
