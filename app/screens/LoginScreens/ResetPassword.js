import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Btn, ImageBtn, Input } from "../../components";
import {
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";
import Loading from "../../modal/loading";
import { useTheme } from "../../../assets/colors/ThemeContext";
import axios from "axios";
import { BASE_URL } from "@env";

export default function ResetPassword(props) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const email = props.route.params.email; // Get email from previous screen
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Function to reset password
  const resetPassword = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/resetPassword`, {
        email,
        newPassword: password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset successfully!", [
          {
            text: "OK",
            onPress: () => navigation.replace("PasswordChanged"),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to reset password."
        );
      }
    } catch (error) {
      console.error("Reset Password error:", error);

      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to reset password."
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
      {loading ? <Loading /> : null}

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
          Create new password
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Your new password must be unique from those previously used.
        </Text>
        <Input
          placeholder="New Password"
          value={password}
          onChangeText={handlePasswordChange}
          error={passwordError}
          labelFontFamily="Bold"
          fontFamily="Regular"
          inputContainerStyle={{ paddingVertical: 5 }}
          containerStyle={{ marginHorizontal: 15 }}
          secureTextEntry // To hide the password input
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
          secureTextEntry // To hide the confirm password input
        />
        <Text> </Text>
        <Btn
          text="Reset Password"
          width="93%"
          containerStyle={{ marginLeft: 13 }}
          onPress={() => {
            let passwordFlag = validatePassword({
              e: password,
              error: setPasswordError,
            });
            let confirmPasswordFlag = validateConfirmPassword({
              password,
              confirmPassword,
              error: setConfirmPasswordError,
            });

            if (passwordFlag && confirmPasswordFlag) {
              resetPassword();
            }
          }}
        />
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
    color: "#1E232C",
    width: "78%",
    marginLeft: 15,
    marginBottom: 15,
  },
  label: {
    fontFamily: "Regular",
    fontSize: 15,
    color: "#6A707C",
    marginHorizontal: 15,
    marginBottom: 50,
  },
});
