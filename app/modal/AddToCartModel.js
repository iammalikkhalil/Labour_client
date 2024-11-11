import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../assets/colors/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Btn, Input } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { closeCartModel } from "../reducers/AddToCartModelSlice";

import { addProductToCart, addProductToCartAsync } from "../reducers/CartSlice";

import { validateQuantity, validateFullName } from "../utils/validations";

export default function AddToCartModel() {
  const product = useSelector(
    (state) => state.AddToCartModelSlice.addToCartModel.data
  );

  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(true);
  const [flavour, setFlavour] = useState("");
  const [quantity, setQuantity] = useState("");
  const [flavourError, setFlavourError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle email change
  const handleFLavourChange = (e) => {
    setFlavour(e);
    validateFullName({ e, error: setFlavourError });
  };

  // Handle password change
  const handleQuantityChange = (e) => {
    setQuantity(e);
    validateQuantity({ e, error: setQuantityError });
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      // Perform validation
      const flavourFLag = validateFullName({
        e: flavour,
        error: setFlavourError,
      });
      const quantityFLag = validateQuantity({
        e: quantity,
        error: setQuantityError,
      });
      if (flavourFLag && quantityFLag) {
        product.flavour = flavour;
        product.quantity = quantity;

        const newProduct = {
          ...product,
          flavour,
          quantity,
        };

        dispatch(addProductToCartAsync(newProduct));
        dispatch(closeCartModel());

        Alert.alert(
          "Added to Cart",
          `Your order has been placed to cart successfully!`,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        style={{
          borderWidth: 3,
        }}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          dispatch(closeCartModel());
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <View
              style={[
                styles.modelHeader,
                {
                  borderBottomColor: theme.textSecondary,
                },
              ]}
            >
              <Text style={[styles.modelHeading, { color: theme.textPrimary }]}>
                Add to Cart
              </Text>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={() => {
                  dispatch(closeCartModel());
                }}
              >
                <Ionicons
                  style={styles.closeIcon}
                  name="close"
                  size={30}
                  color={theme.textSecondary} // Use theme text secondary color
                />
              </TouchableOpacity>
            </View>
            <View style={styles.model}>
              <Input
                placeholder="Enter Flavour"
                value={flavour}
                onChangeText={handleFLavourChange}
                error={flavourError}
                labelFontFamily="Bold"
                fontFamily="Regular"
                inputContainerStyle={{ paddingVertical: 5 }}
                containerStyle={{ marginHorizontal: 15 }}
              />
              <Input
                keyboardType="number-pad"
                placeholder="Enter Quantity"
                value={quantity}
                onChangeText={handleQuantityChange}
                error={quantityError}
                labelFontFamily="Bold"
                fontFamily="Regular"
                inputContainerStyle={{ paddingVertical: 5 }}
                containerStyle={{ marginHorizontal: 15 }}
              />

              <Btn
                text="Add to Cart"
                width="93%"
                containerStyle={{ marginLeft: 10 }}
                onPress={handleAddToCart}
              />
            </View>
            <View style={styles.modelFooter}></View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    elevation: 3,
  },
  modelHeader: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modelHeading: {
    fontFamily: "Bold",
    fontSize: 20,
  },
  closeIconContainer: {
    width: 30,
  },
  closeIcon: {},
  model: {
    width: "100%",
    padding: 20,
    justifyContent: "center",
  },
});
