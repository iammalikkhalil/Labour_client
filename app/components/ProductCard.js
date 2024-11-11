// ProductCard.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "../../assets/colors/ThemeContext";
import Btn from "./Btn";

import { useDispatch } from "react-redux";
import {
  addToCartModel,
  openCartModel,
  closeCartModel,
} from "../reducers/AddToCartModelSlice";

export default function ProductCard({ product }) {
  const { theme } = useTheme();

  const dispatch = useDispatch();

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {product.name}
        </Text>
        <Text style={[styles.price, { color: theme.textSecondary }]}>
          RS {product.price}
        </Text>
      </View>
      <Btn
        text="Add to Cart"
        onPress={() => {
          // console.log(product);
          dispatch(addToCartModel(product));
          dispatch(openCartModel());
        }}
        fontSize={14}
        paddingVertical={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    justifyContent: "flex-start",
    minWidth: 200,
  },
  details: {
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontFamily: "Black",
    fontSize: 20,
  },
  price: {
    fontFamily: "Black",
    fontSize: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
