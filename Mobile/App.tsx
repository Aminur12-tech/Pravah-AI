
import React, { useState } from "react";
import { Alert } from "react-native";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LocationPermissionScreen from "./src/screens/LocationPermissionScreen";
import CitizenHomeScreen from "./src/screens/CitizenHomeScreen";
import ReportFormScreen from "./src/screens/ReportFormScreen";

import MyReportsScreen from "./src/screens/MyReportsScreen";
import ReportDetailsScreen from "./src/screens/ReportDetailsScreen";
import TrackProgressScreen from "./src/screens/TrackProgressScreen";

type Screen =
  | "welcome"
  | "login"
  | "signup"
  | "location"
  | "citizenHome"
  | "reportForm"
  | "myReports"
  | "reportDetails"
  | "trackProgress";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onLogin={() => setScreen("login")}
        onSignUp={() => setScreen("signup")}
      />
    );
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onSignUp={() => setScreen("signup")}
        onLogin={() => setScreen("citizenHome")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <SignUpScreen
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("login")}
        onSignUp={() => setScreen("location")}
      />
    );
  }

  if (screen === "location") {
    return (
      <LocationPermissionScreen
        onContinue={() => setScreen("citizenHome")}
      />
    );
  }

  if (screen === "citizenHome") {
    return (
      <CitizenHomeScreen
        onNavigate={(destination) => {
          switch (destination) {
            case "Home":
              setScreen("citizenHome");
              break;

            case "Report Incident":
              setScreen("reportForm");
              break;

            case "My Reports":
            case "Reports":
              setScreen("myReports");
              break;

            case "Official Alerts":
            case "All Alerts":
            case "Alerts":
              Alert.alert(
                "Official Alerts",
                "The alerts screen will be added next."
              );
              break;

            case "Profile":
              Alert.alert(
                "Profile",
                "The profile screen will be added next."
              );
              break;

            default:
              Alert.alert(
                destination,
                "This feature will be added next."
              );
          }
        }}
      />
    );
  }

  if (screen === "reportForm") {
    return (
      <ReportFormScreen
        onBack={() => setScreen("citizenHome")}
        onSubmit={() => setScreen("citizenHome")}
      />
    );
  }

  if (screen === "myReports") {
    return (
      <MyReportsScreen
        onBack={() => setScreen("citizenHome")}
        onOpenReport={() => setScreen("reportDetails")}
        onHome={() => setScreen("citizenHome")}
        onAlerts={() =>
          Alert.alert("Alerts", "The alerts screen will be added next.")
        }
        onProfile={() =>
          Alert.alert("Profile", "The profile screen will be added next.")
        }
      />
    );
  }

  if (screen === "reportDetails") {
    return (
      <ReportDetailsScreen
        onBack={() => setScreen("myReports")}
        onTrackProgress={() => setScreen("trackProgress")}
      />
    );
  }

  if (screen === "trackProgress") {
    return (
      <TrackProgressScreen
        onBack={() => setScreen("reportDetails")}
        onSubmitFeedback={() => setScreen("reportDetails")}
      />
    );
  }

  return null;
}
