
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
  onSubmit: () => void;
};

type Urgency = "Water" | "Food" | "Rescue";

export default function ReportFormScreen({
  onBack,
  onSubmit,
}: Props) {
  const [location, setLocation] = useState("26.1445, 91.7362");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("Water");
  const [photoCount, setPhotoCount] = useState(0);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert(
        "Description required",
        "Please describe the incident before submitting."
      );
      return;
    }

    Alert.alert(
      "Report submitted",
      "Your report has been prepared. Connect a backend to save and share it with response teams.",
      [
        {
          text: "OK",
          onPress: onSubmit,
        },
      ]
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
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Flood Report</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Location</Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          style={styles.locationInput}
          placeholder="Enter location coordinates"
          placeholderTextColor="#829792"
          accessibilityLabel="Location coordinates"
        />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.mapPreview}
          onPress={() =>
            Alert.alert(
              "Location",
              "Map selection can be connected in the next version."
            )
          }
        >
          <View style={styles.roadOne} />
          <View style={styles.roadTwo} />
          <View style={styles.roadThree} />
          <View style={styles.greenAreaOne} />
          <View style={styles.greenAreaTwo} />
          <View style={styles.waterArea} />
          <View style={styles.mapPin}>
            <Text style={styles.mapPinText}>●</Text>
          </View>
          <Text style={styles.mapHint}>Tap to select location</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.descriptionInput}
          placeholder="Water is entering our homes and road is blocked."
          placeholderTextColor="#718681"
          multiline
          textAlignVertical="top"
          maxLength={500}
          accessibilityLabel="Incident description"
        />

        <Text style={styles.characterCount}>
          {description.length}/500
        </Text>

        <View style={styles.photoHeader}>
          <Text style={styles.label}>Photos (optional)</Text>
          <Text style={styles.optionalHint}>Up to 3 photos</Text>
        </View>

        <View style={styles.photoRow}>
          {Array.from({ length: 3 }, (_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.photoBox,
                index < photoCount && styles.photoAdded,
              ]}
              onPress={() => {
                if (index < photoCount) {
                  Alert.alert(
                    "Photo",
                    "Photo gallery integration can be added next."
                  );
                  return;
                }

                if (photoCount < 3) {
                  Alert.alert(
                    "Add photo",
                    "Camera and gallery access are not connected yet. This is a preview placeholder."
                  );
                }
              }}
            >
              {index < photoCount ? (
                <Text style={styles.photoEmoji}>🖼️</Text>
              ) : (
                <Text style={styles.photoPlus}>+</Text>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => {
              if (photoCount >= 3) {
                Alert.alert("Photo limit", "You can add up to 3 photos.");
              } else {
                Alert.alert(
                  "Photos",
                  "Photo picker integration will be added next."
                );
              }
            }}
          >
            <Text style={styles.addPhotoPlus}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Urgent Needs</Text>

        <View style={styles.urgencyRow}>
          <UrgencyButton
            label="Water"
            selected={urgency === "Water"}
            color="#1685A8"
            onPress={() => setUrgency("Water")}
          />
          <UrgencyButton
            label="Food"
            selected={urgency === "Food"}
            color="#E49A35"
            onPress={() => setUrgency("Food")}
          />
          <UrgencyButton
            label="Rescue"
            selected={urgency === "Rescue"}
            color="#E45A5A"
            onPress={() => setUrgency("Rescue")}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Please provide accurate information to help responders.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

type UrgencyButtonProps = {
  label: Urgency;
  selected: boolean;
  color: string;
  onPress: () => void;
};

function UrgencyButton({
  label,
  selected,
  color,
  onPress,
}: UrgencyButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.urgencyButton,
        {
          borderColor: color,
          backgroundColor: selected ? color : "#FFFFFF",
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.urgencyText,
          { color: selected ? "#FFFFFF" : color },
        ]}
      >
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
  statusBar: {
    height: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#284744",
  },
  header: {
    minHeight: 48,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E2EFEC",
  },
  backButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 32,
    color: "#087C68",
    lineHeight: 36,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#17443E",
  },
  headerSpacer: {
    width: 38,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#31534E",
    marginBottom: 7,
  },
  locationInput: {
    height: 39,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#CDE3DE",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    color: "#31534E",
    fontSize: 12,
    marginBottom: 7,
  },
  mapPreview: {
    height: 105,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D5E8D9",
    backgroundColor: "#E6F2E3",
    marginBottom: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  roadOne: {
    position: "absolute",
    height: 13,
    width: "120%",
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-15deg" }],
  },
  roadTwo: {
    position: "absolute",
    height: 150,
    width: 10,
    left: "35%",
    backgroundColor: "#FDFDF7",
    transform: [{ rotate: "25deg" }],
  },
  roadThree: {
    position: "absolute",
    height: 9,
    width: "100%",
    top: 24,
    backgroundColor: "#FDFDF7",
    transform: [{ rotate: "13deg" }],
  },
  greenAreaOne: {
    position: "absolute",
    width: 80,
    height: 45,
    top: 5,
    left: 12,
    backgroundColor: "#C4E3BB",
    borderRadius: 20,
  },
  greenAreaTwo: {
    position: "absolute",
    width: 95,
    height: 35,
    bottom: 4,
    right: 10,
    backgroundColor: "#B5DBAC",
    borderRadius: 20,
  },
  waterArea: {
    position: "absolute",
    width: 50,
    height: 20,
    bottom: 12,
    left: 15,
    backgroundColor: "#B5E1E9",
    borderRadius: 12,
  },
  mapPin: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#1387F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 3,
  },
  mapPinText: {
    fontSize: 9,
    color: "#FFFFFF",
  },
  mapHint: {
    position: "absolute",
    bottom: 5,
    right: 7,
    fontSize: 9,
    color: "#42665C",
    backgroundColor: "#FFFFFFCC",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
  },
  descriptionInput: {
    minHeight: 88,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CDE3DE",
    backgroundColor: "#FFFFFF",
    padding: 11,
    fontSize: 12,
    lineHeight: 18,
    color: "#31534E",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 10,
    color: "#829792",
    marginTop: 4,
    marginBottom: 13,
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionalHint: {
    fontSize: 10,
    color: "#829792",
    marginBottom: 7,
  },
  photoRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 18,
  },
  photoBox: {
    width: 55,
    height: 49,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3E6E1",
    backgroundColor: "#E8F1ED",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAdded: {
    backgroundColor: "#D8EDE5",
  },
  photoEmoji: {
    fontSize: 20,
  },
  photoPlus: {
    fontSize: 22,
    color: "#829792",
  },
  addPhotoButton: {
    width: 49,
    height: 49,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D3E6E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoPlus: {
    fontSize: 25,
    color: "#087C68",
  },
  urgencyRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 22,
  },
  urgencyButton: {
    paddingHorizontal: 15,
    minHeight: 34,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "700",
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#087C68",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  footerNote: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    color: "#829792",
  },
});
