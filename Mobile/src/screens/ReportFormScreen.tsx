
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { apiRequest } from "../services/api";

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

type IncidentCategory =
  | "flood"
  | "earthquake"
  | "landslide"
  | "fire"
  | "storm"
  | "road_damage"
  | "waste"
  | "drainage"
  | "water_shortage"
  | "other";

type UrgentNeed =
  | "drinking_water"
  | "food"
  | "rescue"
  | "medical_help"
  | "shelter"
  | "blankets"
  | "first_aid"
  | "other";

type CreateIncidentResponse = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    title: string;
    status?: string;
  };
};

type AIAnalyzeResponse = {
  success: boolean;
  data: {
    predicted_category: string;
    ranked_categories: {
      category: string;
      score: number;
    }[];
    note?: string;
  };
};

const categories: { label: string; value: IncidentCategory }[] = [
  { label: "Flood", value: "flood" },
  { label: "Fire", value: "fire" },
  { label: "Storm", value: "storm" },
  { label: "Landslide", value: "landslide" },
  { label: "Earthquake", value: "earthquake" },
  { label: "Road damage", value: "road_damage" },
  { label: "Drainage", value: "drainage" },
  { label: "Water shortage", value: "water_shortage" },
  { label: "Waste", value: "waste" },
  { label: "Other", value: "other" },
];

const needs: { label: string; value: UrgentNeed }[] = [
  { label: "Drinking water", value: "drinking_water" },
  { label: "Food", value: "food" },
  { label: "Rescue", value: "rescue" },
  { label: "Medical help", value: "medical_help" },
  { label: "Shelter", value: "shelter" },
  { label: "Blankets", value: "blankets" },
  { label: "First aid", value: "first_aid" },
];

const aiCategoryMap: Record<string, IncidentCategory> = {
  flood: "flood",
  earthquake: "earthquake",
  landslide: "landslide",
  fire: "fire",
  storm: "storm",
  "road damage": "road_damage",
  road_damage: "road_damage",
  "waste or pollution": "waste",
  waste_or_pollution: "waste",
  waste: "waste",
  "drainage problem": "drainage",
  drainage_problem: "drainage",
  drainage: "drainage",
  "water shortage": "water_shortage",
  water_shortage: "water_shortage",
  other: "other",
  "other emergency": "other",
  other_emergency: "other",
};

