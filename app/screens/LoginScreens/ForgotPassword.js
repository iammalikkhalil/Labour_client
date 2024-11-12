import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Btn, ImageBtn, Input } from "../../components";
import { validateEmail } from "../../utils/validations";
import Loading from "../../modal/loading";
import { useTheme } from "../../../assets/colors/ThemeContext";
import axios from "axios";
import { BASE_URL } from "@env"; // Import BASE_URL from environment variables

export default function ForgotPassword() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e);
    validateEmail({ e, error: setEmailError });
  };

  // Function to handle "Send Code" for forgot password
  const sendCode = async () => {
    setLoading(true);

    console.log(email);

    try {
      const response = await axios.post(`${BASE_URL}/auth/forgotPassword`, {
        email,
      });

      if (response.status === 200) {
        Alert.alert("Success", "An OTP has been sent to your email.");
        // Navigate to the OTP screen with necessary parameters
        navigation.navigate("OtpScreen", { action: "forget", email });
      } else {
        Alert.alert("Error", response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Forgot Password error:", error);

      // Enhanced error handling based on response codes
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message;

        // Custom messages for different statuses
        if (status === 400) {
          Alert.alert("Error", message || "Please enter a valid email.");
        } else if (status === 404) {
          Alert.alert(
            "Error",
            message || "User with this email does not exist."
          );
        } else if (status === 403) {
          Alert.alert(
            "Error",
            message || "Email not verified. Please verify your email.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("OtpScreen", { action: "verify", email }),
              },
            ]
          );
        } else {
          Alert.alert(
            "Error",
            message || "Failed to send OTP. Please try again."
          );
        }
      } else {
        // General network or server error
        Alert.alert(
          "Error",
          "Network error. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && <Loading />}

      <View style={{ height: "85%" }}>
        <ImageBtn
          marginLeft={25}
          marginTop={50}
          marginBottom={50}
          alignSelf="flex-start"
          source={require("../../../assets/images/back.png")}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Don't worry! It occurs. Please enter the email address linked with
          your account.
        </Text>
        <Input
          placeholder="Enter Email"
          value={email}
          onChangeText={handleEmailChange}
          error={emailError}
          labelFontFamily="Bold"
          fontFamily="Regular"
        />
        <Text> </Text>
        <Btn
          text="Send Code"
          width="100%"
          containerStyle={{ marginLeft: 0 }}
          onPress={() => {
            let emailFlag = validateEmail({ e: email, error: setEmailError });
            if (emailFlag) {
              sendCode();
            }
          }}
        />
      </View>
      <View contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
            alignSelf: "center",
          }}
        >
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Remember Password?
          </Text>
          <Text
            style={[
              styles.label,
              { fontFamily: "Bold", marginLeft: -15, color: theme.primary },
            ]}
          >
            {" "}
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Black",
    width: "78%",
    marginLeft: 15,
    marginBottom: 15,
  },
  label: {
    fontFamily: "Regular",
    fontSize: 15,
    marginHorizontal: 15,
    marginBottom: 50,
  },
});
