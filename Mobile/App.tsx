
import React, { useState } from "react";
import { Alert, View, Text, TouchableOpacity, StyleSheet } from "react-native";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LocationPermissionScreen from "./src/screens/LocationPermissionScreen";

import CitizenHomeScreen from "./src/screens/CitizenHomeScreen";
import ReportFormScreen from "./src/screens/ReportFormScreen";
import MyReportsScreen from "./src/screens/MyReportsScreen";
import ReportDetailsScreen from "./src/screens/ReportDetailsScreen";
import TrackProgressScreen from "./src/screens/TrackProgressScreen";

import OwnerDashboardScreen from "./src/screens/OwnerDashboardScreen";
import IncidentListScreen from "./src/screens/IncidentListScreen";
import OwnerIncidentDetailScreen from "./src/screens/OwnerIncidentDetailScreen";
import ResourceAssignmentScreen from "./src/screens/ResourceAssignmentScreen";
import UpdateStatusScreen from "./src/screens/UpdateStatusScreen";
import AnalyticsReportsScreen from "./src/screens/AnalyticsReportsScreen";

import ProviderDashboardScreen from "./src/screens/ProviderDashboardScreen";
import AddResourcesScreen from "./src/screens/AddResourcesScreen";
import NearbyRequestsScreen from "./src/screens/NearbyRequestsScreen";
import RequestDetailsScreen from "./src/screens/RequestDetailsScreen";
import ConfirmSupportScreen from "./src/screens/ConfirmSupportScreen";
import MyContributionsScreen from "./src/screens/MyContributionsScreen";
import ProviderProfileScreen from "./src/screens/ProviderProfileScreen";

type Screen =
  | "welcome" | "login" | "signup" | "location"
  | "citizenHome" | "reportForm" | "myReports" | "reportDetails" | "trackProgress"
  | "ownerDashboard" | "incidentList" | "ownerIncidentDetail"
  | "resourceAssignment" | "updateStatus" | "analytics"
  | "providerDashboard" | "addResources" | "nearbyRequests" | "requestDetails"
  | "confirmSupport" | "myContributions" | "providerProfile";

