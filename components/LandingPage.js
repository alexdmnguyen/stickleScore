import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles, {themes} from '../styles';

const LandingPage = ({ startGame }) => {
  const [currentTheme, setCurrentTheme] = useState('default'); // default theme is 'day'

  // Handle starting the game
  const handleStartGame = () => {
    startGame(); // Trigger the parent component's startGame function
  };

  // Handle theme selection
  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <View style={[styles.landingContainer, { backgroundColor: themes[currentTheme].backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PickleScore</Text>
        <Text style={styles.subHeaderText}>Track your pickleball game easily!</Text>
      </View>

      {/* Main Action Button */}
      <TouchableOpacity style={[styles.startButton, { backgroundColor: themes[currentTheme].buttonBackground }]} onPress={handleStartGame}>
        <Text style={[styles.startButtonText, { color: themes[currentTheme].buttonTextColor }]}>Start Game</Text>
      </TouchableOpacity>

      {/* Theme Selection Section */}
      <View style={styles.themeSection}>
        <Text style={styles.themeTitle}>Choose Your Theme</Text>
        <View style={styles.themeButtonGroup}>
          <TouchableOpacity
            style={[styles.themeButton, currentTheme === 'default' && styles.selectedButton]}
            onPress={() => handleThemeChange('default')}>
            <Text style={styles.optionText}>Default</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, currentTheme === 'retroDark' && styles.selectedButton]}
            onPress={() => handleThemeChange('retroDark')}>
            <Text style={styles.optionText}>Retro Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, currentTheme === 'arcade' && styles.selectedButton]}
            onPress={() => handleThemeChange('arcade')}>
            <Text style={styles.optionText}>Arcade</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, currentTheme === 'modern' && styles.selectedButton]}
            onPress={() => handleThemeChange('modern')}>
            <Text style={styles.optionText}>Modern</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 PickleScore</Text>
      </View>
    </View>
  );
};

export default LandingPage;
