
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

type Props = {
  onContinue: () => void;
};

export default function LocationPermissionScreen({
  onContinue,
}: Props) {
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        onContinue();
      } else {
        Alert.alert(
          "Location permission not granted",
          "You can enable location access later in your phone settings.",
          [
            { text: "Maybe Later", onPress: onContinue },
            { text: "Try Again", onPress: requestLocation },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        "Unable to request location",
        "Please check your device settings and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7FCFB"
      />

      <View style={styles.page}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepText}>
            2. Location Permission
          </Text>
        </View>

        <View style={styles.permissionCard}>
          <View style={styles.phoneStatus}>
            <Text style={styles.statusTime}>9:41</Text>
            <Text style={styles.statusIcons}>●  ▰  ▴</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.pinCircle}>
              <Text style={styles.pinEmoji}>📍</Text>
            </View>

            <Text style={styles.heading}>
              Location Access Required
            </Text>

            <Text style={styles.description}>
              We need your location to help you report incidents
              accurately and show nearby resources.
            </Text>

            <View style={styles.benefits}>
              <Benefit text="Find your current location" />
              <Benefit text="Show relevant alerts" />
              <Benefit text="Improve response time" />
            </View>

            <TouchableOpacity
              style={[
                styles.allowButton,
                loading && styles.disabledButton,
              ]}
              onPress={requestLocation}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.allowText}>
                  Allow Location Access
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.laterButton}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.laterText}>
                Maybe Later
              </Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              Location helps us provide relevant local information.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7FCFB",
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  stepHeader: {
    marginBottom: 12,
  },
  stepText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#174E48",
  },
  permissionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#72B9B0",
    borderRadius: 22,
    overflow: "hidden",
  },
  phoneStatus: {
    height: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTime: {
    fontSize: 11,
    fontWeight: "700",
    color: "#183B39",
  },
  statusIcons: {
    fontSize: 10,
    color: "#183B39",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  pinCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#E8F5F1",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  pinEmoji: {
    fontSize: 38,
  },
  heading: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: "#153F3A",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: "#526A68",
    textAlign: "center",
    marginBottom: 22,
  },
  benefits: {
    marginBottom: 24,
    gap: 13,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#16836D",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  benefitText: {
    fontSize: 13,
    color: "#284F4A",
    flex: 1,
  },
  allowButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#087C68",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  allowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  laterButton: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#82C8BE",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  laterText: {
    color: "#087C68",
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    color: "#829794",
  },
});
