import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type AccountRole =
  | "Citizen"
  | "Project Owner"
  | "Resource Provider";

export type RegisterDetails = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: AccountRole;
  organization: string;
  locationEnabled: boolean;
};

type SignUpScreenProps = {
  onBack: () => void;
  onLogin: () => void;
  onRegister: (details: RegisterDetails) => Promise<void>;
};

export default function SignUpScreen({
  onBack,
  onLogin,
  onRegister,
}: SignUpScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("Citizen");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing details", "Please fill in all required fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password too short",
        "Your password must contain at least 8 characters."
      );
      return;
    }

    if (password.length > 72) {
      Alert.alert(
        "Password too long",
        "Please use a password of 72 characters or fewer."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please check your passwords.");
      return;
    }

    if (role === "Project Owner") {
      Alert.alert(
        "Project Owner account",
        "Project Owner accounts must be created by an administrator. Please register as a Citizen or Resource Provider."
      );
      return;
    }

    if (role === "Resource Provider" && !organization.trim()) {
      Alert.alert(
        "Organization required",
        "Please enter your organization name."
      );
      return;
    }

    if (locationEnabled) {
      Alert.alert(
        "Location setup required",
        "Location permission and coordinate capture will be connected next. Please turn off this switch to register for now."
      );
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      await onRegister({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        confirmPassword,
        role,
        organization: organization.trim(),
        locationEnabled: false,
      });
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
            disabled={isLoading}
            accessibilityLabel="Back to welcome screen"
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.logo}>
            <Text style={styles.logoMountain}>▲</Text>
            <Text style={styles.logoWave}>≈</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join PRAVAH AI and help build safer communities.
          </Text>

          <Text style={styles.label}>I am registering as</Text>

          <View style={styles.roleList}>
            {(
              ["Citizen", "Project Owner", "Resource Provider"] as AccountRole[]
            ).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.roleButton,
                  role === item && styles.roleButtonActive,
                ]}
                onPress={() => setRole(item)}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.radioOuter,
                    role === item && styles.radioOuterActive,
                  ]}
                >
                  {role === item && <View style={styles.radioInner} />}
                </View>

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

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#91A2AE"
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#91A2AE"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.label}>Mobile Number *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your mobile number"
            placeholderTextColor="#91A2AE"
            keyboardType="phone-pad"
            editable={!isLoading}
          />

          {role === "Project Owner" && (
            <>
              <Text style={styles.label}>Organization / Project Name *</Text>
              <TextInput
                style={styles.input}
                value={organization}
                onChangeText={setOrganization}
                placeholder="Enter organization or project name"
                placeholderTextColor="#91A2AE"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </>
          )}

          {role === "Resource Provider" && (
            <>
              <Text style={styles.label}>Organization Name *</Text>
              <TextInput
                style={styles.input}
                value={organization}
                onChangeText={setOrganization}
                placeholder="Enter your organization name"
                placeholderTextColor="#91A2AE"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </>
          )}

          <Text style={styles.label}>Password *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor="#91A2AE"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={() => setShowPassword((previous) => !previous)}
              disabled={isLoading}
            >
              <Text style={styles.showText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            placeholderTextColor="#91A2AE"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <View style={styles.locationRow}>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>Enable location</Text>
              <Text style={styles.locationSubtitle}>
                Location access will be connected in the next step.
              </Text>
            </View>

            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              disabled={isLoading}
              trackColor={{ false: "#DCE6E6", true: "#82CBB2" }}
              thumbColor={locationEnabled ? "#087A5D" : "#F4F4F4"}
            />
          </View>

          <Text style={styles.note}>
            * Required fields. Project Owner accounts require administrator
            creation. Resource Provider accounts require verification.
          </Text>

          <TouchableOpacity
            style={[
              styles.registerButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onLogin} disabled={isLoading}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardView: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    width: 34,
    height: 36,
    justifyContent: "center",
    marginBottom: 8,
  },
  backText: { color: "#174A40", fontSize: 32, lineHeight: 34 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E7F3E9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  logoMountain: {
    position: "absolute",
    top: -4,
    color: "#138A64",
    fontSize: 27,
  },
  logoWave: {
    position: "absolute",
    bottom: -11,
    color: "#167BA0",
    fontSize: 30,
    fontWeight: "900",
  },
  title: { color: "#173F35", fontSize: 25, fontWeight: "800" },
  subtitle: {
    color: "#537064",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "#526B70",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 3,
  },
  roleList: { gap: 8, marginBottom: 17 },
  roleButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#DCE6EB",
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
  },
  roleButtonActive: {
    borderColor: "#087A5D",
    backgroundColor: "#EFF8F4",
  },
  radioOuter: {
    width: 17,
    height: 17,
    borderWidth: 1.5,
    borderColor: "#9BAEB2",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioOuterActive: { borderColor: "#087A5D" },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#087A5D",
  },
  roleText: { color: "#526B70", fontSize: 12, fontWeight: "600" },
  roleTextActive: { color: "#087A5D", fontWeight: "800" },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#DCE6EB",
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#173F35",
    marginBottom: 14,
  },
  passwordContainer: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#DCE6EB",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  passwordInput: { flex: 1, minHeight: 42, fontSize: 13, color: "#173F35" },
  showText: {
    color: "#087A5D",
    fontSize: 11,
    fontWeight: "800",
    paddingLeft: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F3F8F6",
    marginTop: 4,
    marginBottom: 12,
  },
  locationTextContainer: { flex: 1, paddingRight: 10 },
  locationTitle: { color: "#173F35", fontSize: 12, fontWeight: "800" },
  locationSubtitle: {
    color: "#60766D",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  note: {
    color: "#71817F",
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 15,
  },
  registerButton: {
    height: 47,
    backgroundColor: "#087A5D",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.65 },
  registerButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: { color: "#526B70", fontSize: 11 },
  loginLink: { color: "#087A5D", fontSize: 11, fontWeight: "800" },
});