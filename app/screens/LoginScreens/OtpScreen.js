import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Btn, ImageBtn, Input } from "../../components";
import { validateOTP } from "../../utils/validations";
import Loading from "../../modal/loading";
import { useTheme } from "../../../assets/colors/ThemeContext";
import axios from "axios";
import { BASE_URL } from "@env"; // Import BASE_URL from environment variables

export default function OtpScreen(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Get email and action from route params
  const email = props.route.params.email;
  const action = props.route.params.action;

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e) => {
    setOtp(e);
    validateOTP({ e, error: setOtpError });
  };

  // Function to handle OTP verification
  const verifyOtp = async () => {
    setLoading(true);

    try {
      // Determine the correct URL based on action
      const url =
        action === "forget"
          ? `${BASE_URL}/auth/verifyOTP`
          : `${BASE_URL}/auth/verifyEmailOTP`;

      const response = await axios.post(url, {
        email,
        otp,
      });

      if (response.status === 200) {
        if (action === "forget") {
          Alert.alert("Success", "OTP verified successfully!", [
            {
              text: "OK",
              onPress: () => navigation.navigate("ResetPassword", { email }),
            },
          ]);
        } else {
          Alert.alert("Success", "OTP verified successfully!", [
            {
              text: "OK",
              onPress: () => navigation.replace("Login"),
            },
          ]);
        }
      } else {
        Alert.alert(
          "Error",
          response.data.message || "OTP verification failed."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "OTP verification failed."
        );
      } else {
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle Resend OTP
  const resendOtp = async () => {
    setLoading(true);

    try {
      // Request to resend OTP
      const response = await axios.post(`${BASE_URL}/auth/resendOTP`, {
        email,
      });

      if (response.status === 200) {
        Alert.alert("Success", "A new OTP has been sent to your email.");
      } else {
        Alert.alert("Error", response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);

      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to resend OTP."
        );
      } else {
        Alert.alert("Error", "An error occurred. Please try again later.");
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
          OTP Verification
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Enter the verification code we just sent to your email address.
        </Text>
        <Input
          placeholder="Enter OTP"
          value={otp}
          onChangeText={handleOtpChange}
          error={otpError}
          labelFontFamily="Bold"
          fontFamily="Regular"
          keyboardType="numeric"
        />
        <Text> </Text>
        <Btn
          text="Verify"
          width="100%"
          onPress={() => {
            if (validateOTP({ e: otp, error: setOtpError })) {
              verifyOtp();
            }
          }}
        />
      </View>
      <View contentContainerStyle={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
            alignSelf: "center",
          }}
        >
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Didn’t receive code?
          </Text>
          <TouchableOpacity
            onPress={() => {
              resendOtp();
            }}
          >
            <Text
              style={[
                styles.label,
                { fontFamily: "Bold", marginLeft: -15, color: theme.primary },
              ]}
            >
              {" "}
              Resend
            </Text>
          </TouchableOpacity>
        </View>
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