type Role = "citizen" | "owner" | "provider";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [showRolePicker, setShowRolePicker] = useState(false);

  const chooseRole = (role: Role) => {
    setShowRolePicker(false);
    if (role === "citizen") setScreen("citizenHome");
    else if (role === "owner") setScreen("ownerDashboard");
    else setScreen("providerDashboard");
  };

  if (showRolePicker) {
    return (
      <View style={roleStyles.container}>
        <Text style={roleStyles.title}>PRAVAH AI</Text>
        <Text style={roleStyles.subtitle}>Choose a demo experience</Text>
        <TouchableOpacity style={roleStyles.button} onPress={() => chooseRole("citizen")}>
          <Text style={roleStyles.buttonText}>Continue as Citizen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={roleStyles.button} onPress={() => chooseRole("owner")}>
          <Text style={roleStyles.buttonText}>Continue as Project Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={roleStyles.button} onPress={() => chooseRole("provider")}>
          <Text style={roleStyles.buttonText}>Continue as Resource Provider</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setShowRolePicker(false); setScreen("welcome"); }}>
          <Text style={roleStyles.backText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === "welcome") {
    return <WelcomeScreen onLogin={() => setScreen("login")} onSignUp={() => setScreen("signup")} />;
  }

  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onSignUp={() => setScreen("signup")}
        onLogin={() => setShowRolePicker(true)}
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
    return <LocationPermissionScreen onContinue={() => setShowRolePicker(true)} />;
  }

  // CITIZEN
  if (screen === "citizenHome") {
    return (
      <CitizenHomeScreen onNavigate={(destination) => {
        if (destination === "Home") setScreen("citizenHome");
        else if (destination === "Report Incident") setScreen("reportForm");
        else if (destination === "My Reports" || destination === "Reports") setScreen("myReports");
        else Alert.alert(destination, "This feature is coming soon.");
      }} />
    );
  }

  if (screen === "reportForm") {
    return <ReportFormScreen onBack={() => setScreen("citizenHome")} onSubmit={() => setScreen("citizenHome")} />;
  }

  if (screen === "myReports") {
    return (
      <MyReportsScreen
        onBack={() => setScreen("citizenHome")}
        onOpenReport={() => setScreen("reportDetails")}
        onHome={() => setScreen("citizenHome")}
        onAlerts={() => Alert.alert("Alerts", "Coming soon.")}
        onProfile={() => Alert.alert("Profile", "Coming soon.")}
      />
    );
  }

  if (screen === "reportDetails") {
    return <ReportDetailsScreen onBack={() => setScreen("myReports")} onTrackProgress={() => setScreen("trackProgress")} />;
  }

  if (screen === "trackProgress") {
    return <TrackProgressScreen onBack={() => setScreen("reportDetails")} onSubmitFeedback={() => setScreen("reportDetails")} />;
  }

  // PROJECT OWNER
  if (screen === "ownerDashboard") {
    return (
      <OwnerDashboardScreen
        onOpenIncidents={() => setScreen("incidentList")}
        onOpenIncident={() => setScreen("ownerIncidentDetail")}
        onResources={() => setScreen("analytics")}
        onProfile={() => Alert.alert("Profile", "Coming soon.")}
      />
    );
  }

  if (screen === "incidentList") {
    return (
      <IncidentListScreen
        onBack={() => setScreen("ownerDashboard")}
        onOpenIncident={() => setScreen("ownerIncidentDetail")}
        onDashboard={() => setScreen("ownerDashboard")}
        onResources={() => setScreen("analytics")}
        onProfile={() => Alert.alert("Profile", "Coming soon.")}
      />
    );
  }

  if (screen === "ownerIncidentDetail") {
    return <OwnerIncidentDetailScreen onBack={() => setScreen("incidentList")} onAssignResources={() => setScreen("resourceAssignment")} />;
  }

  if (screen === "resourceAssignment") {
    return <ResourceAssignmentScreen onBack={() => setScreen("ownerIncidentDetail")} onApproved={() => setScreen("updateStatus")} />;
  }

  if (screen === "updateStatus") {
    return <UpdateStatusScreen onBack={() => setScreen("resourceAssignment")} onUpdated={() => setScreen("ownerDashboard")} />;
  }

  if (screen === "analytics") {
    return (
      <AnalyticsReportsScreen
        onDashboard={() => setScreen("ownerDashboard")}
        onIncidents={() => setScreen("incidentList")}
        onResources={() => setScreen("resourceAssignment")}
        onProfile={() => Alert.alert("Profile", "Coming soon.")}
      />
    );
  }

  // RESOURCE PROVIDER
  if (screen === "providerDashboard") {
    return (
      <ProviderDashboardScreen
        onAddResources={() => setScreen("addResources")}
        onViewRequests={() => setScreen("nearbyRequests")}
        onUpdateAvailability={() => setScreen("addResources")}
        onViewImpact={() => Alert.alert("Your Impact", "Coming soon.")}
        onHome={() => setScreen("providerDashboard")}
        onResources={() => setScreen("myContributions")}
        onRequests={() => setScreen("nearbyRequests")}
        onProfile={() => setScreen("providerProfile")}
      />
    );
  }

  if (screen === "addResources") {
    return <AddResourcesScreen onBack={() => setScreen("providerDashboard")} onSave={() => setScreen("providerDashboard")} />;
  }

  if (screen === "nearbyRequests") {
    return (
      <NearbyRequestsScreen
        onBack={() => setScreen("providerDashboard")}
        onOpenRequest={() => setScreen("requestDetails")}
        onHome={() => setScreen("providerDashboard")}
        onResources={() => setScreen("myContributions")}
        onRequests={() => setScreen("nearbyRequests")}
        onProfile={() => setScreen("providerProfile")}
      />
    );
  }

  if (screen === "requestDetails") {
    return <RequestDetailsScreen onBack={() => setScreen("nearbyRequests")} onOfferSupport={() => setScreen("confirmSupport")} />;
  }

  if (screen === "confirmSupport") {
    return <ConfirmSupportScreen onBackToDashboard={() => setScreen("providerDashboard")} />;
  }

  if (screen === "myContributions") {
    return (
      <MyContributionsScreen
        onBack={() => setScreen("providerDashboard")}
        onHome={() => setScreen("providerDashboard")}
        onResources={() => setScreen("myContributions")}
        onRequests={() => setScreen("nearbyRequests")}
        onProfile={() => setScreen("providerProfile")}
      />
    );
  }

  if (screen === "providerProfile") {
    return (
      <ProviderProfileScreen
        onBack={() => setScreen("providerDashboard")}
        onHome={() => setScreen("providerDashboard")}
        onResources={() => setScreen("myContributions")}
        onRequests={() => setScreen("nearbyRequests")}
        onLogout={() => setScreen("welcome")}
      />
    );
  }

  return null;
}

const roleStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F3F8F7" },
  title: { textAlign: "center", fontSize: 30, fontWeight: "900", color: "#087C68" },
  subtitle: { textAlign: "center", color: "#547169", fontSize: 14, marginTop: 10, marginBottom: 30 },
  button: { backgroundColor: "#087C68", borderRadius: 10, padding: 15, alignItems: "center", marginBottom: 13 },
  buttonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  backText: { textAlign: "center", color: "#087C68", marginTop: 15, fontWeight: "700" },
});
