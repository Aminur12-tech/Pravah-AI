
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
} from "react-native";

type Props = {
  onBack: () => void;
  onSave: () => void;
};

const resourceTypes = [
  "Food & Nutrition",
  "Drinking Water",
  "Medical Supplies",
  "Shelter & Blankets",
  "Rescue Equipment",
  "Other",
];

const units = ["Packets", "Litres", "Kits", "Boxes", "Units", "Kg"];

const availabilityOptions = ["Available", "Reserved", "Unavailable"];

export default function AddResourcesScreen({ onBack, onSave }: Props) {
  const [resourceType, setResourceType] = useState("Food & Nutrition");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("Packets");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("Available");
  const [openPicker, setOpenPicker] = useState<
    "type" | "unit" | "availability" | null
  >(null);

  const saveResource = () => {
    if (!itemName.trim()) {
      Alert.alert("Item name required", "Please enter a resource item name.");
      return;
    }

    if (!quantity.trim() || Number(quantity) <= 0) {
      Alert.alert("Invalid quantity", "Enter a quantity greater than zero.");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Location required", "Enter a location or service area.");
      return;
    }

    Alert.alert(
      "Resource Ready",
      `${itemName.trim()} — ${quantity} ${unit}\nStatus: ${availability}\n\nThis is a demo. The resource has not been saved to a server.`,
      [
        {
          text: "OK",
          onPress: onSave,
        },
      ]
    );
  };

  const renderPicker = (
    label: string,
    value: string,
    options: string[],
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
              key={option}
              style={styles.optionRow}
              onPress={() => {
                onSelect(option);
                setOpenPicker(null);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  option === value && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
              {option === value && (
                <Text style={styles.optionCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#064D48" />

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
          resourceType,
          resourceTypes,
          "type",
          setResourceType
        )}

        <Text style={styles.fieldLabel}>Item Name *</Text>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="e.g. Rice, Packaged Food"
          placeholderTextColor="#91A59F"
          style={styles.textInput}
          maxLength={100}
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
        />

        {renderPicker("Unit *", unit, units, "unit", setUnit)}

        <Text style={styles.fieldLabel}>Location / Service Area *</Text>
        <View style={styles.locationInputWrap}>
          <Text style={styles.locationIcon}>⌖</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Select location or enter service area"
            placeholderTextColor="#91A59F"
            style={styles.locationInput}
            maxLength={150}
          />
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Choose Service Area",
                "Map selection can be connected when location services are added."
              )
            }
          >
            <Text style={styles.pinIcon}>●</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>Availability Status *</Text>
        <View style={styles.availabilityRow}>
          {availabilityOptions.map((option) => {
            const selected = availability === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.availabilityButton,
                  selected && styles.availabilitySelected,
                  option === "Unavailable" && selected && styles.unavailableSelected,
                  option === "Reserved" && selected && styles.reservedSelected,
                ]}
                onPress={() => setAvailability(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    selected && styles.availabilitySelectedText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveResource}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>Save Resource</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Demo only — resource details are not stored on a server.
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
    height: 42,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEAE5",
    borderRadius: 8,
    paddingHorizontal: 11,
    fontSize: 11,
    color: "#31534D",
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
  locationInput: { flex: 1, fontSize: 10, color: "#31534D", paddingVertical: 9 },
  pinIcon: { color: "#087C68", fontSize: 14, paddingLeft: 7 },
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
  availabilitySelected: { backgroundColor: "#087C68", borderColor: "#087C68" },
  reservedSelected: { backgroundColor: "#F0A53A", borderColor: "#F0A53A" },
  unavailableSelected: { backgroundColor: "#738780", borderColor: "#738780" },
  availabilityText: { fontSize: 9, color: "#648078", fontWeight: "700" },
  availabilitySelectedText: { color: "#FFFFFF" },
  saveButton: {
    minHeight: 45,
    backgroundColor: "#087C68",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
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
