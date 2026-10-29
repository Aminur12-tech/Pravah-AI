
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "Citizen" | "Project Owner";

type LoginScreenProps = {
  onBack: () => void;
  onSignUp: () => void;
  onDemo: () => void;
  onLogin: (details: {
    identifier: string;
    password: string;
    role: Role;
  }) => void;
};

function Logo() {
  return (
    <View style={styles.logo}>
      <Text style={styles.logoMountain}>▲</Text>
      <Text style={styles.logoWave}>≈</Text>
    </View>
  );
}

export default function LoginScreen({
  onBack,
  onSignUp,
  onDemo,
  onLogin,
}: LoginScreenProps) {
  const [role, setRole] = useState<Role>("Citizen");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      Alert.alert(
        "Missing details",
        "Enter your email/mobile number and password."
      );
      return;
    }

    onLogin({
      identifier: identifier.trim(),
      password,
      role,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            accessibilityLabel="Back to welcome screen"
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Logo />

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.roleRow}>
            {(["Citizen", "Project Owner"] as Role[]).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.roleButton,
                  role === item && styles.roleButtonActive,
                ]}
                onPress={() => setRole(item)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === item && styles.roleTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Email or Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="Enter your email or mobile"
            placeholderTextColor="#91A2AE"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#91A2AE"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => setShowPassword((previous) => !previous)}
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Text style={styles.showText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert(
                "Forgot Password",
                "Password recovery will be added later."
              )
            }
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={onDemo}>
            <Text style={styles.demoText}>Continue with Demo</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  backButton: {
    width: 34,
    height: 36,
    justifyContent: "center",
    marginBottom: 10,
  },
  backText: {
    color: "#174A40",
    fontSize: 32,
    lineHeight: 34,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E7F3E9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 18,
  },
  logoMountain: {
    position: "absolute",
    top: -5,
    color: "#138A64",
    fontSize: 26,
  },
  logoWave: {
    position: "absolute",
    bottom: -11,
    color: "#167BA0",
    fontSize: 29,
    fontWeight: "900",
  },
  title: {
    color: "#173F35",
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    color: "#537064",
    fontSize: 13,
    marginTop: 5,
    marginBottom: 25,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    height: 39,
    borderRadius: 9,
    backgroundColor: "#F0F4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonActive: {
    backgroundColor: "#087A5D",
  },
  roleText: {
    color: "#526B70",
    fontSize: 12,
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#FFFFFF",
  },
  label: {
    color: "#526B70",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#DCE6EB",
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#173F35",
    marginBottom: 18,
  },
  passwordContainer: {
    height: 44,
    borderWidth: 1,
    borderColor: "#DCE6EB",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 13,
    color: "#173F35",
  },
  showText: {
    color: "#087A5D",
    fontSize: 11,
    fontWeight: "700",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 20,
  },
  forgotText: {
    color: "#087A5D",
    fontSize: 11,
    fontWeight: "700",
  },
  loginButton: {
    height: 45,
    backgroundColor: "#087A5D",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3EAED",
  },
  orText: {
    color: "#60766D",
    fontSize: 12,
  },
  demoButton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D3E0E7",
    alignItems: "center",
    justifyContent: "center",
  },
  demoText: {
    color: "#173F35",
    fontSize: 13,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  signupText: {
    color: "#526B70",
    fontSize: 11,
  },
  signupLink: {
    color: "#087A5D",
    fontSize: 11,
    fontWeight: "800",
  },
});
