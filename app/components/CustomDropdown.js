import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useTheme } from "../../assets/colors/ThemeContext";

const CustomDropdown = ({ data, selectedValue, setSelectedValue }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const { theme } = useTheme();
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const selectItem = (value) => {
    setSelectedValue(value);
    setDropdownVisible(false);
  };

  const selectedLabel =
    data.find((item) => item.value === selectedValue)?.label || "Select Role";

  return (
    <View style={[{ borderColor: theme.primary }, styles.dropdownContainer]}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>{selectedLabel}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <Modal transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          />
          <View style={styles.dropdownList}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.dropdownItem}
                onPress={() => selectItem(item.value)}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  dropdownButton: {
    padding: 10,
    paddingVertical: 15,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownList: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CustomDropdown;
