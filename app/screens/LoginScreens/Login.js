import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Btn, Input } from "../../components";
import { validateEmail, validatePassword } from "../../utils/validations";
import Loading from "../../modal/loading";
import { useTheme } from "../../../assets/colors/ThemeContext";
import { useDispatch } from "react-redux";
import { login } from "../../reducers/UserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";

import axios from "axios";

export default function Login() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle email change
  const handleEmailChange = (e) => {
    setEmail(e);
    validateEmail({ e, error: setEmailError });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e);
    validatePassword({ e, error: setPasswordError });
  };

  const handleLogin = async () => {
    setLoading(true);

    // Trim inputs when form is submitted
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Perform validation
    const emailFlag = validateEmail({ e: trimmedEmail, error: setEmailError });
    const passwordFlag = validatePassword({
      e: trimmedPassword,
      error: setPasswordError,
    });

    if (emailFlag && passwordFlag) {
      try {
        const response = await axios.post(
          `${BASE_URL}/auth/login`,
          {
            email: trimmedEmail,
            password: trimmedPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const { user } = response.data;

          // Save user data to AsyncStorage
          await AsyncStorage.setItem("user", JSON.stringify(user));

          // Dispatch login action to save user data to Redux store
          dispatch(login(user));

          // Display success alert
          Alert.alert("Login Successful", "Welcome back!", [
            { text: "OK", onPress: () => navigation.replace("Welcome") },
          ]);
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);

        // Check if the error is due to unverified email (403 status code)
        if (error.response?.status === 403) {
          Alert.alert(
            "Account Not Verified",
            "Your account is not verified. Please check your email for the verification link.",
            [
              {
                text: "OK",
                onPress: () =>
                  navigation.navigate("OtpScreen", { action: "verify", email }),
              },
            ]
          );
        } else {
          // Display general login error alert
          Alert.alert(
            "Login Failed",
            error.response?.data?.message ||
              "Unauthorized. Please check your credentials or try again later."
          );
        }
      }
    } else {
      // If validation fails, show an alert to notify the user
      Alert.alert("Invalid Input", "Please check your email and password.");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Welcome back! Glad to see you, Again!
      </Text>

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

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
        style={{ alignSelf: "flex-end", marginRight: 20, marginBottom: 50 }}
      >
        <Text style={[styles.label, { color: theme.primary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <Btn text="Login" width="93%" onPress={handleLogin} />

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 50,
          alignSelf: "center",
        }}
      >
        <Text
          style={[
            styles.label,
            { color: theme.textSecondary, fontFamily: "Regular" },
          ]}
        >
          Don’t have an account?
        </Text>
        <Text style={[styles.label, { color: theme.primary }]}>
          {" "}
          Register Now
        </Text>
      </TouchableOpacity>

      {loading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Black",
    width: "78%",
    marginLeft: 15,
    marginBottom: 50,
  },
  label: {
    fontFamily: "Bold",
    fontSize: 14,
  },
});
