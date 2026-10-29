
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { apiRequest } from "../services/api";

type Props = {
  onBack: () => void;
  onSave: () => void;
};

type ResourceType =
  | "food"
  | "drinking_water"
  | "medicine"
  | "first_aid"
  | "blankets"
  | "shelter"
  | "rescue_equipment"
  | "other";

type ResourceStatus = "available" | "limited" | "unavailable";

type CreateResourceResponse = {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    name: string;
    type: ResourceType;
    quantity: number;
    unit: string;
    status: ResourceStatus;
  };
};

const resourceTypes: { label: string; value: ResourceType }[] = [
  { label: "Food & Nutrition", value: "food" },
  { label: "Drinking Water", value: "drinking_water" },
  { label: "Medical Supplies", value: "medicine" },
  { label: "Shelter & Blankets", value: "blankets" },
  { label: "Rescue Equipment", value: "rescue_equipment" },
  { label: "Other", value: "other" },
];

const units = ["Packets", "Litres", "Kits", "Boxes", "Units", "Kg"];

const availabilityOptions: {
  label: string;
  value: ResourceStatus;
}[] = [
  { label: "Available", value: "available" },
  { label: "Limited", value: "limited" },
  { label: "Unavailable", value: "unavailable" },
];

export default function AddResourcesScreen({ onBack, onSave }: Props) {
  const [resourceType, setResourceType] =
    useState<ResourceType>("food");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("Packets");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] =
    useState<ResourceStatus>("available");
  const [description, setDescription] = useState("");
  const [openPicker, setOpenPicker] = useState<
    "type" | "unit" | "availability" | null
  >(null);
  const [saving, setSaving] = useState(false);

  const saveResource = async () => {
    if (saving) return;

    if (itemName.trim().length < 2) {
      Alert.alert(
        "Item name required",
        "Enter a resource name containing at least 2 characters."
      );
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !quantity.trim() ||
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      Alert.alert(
        "Invalid quantity",
        "Enter a valid quantity. Use 0 if none is currently available."
      );
      return;
    }

    if (parsedQuantity === 0 && availability === "available") {
      Alert.alert(
        "Check availability",
        "A resource with zero quantity cannot be marked Available."
      );
      return;
    }

    if (location.trim().length < 3) {
      Alert.alert(
        "Location required",
        "Enter a location or service area of at least 3 characters."
      );
      return;
    }

    if (description.trim().length > 1000) {
      Alert.alert(
        "Description too long",
        "Keep the description within 1000 characters."
      );
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest<CreateResourceResponse>(
        "/resources",
        {
          method: "POST",
          body: {
            name: itemName.trim(),
            type: resourceType,
            description: description.trim(),
            quantity: parsedQuantity,
            unit: unit.trim(),
            location: {
              address: location.trim(),
            },
            // The current backend derives status from quantity on creation.
          },
        }
      );

      if (!result.success) {
        throw new Error(result.message || "Could not save the resource.");
      }

      Alert.alert(
        "Resource saved",
        `${itemName.trim()} has been added successfully.`,
        [
          {
            text: "OK",
            onPress: onSave,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Could not save resource",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderPicker = (
    label: string,
    value: string,
    options: { label: string; value: string }[],
    pickerKey: "type" | "unit" | "availability",
    onSelect: (value: string) => void
  ) => (
    <View style={styles.pickerSection}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TouchableOpacity
        style={styles.pickerButton}
        activeOpacity={0.8}
        onPress={() =>
          setOpenPicker(openPicker === pickerKey ? null : pickerKey)
        }
        disabled={saving}
      >
        <Text style={styles.pickerValue}>{value}</Text>
        <Text style={styles.chevron}>
          {openPicker === pickerKey ? "⌃" : "⌄"}
        </Text>
      </TouchableOpacity>

      {openPicker === pickerKey && (
        <View style={styles.optionsList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.optionRow}
              onPress={() => {
                onSelect(option.value);
                setOpenPicker(null);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  option.value === value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
              {option.value === value && (
                <Text style={styles.optionCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const selectedTypeLabel =
    resourceTypes.find((item) => item.value === resourceType)?.label ||
    "Other";

  const selectedAvailabilityLabel =
    availabilityOptions.find((item) => item.value === availability)?.label ||
    "Available";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Text style={styles.time}>9:41</Text>
          <Text style={styles.statusIcons}>▴  ▰  ●</Text>
        </View>

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            disabled={saving}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Resources</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          List the items you can provide. Keep your availability updated.
        </Text>

        {renderPicker(
          "Resource Type *",
          selectedTypeLabel,
          resourceTypes,
          "type",
          (value) => setResourceType(value as ResourceType)
        )}

        <Text style={styles.fieldLabel}>Item Name *</Text>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="e.g. Rice, Packaged Food"
          placeholderTextColor="#91A59F"
          style={styles.textInput}
          maxLength={150}
          editable={!saving}
        />

        <Text style={styles.fieldLabel}>Description (optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the resource"
          placeholderTextColor="#91A59F"
          style={[styles.textInput, styles.descriptionInput]}
          maxLength={1000}
          multiline
          editable={!saving}
        />

        <Text style={styles.fieldLabel}>Quantity Available *</Text>
        <TextInput
          value={quantity}
          onChangeText={(value) =>
            setQuantity(value.replace(/[^0-9]/g, ""))
          }
          keyboardType="number-pad"
          placeholder="e.g. 100"
          placeholderTextColor="#91A59F"
          style={styles.textInput}
          maxLength={7}
          editable={!saving}
        />

        {renderPicker(
          "Unit *",
          unit,
          units.map((item) => ({ label: item, value: item })),
          "unit",
          setUnit
        )}

        <Text style={styles.fieldLabel}>Location / Service Area *</Text>
        <View style={styles.locationInputWrap}>
          <Text style={styles.locationIcon}>⌖</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location or service area"
            placeholderTextColor="#91A59F"
            style={styles.locationInput}
            maxLength={300}
            editable={!saving}
          />
        </View>

        <Text style={styles.fieldLabel}>Availability Status *</Text>
        <View style={styles.availabilityRow}>
          {availabilityOptions.map((option) => {
            const selected = availability === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.availabilityButton,
                  selected && styles.availabilitySelected,
                  option.value === "unavailable" &&
                    selected &&
                    styles.unavailableSelected,
                  option.value === "limited" &&
                    selected &&
                    styles.reservedSelected,
                ]}
                onPress={() => setAvailability(option.value)}
                activeOpacity={0.8}
                disabled={saving}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    selected && styles.availabilitySelectedText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.statusHint}>
          {availability === "limited"
            ? "Limited availability will be applied after the resource is created."
            : availability === "unavailable"
              ? "Unavailable status will be applied after the resource is created."
              : "The backend sets new resources with a positive quantity to Available."}
        </Text>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={saveResource}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Resource</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onBack}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Resources are saved to your PRAVAH AI account.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5FAF8" },
  header: {
    backgroundColor: "#064D48",
    paddingHorizontal: 17,
    paddingBottom: 11,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  statusRow: {
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { fontSize: 11, color: "#FFFFFF", fontWeight: "700" },
  statusIcons: { fontSize: 10, color: "#FFFFFF" },
  headerRow: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { width: 30 },
  backArrow: { fontSize: 30, color: "#FFFFFF" },
  headerTitle: { fontSize: 16, color: "#FFFFFF", fontWeight: "800" },
  headerSpacer: { width: 30 },
  content: { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 28 },
  description: {
    fontSize: 10,
    color: "#648078",
    lineHeight: 16,
    marginBottom: 17,
  },
  fieldLabel: {
    fontSize: 11,
    color: "#31534D",
    fontWeight: "800",
    marginBottom: 7,
    marginTop: 10,
  },
  pickerSection: { marginBottom: 2 },
  pickerButton: {
    minHeight: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 8,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerValue: { fontSize: 11, color: "#42635C", flex: 1 },
  chevron: { fontSize: 16, color: "#62847B" },
  optionsList: {
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 8,
    overflow: "hidden",
  },
  optionRow: {
    minHeight: 39,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F0",
  },
  optionText: { flex: 1, fontSize: 11, color: "#42635C" },
  selectedOptionText: { color: "#087C68", fontWeight: "800" },
  optionCheck: { color: "#087C68", fontWeight: "800" },
  textInput: {
    minHeight: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 8,
    paddingHorizontal: 11,
    fontSize: 11,
    color: "#31534D",
  },
  descriptionInput: {
    minHeight: 70,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  locationInputWrap: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  locationIcon: { fontSize: 17, color: "#62847B", marginRight: 7 },
  locationInput: {
    flex: 1,
    fontSize: 10,
    color: "#31534D",
    paddingVertical: 9,
  },
  availabilityRow: { flexDirection: "row", gap: 7, marginTop: 3 },
  availabilityButton: {
    flex: 1,
    minHeight: 37,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCEAE5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  availabilitySelected: {
    backgroundColor: "#087C68",
    borderColor: "#087C68",
  },
  reservedSelected: { backgroundColor: "#F0A53A", borderColor: "#F0A53A" },
  unavailableSelected: {
    backgroundColor: "#738780",
    borderColor: "#738780",
  },
  availabilityText: { fontSize: 9, color: "#648078", fontWeight: "700" },
  availabilitySelectedText: { color: "#FFFFFF" },
  statusHint: {
    marginTop: 7,
    fontSize: 10,
    color: "#81938F",
    lineHeight: 15,
  },
  saveButton: {
    minHeight: 45,
    backgroundColor: "#087C68",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  disabledButton: { opacity: 0.65 },
  saveButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 2,
  },
  cancelButtonText: { fontSize: 11, color: "#648078", fontWeight: "700" },
  disclaimer: {
    textAlign: "center",
    fontSize: 9,
    color: "#81938F",
    marginTop: 2,
  },
});
