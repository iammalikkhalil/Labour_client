import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Btn, ImageBtn, Input } from "../../components";
import {
  validateFullName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import Loading from "../../modal/loading";
import { useTheme } from "../../../assets/colors/ThemeContext";
import { login } from "../../reducers/UserSlice"; // Import login action

import axios from "axios";
import { BASE_URL } from "@env"; // Import BASE_URL from environment variables

export default function SignUp() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes with validation
  const handleFullNameChange = (e) => {
    setFullName(e);
    validateFullName({ e, error: setFullNameError });
  };

  const handleEmailChange = (e) => {
    setEmail(e);
    validateEmail({ e, error: setEmailError });
  };

  const handlePasswordChange = (e) => {
    setPassword(e);
    validatePassword({ e, error: setPasswordError });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e);
    validateConfirmPassword({
      password,
      confirmPassword: e,
      error: setConfirmPasswordError,
    });
  };

  const handleSignUp = async () => {
    setLoading(true);

    // Validate input fields
    const fullNameFlag = validateFullName({
      e: fullName,
      error: setFullNameError,
    });
    const emailFlag = validateEmail({ e: email, error: setEmailError });
    const passwordFlag = validatePassword({
      e: password,
      error: setPasswordError,
    });
    const confirmPasswordFlag = validateConfirmPassword({
      password,
      confirmPassword,
      error: setConfirmPasswordError,
    });

    if (fullNameFlag && emailFlag && passwordFlag && confirmPasswordFlag) {
      const userData = { name: fullName, email, password };

      try {
        const response = await axios.post(`${BASE_URL}/auth/signUp`, userData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response:", response); // Log the entire response

        if (response.status >= 200 && response.status < 300) {
          // Display alert informing the user about email verification
          Alert.alert(
            "Registration Successful",
            "A verification email has been sent to your email address. Please verify your account to continue.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("OtpScreen", { action: "verify", email }),
              },
            ]
          );
        } else {
          console.error("Unexpected response status:", response.status);
          Alert.alert(
            "Registration Failed",
            "Unexpected response from server."
          );
        }
      } catch (error) {
        console.error("Sign-up error:", error.response?.data || error.message);

        Alert.alert(
          "Registration Failed",
          error.response?.data?.message ||
            "An error occurred during registration. Please try again later."
        );
      }
    } else {
      // If validation fails, show an alert to notify the user
      Alert.alert("Invalid Input", "Please correct the highlighted errors.");
    }
    setLoading(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {loading && <Loading />}
      <ImageBtn
        marginLeft={25}
        marginTop={50}
        marginBottom={50}
        alignSelf="flex-start"
        source={require("../../../assets/images/back.png")}
        onPress={() => navigation.goBack()}
      />
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Welcome! Create an account to get started.
      </Text>
      <Input
        placeholder="Enter Full Name"
        value={fullName}
        onChangeText={handleFullNameChange}
        error={fullNameError}
        labelFontFamily="Bold"
        fontFamily="Regular"
        inputContainerStyle={{ paddingVertical: 5 }}
        containerStyle={{ marginHorizontal: 15 }}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
        error={emailError}
        labelFontFamily="Bold"
        fontFamily="Regular"
        inputContainerStyle={{ paddingVertical: 5 }}
        containerStyle={{ marginHorizontal: 15 }}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        error={passwordError}
        labelFontFamily="Bold"
        fontFamily="Regular"
        inputContainerStyle={{ paddingVertical: 5 }}
        containerStyle={{ marginHorizontal: 15 }}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        error={confirmPasswordError}
        labelFontFamily="Bold"
        fontFamily="Regular"
        inputContainerStyle={{ paddingVertical: 5 }}
        containerStyle={{ marginHorizontal: 15 }}
        secureTextEntry
      />
      <Btn text="Agree and Register" width="93%" onPress={handleSignUp} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Black",
    color: "#1E232C",
    width: "78%",
    marginLeft: 15,
    marginBottom: 50,
  },
});
