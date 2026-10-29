
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

type Props = {
  onBack: () => void;
  onTrackProgress: () => void;
};

export default function ReportDetailsScreen({
  onBack,
  onTrackProgress,
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5FBFA" />

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>9:41</Text>
        <Text style={styles.statusText}>▴  ▰  ●</Text>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report #PRAV-001</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <View style={styles.highBadge}>
            <Text style={styles.highBadgeText}>▲  High Priority</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>In Progress</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>AI Analysis</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.analysisCard}>
          <InfoRow label="Category:" value="Flood" />
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Priority:</Text>
            <View style={styles.priorityPill}>
              <Text style={styles.priorityText}>High</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Reason:</Text>
            <Text style={styles.infoValue}>
              Rising water levels, multiple households affected.
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Needs:</Text>
            <Text style={styles.infoValue}>
              Water, Rescue, Food
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Related Reports (2)</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linkCard}>
          <RelatedReport title="PRAV-005 (0.82)" />
          <View style={styles.separator} />
          <RelatedReport title="PRAV-006 (0.67)" />
        </View>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Assigned Resources</Text>
          <Text style={styles.chevron}>›</Text>
        </View>

        <View style={styles.resourceCard}>
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceName}>◉  Water Kits</Text>
            <Text style={styles.resourceCount}>20 (of 50)</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.timelineButton}
          onPress={onTrackProgress}
          activeOpacity={0.85}
        >
          <Text style={styles.timelineButtonText}>View Timeline</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          AI analysis is a demo example and should be verified by response teams.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function RelatedReport({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.relatedRow}>
      <Text style={styles.relatedIcon}>◉</Text>
      <Text style={styles.relatedText}>{title}</Text>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FBFA" },
  statusBar: {
    height: 24,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: { fontSize: 11, color: "#284744", fontWeight: "700" },
  header: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 30 },
  backArrow: { fontSize: 31, color: "#087C68" },
  headerTitle: { fontSize: 14, fontWeight: "800", color: "#17443E" },
  headerSpacer: { width: 30 },
  content: { paddingHorizontal: 16, paddingTop: 9, paddingBottom: 24 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 16,
  },
  highBadge: {
    backgroundColor: "#FFF0EF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  highBadgeText: { color: "#E34E4E", fontSize: 10, fontWeight: "800" },
  progressBadge: {
    backgroundColor: "#E8F4FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  progressBadgeText: { color: "#287DB9", fontSize: 10, fontWeight: "800" },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    marginTop: 4,
  },
  sectionTitle: { color: "#244D48", fontSize: 13, fontWeight: "800" },
  chevron: { fontSize: 20, color: "#829A95" },
  viewAll: { color: "#087C68", fontSize: 10, fontWeight: "800" },
  analysisCard: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
  },
  infoBlock: { paddingVertical: 10 },
  infoLabel: { fontSize: 11, fontWeight: "800", color: "#4A6862", marginBottom: 4 },
  infoValue: { flex: 1, fontSize: 11, lineHeight: 16, color: "#31534E" },
  separator: { height: 1, backgroundColor: "#EAF2EF" },
  priorityPill: {
    backgroundColor: "#FFF0EF",
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: { color: "#E34E4E", fontSize: 10, fontWeight: "800" },
  linkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0EFEB",
    paddingHorizontal: 11,
    marginBottom: 15,
  },
  relatedRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 37,
    gap: 8,
  },
  relatedIcon: { color: "#087C68", fontSize: 13 },
  relatedText: { flex: 1, fontSize: 11, color: "#31534E", fontWeight: "600" },
  resourceCard: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 12,
    marginBottom: 18,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  resourceName: { fontSize: 11, fontWeight: "700", color: "#31534E" },
  resourceCount: { fontSize: 10, color: "#64817B" },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#E4F0EC",
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    width: "40%",
    borderRadius: 4,
    backgroundColor: "#0B8B70",
  },
  timelineButton: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#087C68",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  disclaimer: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 9,
    lineHeight: 14,
    color: "#81938F",
  },
});
