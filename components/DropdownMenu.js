import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../styles';

const DropdownMenu = ({ toggleDropdown, showDropdown, pickImage, changeBackgroundColor, openCustomization, resetGame, announceScore }) => (
  showDropdown && (
    <View style={styles.dropdownMenu}>
      {/* <TouchableOpacity onPress={pickImage} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Upload Custom Background</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeBackgroundColor('lightblue')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Light Blue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeBackgroundColor('lightgreen')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Light Green</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeBackgroundColor('lightcoral')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Light Coral</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeBackgroundColor('white')} style={styles.menuItem}>
        <Text style={styles.menuItemText}>White</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => { openCustomization(); toggleDropdown(); }} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Customize Game</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity onPress={() => { announceScore(); toggleDropdown(); }} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Announce Score</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity onPress={resetGame} style={styles.menuItem}>
        <Text style={styles.menuItemText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  )
);

export default DropdownMenu;
