import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import {
  AddRider,
  AddMenuItem,
  Dashboard,
  Menu,
  OrderLists,
  Profile,
  Requests,
  RiderList,
  UserList,
  ViewCart,
  Checkout,
} from "../../screens/DrawerScreens";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location"; // If using Expo
// import Geolocation from '@react-native-community/geolocation'; // If using bare RN project

import { StyleSheet } from "react-native";
import { useTheme } from "../../../assets/colors/ThemeContext";
import TrackRider from "../../screens/DrawerScreens/TrackRider";
// import { updateUserLocation } from "../../redux/userSlice"; // Import action to update location

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userSlice.user);

  // Function to update the rider's current location
  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      // Fetch current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      console.log("location updated....");

      // Dispatch the action to update location in Redux
      // dispatch(updateUserLocation({ latitude, longitude }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // useEffect to update location every 10 seconds if user is a rider
  useEffect(() => {
    if (user.username === "rider") {
      updateLocation(); // Initial call
      const interval = setInterval(updateLocation, 10000); // Update every 10 seconds

      // Clear interval when component unmounts
      return () => clearInterval(interval);
    }
  }, [user.username]); // Depend on username, so it re-evaluates if the user changes

  // Define screens based on role
  const renderScreens = () => {
    return (
      <>
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="Add Rider" component={AddRider} />
        <Drawer.Screen name="Add Menu Item" component={AddMenuItem} />
        <Drawer.Screen name="User List" component={UserList} />
        <Drawer.Screen name="Rider List" component={RiderList} />
        <Drawer.Screen name="Menu" component={Menu} />
        <Drawer.Screen name="Your Cart" component={ViewCart} />
        <Drawer.Screen name="Checkout" component={Checkout} />
        <Drawer.Screen name="Requests" component={Requests} />
        <Drawer.Screen name="OrderLists" component={OrderLists} />
        <Drawer.Screen name="Track Rider" component={TrackRider} />
        <Drawer.Screen name="Edit Profile" component={Profile} />
      </>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: [styles.headerTitle, { color: theme.primaryText }],
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {renderScreens()}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 28,
    fontFamily: "Bold",
  },
});
