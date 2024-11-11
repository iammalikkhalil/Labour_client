// MenuScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../../assets/colors/ThemeContext";
import { menu } from "../../../assets/data/lists";
import ProductCard from "../../components/ProductCard";
import Btn from "../../components/Btn";
import AddToCartModel from "../../modal/AddToCartModel";
import { useSelector } from "react-redux";

export default function Menu({ navigation }) {
  const { theme } = useTheme();
  const modalVisible = useSelector(
    (state) => state.AddToCartModelSlice.addToCartModel.visible
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <SectionList
        sections={menu}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={[styles.categoryHeader, { color: theme.textPrimary }]}>
            {name}
          </Text>
        )}
        renderItem={({ item }) => (
          <View>
            <Text
              style={[styles.subCategoryHeader, { color: theme.textSecondary }]}
            >
              {item.name}
            </Text>
            <View style={styles.productList}>
              {item.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Btn
              text="View Cart"
              width="50%"
              onPress={() => {
                navigation.navigate("Your Cart");
              }}
              fontSize={14}
              paddingVertical={10}
              containerStyle={{ borderWidth: 0 }}
              backgroundColor={theme.secondary}
            />
          </View>
        )}
      />
      {modalVisible && <AddToCartModel />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryHeader: {
    fontSize: 24,
    fontFamily: "Black",
    marginVertical: 10,
    paddingLeft: 10,
  },
  subCategoryHeader: {
    fontSize: 20,
    fontFamily: "Bold",
    marginVertical: 5,
    paddingLeft: 15,
  },
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  footer: {
    alignItems: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
