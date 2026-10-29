
import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen, {
  type BackendRole,
} from "./src/screens/LoginScreen";
import SignUpScreen, {
  type RegisterDetails,
} from "./src/screens/SignUpScreen";
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

import { apiRequest, setAuthToken } from "./src/services/api";

type Screen =
  | "welcome"
  | "login"
  | "signup"
  | "location"
  | "citizenHome"
  | "reportForm"
  | "myReports"
  | "reportDetails"
  | "trackProgress"
  | "ownerDashboard"
  | "incidentList"
  | "ownerIncidentDetail"
  | "resourceAssignment"
  | "updateStatus"
  | "analytics"
  | "providerDashboard"
  | "addResources"
  | "nearbyRequests"
  | "requestDetails"
  | "confirmSupport"
  | "myContributions"
  | "providerProfile";

type RegistrationResponse = {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: BackendRole;
    providerVerified: boolean;
  };
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [showRolePicker, setShowRolePicker] = useState(false);

  // Store the ID of the incident selected by the citizen.
  const [selectedIncidentId, setSelectedIncidentId] = useState("");

  // Role-based navigation
  const navigateToRole = (role: BackendRole) => {
    setShowRolePicker(false);

    switch (role) {
      case "citizen":
        setScreen("citizenHome");
        break;

      case "project_owner":
        setScreen("ownerDashboard");
        break;

      case "resource_provider":
        setScreen("providerDashboard");
        break;

      default:
        Alert.alert("Login error", "The account role is not supported.");
    }
  };

  // Registration
  const handleRegister = async (details: RegisterDetails) => {
    if (details.role === "Project Owner") {
      throw new Error(
        "Project Owner accounts must be created by an administrator."
      );
    }

    const backendRole: BackendRole =
      details.role === "Citizen" ? "citizen" : "resource_provider";

    const response = await apiRequest<RegistrationResponse>(
      "/auth/register",
      {
        method: "POST",
        body: {
          name: details.fullName,
          email: details.email,
          phone: details.phone,
          password: details.password,
          confirmPassword: details.confirmPassword,
          role: backendRole,
          ...(backendRole === "resource_provider"
            ? { organizationName: details.organization }
            : {}),
          locationEnabled: false,
        },
      }
    );

    if (!response.token || !response.user) {
      throw new Error("Invalid registration response from the server.");
    }

    setAuthToken(response.token);
    navigateToRole(response.user.role);

    Alert.alert(
      "Account created",
      backendRole === "resource_provider"
        ? "Your account was created. Resource Provider verification may be required before you can access all features."
        : `Welcome to PRAVAH AI, ${response.user.name}!`
    );
  };

  // Demo role selection
  const chooseDemoRole = (role: "citizen" | "owner" | "provider") => {
    setShowRolePicker(false);

    if (role === "citizen") {
      setScreen("citizenHome");
    } else if (role === "owner") {
      setScreen("ownerDashboard");
    } else {
      setScreen("providerDashboard");
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    setSelectedIncidentId("");
    setShowRolePicker(false);
    setScreen("welcome");
  };

  // Demo role picker
  if (showRolePicker) {
    return (
      <View style={roleStyles.container}>
        <Text style={roleStyles.title}>PRAVAH AI</Text>
        <Text style={roleStyles.subtitle}>Choose a demo experience</Text>

        <TouchableOpacity
          style={roleStyles.button}
          onPress={() => chooseDemoRole("citizen")}
        >
          <Text style={roleStyles.buttonText}>Continue as Citizen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={roleStyles.button}
          onPress={() => chooseDemoRole("owner")}
        >
          <Text style={roleStyles.buttonText}>
            Continue as Project Owner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={roleStyles.button}
          onPress={() => chooseDemoRole("provider")}
        >
          <Text style={roleStyles.buttonText}>
            Continue as Resource Provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setShowRolePicker(false);
            setScreen("welcome");
          }}
        >
          <Text style={roleStyles.backText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Welcome
  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onLogin={() => setScreen("login")}
        onSignUp={() => setScreen("signup")}
      />
    );
  }

  // Login
  if (screen === "login") {
    return (
      <LoginScreen
        onBack={() => setScreen("welcome")}
        onSignUp={() => setScreen("signup")}
        onDemo={() => setShowRolePicker(true)}
        onLogin={navigateToRole}
      />
    );
  }

  // Signup
  if (screen === "signup") {
    return (
      <SignUpScreen
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("login")}
        onRegister={handleRegister}
      />
    );
  }

  // Location permission
  if (screen === "location") {
    return (
      <LocationPermissionScreen
        onContinue={() => setShowRolePicker(true)}
      />
    );
  }

  // =====================================================
  // CITIZEN SCREENS
  // =====================================================

  if (screen === "citizenHome") {
    return (
      <CitizenHomeScreen
        onNavigate={(destination) => {
          if (destination === "Home") {
            setScreen("citizenHome");
          } else if (destination === "Report Incident") {
            setScreen("reportForm");
          } else if (
            destination === "My Reports" ||
            destination === "Reports"
          ) {
            setScreen("myReports");
          } else {
            Alert.alert(destination, "This feature is coming soon.");
          }
        }}
      />
    );
  }

  // Submit a new incident through the backend
  if (screen === "reportForm") {
    return (
      <ReportFormScreen
        onBack={() => setScreen("citizenHome")}
        onSubmit={() => setScreen("myReports")}
      />
    );
  }

  // Citizen reports
  if (screen === "myReports") {
    return (
      <MyReportsScreen
        onBack={() => setScreen("citizenHome")}
        onOpenReport={(id: string) => {
          setSelectedIncidentId(id);
          setScreen("reportDetails");
        }}
        onHome={() => setScreen("citizenHome")}
        onAlerts={() => Alert.alert("Alerts", "Coming soon.")}
        onProfile={() => Alert.alert("Profile", "Coming soon.")}
      />
    );
  }

  // Actual details for the selected incident
  if (screen === "reportDetails") {
    return (
      <ReportDetailsScreen
        incidentId={selectedIncidentId}
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

  // =====================================================
  // PROJECT OWNER SCREENS
  // =====================================================

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
    return (
      <OwnerIncidentDetailScreen
        onBack={() => setScreen("incidentList")}
        onAssignResources={() => setScreen("resourceAssignment")}
      />
    );
  }

  if (screen === "resourceAssignment") {
    return (
      <ResourceAssignmentScreen
        onBack={() => setScreen("ownerIncidentDetail")}
        onApproved={() => setScreen("updateStatus")}
      />
    );
  }

  if (screen === "updateStatus") {
    return (
      <UpdateStatusScreen
        onBack={() => setScreen("resourceAssignment")}
        onUpdated={() => setScreen("ownerDashboard")}
      />
    );
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

  // =====================================================
  // RESOURCE PROVIDER SCREENS
  // =====================================================

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
    return (
      <AddResourcesScreen
        onBack={() => setScreen("providerDashboard")}
        onSave={() => setScreen("providerDashboard")}
      />
    );
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
    return (
      <RequestDetailsScreen
        onBack={() => setScreen("nearbyRequests")}
        onOfferSupport={() => setScreen("confirmSupport")}
      />
    );
  }

  if (screen === "confirmSupport") {
    return (
      <ConfirmSupportScreen
        onBackToDashboard={() => setScreen("providerDashboard")}
      />
    );
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
        onLogout={logout}
      />
    );
  }

  return null;
}

const roleStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F3F8F7",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "900",
    color: "#087C68",
  },
  subtitle: {
    textAlign: "center",
    color: "#547169",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#087C68",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 13,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  backText: {
    textAlign: "center",
    color: "#087C68",
    marginTop: 15,
    fontWeight: "700",
  },
});
