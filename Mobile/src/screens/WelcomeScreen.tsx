import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WelcomeScreenProps = {
  onLogin: () => void;
  onSignUp: () => void;
};

const landscape = {
  uri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85",
};

export default function WelcomeScreen({
  onLogin,
  onSignUp,
}: WelcomeScreenProps) {
  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.brandSection}>
            <View style={styles.logo}>
              <Text style={styles.mountain}>▲</Text>
              <Text style={styles.wave}>≈</Text>
            </View>

            <Text style={styles.title}>PRAVAH AI</Text>
            <Text style={styles.tagline}>
              From Local Signals{"\n"}to Collective Action
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.features}>
              Report  ·  Analyze  ·  Respond  ·  Rebuild
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={onLogin}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              activeOpacity={0.85}
              onPress={onSignUp}
            >
              <Text style={styles.signupText}>Create Account</Text>
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
    backgroundColor: "#103F38",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(4, 45, 39, 0.38)",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 25,
  },
  brandSection: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D9F0E6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 15,
  },
  mountain: {
    position: "absolute",
    top: 4,
    color: "#14845F",
    fontSize: 49,
    fontWeight: "900",
  },
  wave: {
    position: "absolute",
    bottom: -12,
    color: "#167FA0",
    fontSize: 52,
    fontWeight: "900",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#163F38",
    textShadowRadius: 8,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 7,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  features: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 22,
  },
  loginButton: {
    height: 49,
    width: "100%",
    backgroundColor: "#008568",
    borderColor: "#4CE0B1",
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  signupButton: {
    height: 49,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    color: "#174A40",
    fontSize: 15,
    fontWeight: "800",
  },
  footer: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },
});