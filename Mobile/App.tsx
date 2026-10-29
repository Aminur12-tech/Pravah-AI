
import React from "react";
import LoginScreen from "./src/screens/LoginScreen";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const backgroundImage = {
  uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=90",
};

export default function App() {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#164B43" />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* PRAVAH AI logo */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <View style={styles.mountainLeft} />
              <View style={styles.mountainRight} />
              <View style={styles.waveOne} />
              <View style={styles.waveTwo} />
            </View>

            <Text style={styles.brand}>PRAVAH AI</Text>
            <Text style={styles.tagline}>
              From Local Signals{"\n"}to Collective Action
            </Text>
          </View>

          {/* Bottom welcome section */}
          <View style={styles.bottomSection}>
            <Text style={styles.values}>
              Report · Analyze · Respond · Rebuild
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.loginButton}
              onPress={() => Alert.alert("Login", "Login screen coming next.")}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.createButton}
              onPress={() =>
                Alert.alert("Create Account", "Registration screen coming next.")
              }
            >
              <Text style={styles.createText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>
              Together for a safer tomorrow
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#164B43",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 48, 42, 0.34)",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 75,
    paddingBottom: 28,
  },
  brandSection: {
    alignItems: "center",
    marginTop: 5,
  },
  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5F5E9",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  mountainLeft: {
    position: "absolute",
    top: 17,
    left: 13,
    width: 0,
    height: 0,
    borderLeftWidth: 24,
    borderRightWidth: 24,
    borderBottomWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#138A64",
  },
  mountainRight: {
    position: "absolute",
    top: 24,
    right: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 23,
    borderRightWidth: 23,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#16815F",
  },
  waveOne: {
    position: "absolute",
    width: 95,
    height: 27,
    bottom: 14,
    left: -5,
    borderTopWidth: 5,
    borderTopColor: "#176D9A",
    borderRadius: 35,
    transform: [{ rotate: "-9deg" }],
  },
  waveTwo: {
    position: "absolute",
    width: 95,
    height: 25,
    bottom: 3,
    left: -5,
    borderTopWidth: 5,
    borderTopColor: "#248EB1",
    borderRadius: 35,
    transform: [{ rotate: "7deg" }],
  },
  brand: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 23,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 5,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 5,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  values: {
    color: "#F2F8F0",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 22,
    textAlign: "center",
    textShadowColor: "#123B32",
    textShadowRadius: 5,
  },
  loginButton: {
    width: "100%",
    height: 49,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#40D4A2",
    backgroundColor: "rgba(0, 100, 77, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  createButton: {
    width: "100%",
    height: 49,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    color: "#174A40",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    color: "#E6F2E9",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 23,
    textAlign: "center",
  },
});
