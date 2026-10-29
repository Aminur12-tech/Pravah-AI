
import React, { useState } from "react";
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
  onBack: () => void;
  onOpenRequest: (requestId: string) => void;
  onHome: () => void;
  onResources: () => void;
  onRequests: () => void;
  onProfile: () => void;
};

type RequestItem = {
  id: string;
  category: string;
  title: string;
  location: string;
  requested: string;
  needs: string;
  priority: "High Priority" | "Medium Priority" | "Low Priority";
  icon: string;
  color: string;
  background: string;
};

const requests: RequestItem[] = [
  {
    id: "PRV-001",
    category: "Food",
    title: "Drinking water and food supplies",
    location: "Kamrup, 5 km",
    requested: "200 packs",
    needs: "180 packs",
    priority: "High Priority",
    icon: "♟",
    color: "#1688F8",
    background: "#E7F3FF",
  },
  {
    id: "PRV-002",
    category: "Medical",
    title: "First aid kits and medicines",
    location: "Beltola, 8 km",
    requested: "50 kits",
    needs: "20 kits",
    priority: "Medium Priority",
    icon: "✚",
    color: "#F28B25",
    background: "#FFF0E2",
  },
  {
    id: "PRV-003",
    category: "Shelter",
    title: "Blankets and sleeping mats",
    location: "Dispur, 12 km",
    requested: "100 mats",
    needs: "60 mats",
    priority: "Low Priority",
    icon: "⌂",
    color: "#087C68",
    background: "#E1F5EE",
  },
];

const filters = ["All", "Food", "Medical", "Shelter", "Other"];

export default function NearbyRequestsScreen({
  onBack,
  onOpenRequest,
  onHome,
  onResources,
  onRequests,
  onProfile,
}: Props) {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleRequests =
    activeFilter === "All"
      ? requests
      : requests.filter((request) => request.category === activeFilter);

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

        <Text style={styles.headerTitle}>Nearby Requests</Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter("All")}
          accessibilityLabel="Reset filters"
        >
          <Text style={styles.filterIcon}>☷</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        {filters.map((filter) => {
          const active = filter === activeFilter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  active && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {visibleRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySubtitle}>
              Try selecting another category.
            </Text>
          </View>
        ) : (
          visibleRequests.map((request) => (
            <View style={styles.requestCard} key={request.id}>
              <View
                style={[
                  styles.requestIcon,
                  { backgroundColor: request.background },
                ]}
              >
                <Text style={[styles.requestIconText, { color: request.color }]}>
                  {request.icon}
                </Text>
              </View>

              <View style={styles.requestInfo}>
                <View style={styles.priorityRow}>
                  <View
                    style={[
                      styles.priorityBadge,
                      request.priority === "High Priority" &&
                        styles.highPriority,
                      request.priority === "Medium Priority" &&
                        styles.mediumPriority,
                      request.priority === "Low Priority" &&
                        styles.lowPriority,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        request.priority === "High Priority" &&
                          styles.highPriorityText,
                        request.priority === "Medium Priority" &&
                          styles.mediumPriorityText,
                        request.priority === "Low Priority" &&
                          styles.lowPriorityText,
                      ]}
                    >
                      {request.priority}
                    </Text>
                  </View>
                </View>

                <Text style={styles.requestTitle}>{request.title}</Text>

                <Text style={styles.detailLine}>
                  <Text style={styles.detailSymbol}>⌖ </Text>
                  {request.location}
                </Text>

                <Text style={styles.detailLine}>
                  <Text style={styles.detailSymbol}>▤ </Text>
                  Requested: {request.requested}
                </Text>

                <Text style={styles.detailLine}>
                  <Text style={styles.detailSymbol}>♧ </Text>
                  Needs: {request.needs}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => onOpenRequest(request.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          { label: "Home", icon: "⌂", action: onHome },
          { label: "Resources", icon: "▤", action: onResources },
          { label: "Requests", icon: "▣", action: onRequests },
          { label: "Profile", icon: "♙", action: onProfile },
        ].map((item) => {
          const active = item.label === "Requests";
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
  headerRow: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backButton: {
    width: 34,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  backArrow: { fontSize: 29, color: "#244D45" },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    color: "#244D45",
    fontWeight: "800",
  },
  filterButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: { fontSize: 20, color: "#42635C" },
  filtersRow: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  filterChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F0ED",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  filterChipActive: { backgroundColor: "#087C68" },
  filterText: { color: "#648078", fontSize: 9, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },
  listContent: { paddingHorizontal: 13, paddingTop: 5, paddingBottom: 18 },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1ECE7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  requestIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  requestIconText: { fontSize: 19, fontWeight: "800" },
  requestInfo: { flex: 1, minWidth: 0 },
  priorityRow: { flexDirection: "row", marginBottom: 5 },
  priorityBadge: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  highPriority: { backgroundColor: "#FFE7E7" },
  mediumPriority: { backgroundColor: "#FFF0D8" },
  lowPriority: { backgroundColor: "#E0F5E9" },
  priorityText: { fontSize: 8, fontWeight: "800" },
  highPriorityText: { color: "#E44D57" },
  mediumPriorityText: { color: "#C27A1A" },
  lowPriorityText: { color: "#087C68" },
  requestTitle: {
    color: "#31534D",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 5,
    lineHeight: 14,
  },
  detailLine: {
    fontSize: 9,
    color: "#648078",
    lineHeight: 15,
  },
  detailSymbol: { color: "#087C68", fontWeight: "800" },
  detailsButton: {
    width: "78%",
    marginLeft: "15%",
    marginTop: 7,
    backgroundColor: "#089574",
    borderRadius: 7,
    minHeight: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsButtonText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800" },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 13, fontWeight: "800", color: "#31534D" },
  emptySubtitle: { fontSize: 10, color: "#81938F", marginTop: 6 },
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
