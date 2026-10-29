
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";

type Props = {
  onBack: () => void;
  onSubmitFeedback: () => void;
};

const steps = [
  { title: "Submitted", time: "2h ago", state: "done" },
  { title: "Under Review", time: "1h ago", state: "done" },
  { title: "Resources Assigned", time: "30m ago", state: "done" },
  { title: "In Progress", time: "Now", state: "current" },
  { title: "Resolved", time: "Pending", state: "pending" },
];

export default function TrackProgressScreen({
  onBack,
  onSubmitFeedback,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitFeedback = () => {
    if (rating === 0) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }

    Alert.alert(
      "Feedback submitted",
      "Thank you for providing feedback. This demo does not yet save feedback to a server.",
      [{ text: "OK", onPress: onSubmitFeedback }]
    );
  };

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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Track Progress & Feedback</Text>

        <View style={styles.timelineCard}>
          {steps.map((step, index) => {
            const completed = step.state === "done";
            const current = step.state === "current";

            return (
              <View key={step.title} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      completed && styles.doneDot,
                      current && styles.currentDot,
                    ]}
                  />
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        index < 3 && styles.doneLine,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      current && styles.currentTitle,
                      step.state === "pending" && styles.pendingTitle,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>

                {current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>CURRENT</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.statusUpdateCard}>
          <Text style={styles.sectionTitle}>Status Update</Text>
          <Text style={styles.updateText}>
            Water kits have been dispatched and are on their way to your area.
          </Text>
          <Text style={styles.updateTime}>Response team · Recently</Text>
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.sectionTitle}>Provide Feedback</Text>
          <Text style={styles.ratingHint}>
            How satisfied are you with the response?
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                accessibilityLabel={`${star} star rating`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.star,
                    star <= rating && styles.selectedStar,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            style={styles.commentInput}
            placeholder="Add a comment (optional)"
            placeholderTextColor="#8AA09A"
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <Text style={styles.characterCount}>
            {comment.length}/500
          </Text>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitFeedback}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: { padding: 16, paddingBottom: 28 },
  pageTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#244D48",
    marginBottom: 13,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingTop: 15,
    paddingBottom: 5,
    marginBottom: 15,
  },
  timelineRow: { flexDirection: "row", minHeight: 56 },
  timelineRail: {
    width: 25,
    alignItems: "center",
    marginRight: 9,
  },
  timelineDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#9BC8C0",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  doneDot: {
    borderColor: "#087C68",
    backgroundColor: "#087C68",
  },
  currentDot: {
    width: 15,
    height: 15,
    borderColor: "#087C68",
    backgroundColor: "#BDEBE0",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#D6E7E3",
    marginTop: -1,
  },
  doneLine: { backgroundColor: "#087C68" },
  stepContent: { flex: 1, paddingBottom: 12 },
  stepTitle: { fontSize: 12, fontWeight: "700", color: "#31534E" },
  currentTitle: { color: "#087C68", fontWeight: "800" },
  pendingTitle: { color: "#8CA19C" },
  stepTime: { fontSize: 10, color: "#81938F", marginTop: 4 },
  currentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E5F6F0",
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  currentBadgeText: {
    fontSize: 8,
    color: "#087C68",
    fontWeight: "800",
  },
  statusUpdateCard: {
    padding: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 13,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: "#244D48" },
  updateText: {
    fontSize: 11,
    lineHeight: 17,
    color: "#42645E",
    marginTop: 9,
  },
  updateTime: { fontSize: 9, color: "#81938F", marginTop: 7 },
  feedbackCard: {
    padding: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0EFEB",
    borderRadius: 13,
  },
  ratingHint: { fontSize: 10, color: "#718A84", marginTop: 8 },
  starsRow: { flexDirection: "row", gap: 7, marginTop: 7, marginBottom: 12 },
  star: { fontSize: 27, color: "#D5E0DC" },
  selectedStar: { color: "#F5B544" },
  commentInput: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: "#D8E9E4",
    borderRadius: 9,
    padding: 10,
    fontSize: 11,
    color: "#31534E",
    backgroundColor: "#FFFFFF",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 9,
    color: "#81938F",
    marginTop: 4,
    marginBottom: 10,
  },
  submitButton: {
    minHeight: 44,
    borderRadius: 9,
    backgroundColor: "#087C68",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});