export default function ReportFormScreen({
  onBack,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("26.1445, 91.7362");
  const [category, setCategory] = useState<IncidentCategory>("flood");
  const [selectedNeeds, setSelectedNeeds] = useState<UrgentNeed[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] =
    useState<IncidentCategory | null>(null);
  const [aiScores, setAiScores] = useState<
    { category: IncidentCategory; score: number }[]
  >([]);

  function handleDescriptionChange(value: string) {
    setDescription(value);
    setAiSuggestion(null);
    setAiScores([]);
  }

  function handleCategoryChange(value: IncidentCategory) {
    setCategory(value);
  }

  function toggleNeed(need: UrgentNeed) {
    setSelectedNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need]
    );
  }

  async function handleAnalyzeWithAI() {
    const cleanDescription = description.trim();

    if (cleanDescription.length < 5) {
      Alert.alert(
        "Description required",
        "Enter at least 5 characters describing the incident."
      );
      return;
    }

    if (isAnalyzing || isSubmitting) {
      return;
    }

    setIsAnalyzing(true);
    setAiSuggestion(null);
    setAiScores([]);

    try {
      const result = await apiRequest<AIAnalyzeResponse>("/ai/analyze", {
        method: "POST",
        body: {
          description: cleanDescription,
        },
      });

      if (!result.success || !result.data?.predicted_category) {
        throw new Error("The AI service returned an invalid result.");
      }

      const predictedCategory =
        aiCategoryMap[result.data.predicted_category];

      if (!predictedCategory) {
        throw new Error(
          `Unsupported AI category: ${result.data.predicted_category}`
        );
      }

      const rankedCategories = (result.data.ranked_categories ?? [])
        .map((item) => {
          const mappedCategory = aiCategoryMap[item.category];

          if (!mappedCategory || !Number.isFinite(item.score)) {
            return null;
          }

          return {
            category: mappedCategory,
            score: item.score,
          };
        })
        .filter(
          (
            item
          ): item is {
            category: IncidentCategory;
            score: number;
          } => item !== null
        );

      setAiSuggestion(predictedCategory);
      setAiScores(rankedCategories);
      setCategory(predictedCategory);

      const label =
        categories.find((item) => item.value === predictedCategory)
          ?.label ?? "Other";

      Alert.alert(
        "AI analysis complete",
        `Suggested category: ${label}\n\nPlease verify this suggestion before submitting your report.`
      );
    } catch (error) {
      Alert.alert(
        "AI analysis failed",
        error instanceof Error
          ? error.message
          : "Unable to analyze the incident. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSubmit() {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanLocation = location.trim();

    if (cleanTitle.length < 5) {
      Alert.alert(
        "Title required",
        "Enter a title with at least 5 characters."
      );
      return;
    }

    if (cleanDescription.length < 10) {
      Alert.alert(
        "Description required",
        "Describe the incident using at least 10 characters."
      );
      return;
    }

    if (cleanLocation.length < 3) {
      Alert.alert(
        "Location required",
        "Enter a location or address for this incident."
      );
      return;
    }

    if (selectedNeeds.length > 8) {
      Alert.alert("Too many selections", "Select up to 8 urgent needs.");
      return;
    }

    if (isAnalyzing || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiRequest<CreateIncidentResponse>(
        "/incidents",
        {
          method: "POST",
          body: {
            title: cleanTitle,
            description: cleanDescription,
            category,
            location: {
              address: cleanLocation,
            },
            urgentNeeds: selectedNeeds,
          },
        }
      );

      Alert.alert(
        "Report submitted",
        `${result.message}\n\nReport ID: ${result.data._id}`,
        [
          {
            text: "OK",
            onPress: onSubmit,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Submission failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.eyebrow}>COMMUNITY SAFETY</Text>
        <Text style={styles.heading}>Report an incident</Text>
        <Text style={styles.subtitle}>
          Share accurate details so the community response team can assess the
          situation.
        </Text>

        <Text style={styles.label}>Incident title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Flooding near the main road"
          placeholderTextColor="#8A94A6"
          value={title}
          onChangeText={setTitle}
          maxLength={150}
        />

        <Text style={styles.label}>Incident category *</Text>
        <View style={styles.chipContainer}>
          {categories.map((item) => {
            const active = category === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => handleCategoryChange(item.value)}
                style={[styles.chip, active && styles.activeChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.activeChipText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {aiSuggestion && (
          <View style={styles.aiResult}>
            <Text style={styles.aiResultTitle}>
              ✨ AI suggestion:{" "}
              {categories.find((item) => item.value === aiSuggestion)?.label}
            </Text>

            <Text style={styles.aiResultText}>
              The category was selected automatically. Review the details and
              choose another category if the suggestion is incorrect.
            </Text>

            {aiScores.length > 0 && (
              <View style={styles.aiScores}>
                <Text style={styles.aiScoresHeading}>
                  Other model rankings
                </Text>

                {aiScores.slice(0, 3).map((item, index) => (
                  <Text
                    key={`${item.category}-${index}`}
                    style={styles.aiScoreText}
                  >
                    {categories.find(
                      (categoryItem) =>
                        categoryItem.value === item.category
                    )?.label ?? item.category}
                    {" — "}
                    {(item.score * 100).toFixed(1)}%
                  </Text>
                ))}

                <Text style={styles.aiDisclaimer}>
                  These are model ranking scores, not calibrated probabilities.
                </Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.label}>Location or address *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a nearby landmark or address"
          placeholderTextColor="#8A94A6"
          value={location}
          onChangeText={setLocation}
          maxLength={300}
        />
        <Text style={styles.helper}>
          You can enter an address or landmark. GPS coordinates are not
          automatically captured by this screen.
        </Text>

        <Text style={styles.label}>What happened? *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the incident, its severity, and any immediate danger..."
          placeholderTextColor="#8A94A6"
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          textAlignVertical="top"
          maxLength={5000}
        />
        <Text style={styles.counter}>{description.length}/5000</Text>

        <Pressable
          onPress={handleAnalyzeWithAI}
          disabled={isAnalyzing || isSubmitting}
          style={[
            styles.aiButton,
            (isAnalyzing || isSubmitting) && styles.disabledButton,
          ]}
        >
          {isAnalyzing ? (
            <View style={styles.aiButtonContent}>
              <ActivityIndicator color="#167D76" />
              <Text style={styles.aiButtonText}>Analyzing incident...</Text>
            </View>
          ) : (
            <Text style={styles.aiButtonText}>✨ Analyze with AI</Text>
          )}
        </Pressable>

        <Text style={styles.helper}>
          AI provides a category suggestion. Check it before submitting.
        </Text>

        <Text style={styles.label}>Urgent needs</Text>
        <Text style={styles.helper}>
          Select any resources or assistance that are needed.
        </Text>

        <View style={styles.chipContainer}>
          {needs.map((item) => {
            const active = selectedNeeds.includes(item.value);

            return (
              <Pressable
                key={item.value}
                onPress={() => toggleNeed(item.value)}
                style={[styles.chip, active && styles.activeChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.activeChipText,
                  ]}
                >
                  {active ? "✓ " : "+ "}
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Before submitting</Text>
          <Text style={styles.noticeText}>
            Confirm the location and details are accurate. For an immediate
            life-threatening emergency, contact the appropriate local emergency
            service directly.
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting || isAnalyzing}
          style={[
            styles.submitButton,
            (isSubmitting || isAnalyzing) && styles.disabledButton,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>Submit incident report →</Text>
          )}
        </Pressable>

        <Pressable
          onPress={onBack}
          disabled={isSubmitting || isAnalyzing}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 18,
    marginBottom: 20,
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
    marginBottom: 10,
  },
  heading: {
    color: "#172033",
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 26,
  },
  label: {
    color: "#253047",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 9,
    marginTop: 19,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE3ED",
    borderRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: "#172033",
  },
  textArea: {
    minHeight: 130,
    paddingTop: 14,
  },
  helper: {
    color: "#7B8495",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  counter: {
    textAlign: "right",
    color: "#8992A3",
    fontSize: 11,
    marginTop: 6,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  chip: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#DCE3ED",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  activeChip: {
    backgroundColor: "#DDF5F0",
    borderColor: "#167D76",
  },
  chipText: {
    color: "#475467",
    fontSize: 13,
    fontWeight: "500",
  },
  activeChipText: {
    color: "#12665F",
    fontWeight: "700",
  },
  aiButton: {
    backgroundColor: "#E5F5F2",
    borderWidth: 1,
    borderColor: "#167D76",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    minHeight: 48,
  },
  aiButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  aiButtonText: {
    color: "#12665F",
    fontSize: 14,
    fontWeight: "800",
  },
  aiResult: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B9E4DB",
    borderRadius: 12,
    padding: 13,
    marginTop: 12,
  },
  aiResultTitle: {
    color: "#12665F",
    fontSize: 14,
    fontWeight: "800",
  },
  aiResultText: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  aiScores: {
    borderTopWidth: 1,
    borderTopColor: "#E5EAF0",
    marginTop: 12,
    paddingTop: 10,
  },
  aiScoresHeading: {
    color: "#253047",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },
  aiScoreText: {
    color: "#475467",
    fontSize: 12,
    marginTop: 4,
  },
  aiDisclaimer: {
    color: "#7B8495",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  notice: {
    backgroundColor: "#FFF7E8",
    borderColor: "#F3D7A4",
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
    marginTop: 25,
  },
  noticeTitle: {
    color: "#805B13",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 5,
  },
  noticeText: {
    color: "#725D34",
    fontSize: 12,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#167D76",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    minHeight: 54,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  cancelText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "600",
  },
});
