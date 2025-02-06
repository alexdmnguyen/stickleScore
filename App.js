import React, { useState, useRef } from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, ImageBackground, Animated, TextInput, StyleSheet, Modal, Button, useWindowDimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import AnimatedPointButton from './components/AnimatedPointButton';
import DropdownMenu from './components/DropdownMenu';
import Scoreboard from './components/Scoreboard';
import styles, {themes} from './styles';

export default function App() {
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [serveState, setServeState] = useState({ servingTeam: 'A', server: 2 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [gameOver, setGameOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [winner, setWinner] = useState(null); // Track the winning team
  const [showWinScreen, setShowWinScreen] = useState(false); // Show the win modal

  const [teamAName, setTeamAName] = useState('Team A');
  const [teamBName, setTeamBName] = useState('Team B');
  const [isDoubles, setIsDoubles] = useState(false); // Default to "Best of 1"

  const [currentTheme, setCurrentTheme] = useState('default');
  const [showCustomization, setShowCustomization] = useState(true); // Show customization window initially

  const teamAScoreAnim = useRef(new Animated.Value(1)).current;
  const teamBScoreAnim = useRef(new Animated.Value(1)).current;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const announceScore = () => {
    const scoreText = `${teamAScore}, ${teamBScore}, ${serveState.server}`;
    Speech.speak(scoreText);
  };

  const handlePoint = (team) => {
    if (gameOver) return;

    if (team === 'A' && serveState.servingTeam === 'A') {
      Animated.timing(teamAScoreAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setTeamAScore((prev) => prev + 1);
        Animated.timing(teamAScoreAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 150);
    } else if (team === 'B' && serveState.servingTeam === 'B') {
      Animated.timing(teamBScoreAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setTeamBScore((prev) => prev + 1);
        Animated.timing(teamBScoreAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }, 150);
    }

    updateServeState(team);
    checkForWinner();
  };

  const updateServeState = (team) => {
    if (team === 'A') {
      if (serveState.servingTeam === 'A') return;
      else if (serveState.servingTeam === 'B') {
        if (serveState.server === 1) {
          setServeState({ servingTeam: 'B', server: 2 });
        } else {
          setServeState({ servingTeam: 'A', server: 1 });
        }
      }
    } else if (team === 'B') {
      if (serveState.servingTeam === 'A') {
        if (serveState.server === 1) {
          setServeState({ servingTeam: 'A', server: 2 });
        } else {
          setServeState({ servingTeam: 'B', server: 1 });
        }
      } else if (serveState.servingTeam === 'B') return;
    }
  };

  const checkForWinner = () => {
    if (teamAScore >= 11 && teamAScore - teamBScore >= 2) {
      setWinner(teamAName);
      setShowWinScreen(true);
      setGameOver(true);
    } else if (teamBScore >= 11 && teamBScore - teamAScore >= 2) {
      setWinner(teamBName);
      setShowWinScreen(true);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setServeState({ servingTeam: 'A', server: 2 });
    setGameOver(false);
    setShowWinScreen(false);
    setWinner(null);
  };

  const newGame = () => {
    resetGame();
    setShowCustomization(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your photos.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setBackgroundImage(result.assets[0].uri);
    }
  };

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
    setShowDropdown(false);
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const toggleTheme = (theme) => {
    setCurrentTheme(theme);
  };
  

  return (
    <ImageBackground
      source={
        currentTheme === 'arcade'
          ? null // No background image for arcade theme
          : backgroundImage
          ? { uri: backgroundImage }
          : currentTheme === 'retroDark'
          ? require('./assets/pickleball-night.jpg')
          : currentTheme === 'modern'
          ? null
          : require('./assets/pickleball-background.jpg') // Default theme background
      }
      style={[
        styles.backgroundImage,
        {
          backgroundColor: currentTheme === 'arcade' ? 'rgba(0, 0, 0, 0.9)' : themes[currentTheme].backgroundColor,
        },
      ]}
      resizeMode="cover"
      blurRadius={currentTheme === 'arcade' ? 0 : 4} // No blur for arcade theme
    >
      {/* <SafeAreaView style={styles.container}> */}
        {/* Dropdown Menu Button */}
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
          <Text style={styles.dropdownButtonText}>☰</Text>
        </TouchableOpacity>
  
        <DropdownMenu
          toggleDropdown={toggleDropdown}
          showDropdown={showDropdown}
          openCustomization={() => setShowCustomization(true)}
        />
  
        {/* Customization Modal */}
        {showCustomization && (
          <Modal visible={showCustomization} transparent animationType="fade">
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: themes[currentTheme].modalBackground },
              ]}
            >
              <Text
                style={[
                  styles.customtitle,
                  { color: themes[currentTheme].scoreTextColor },
                ]}
              >
                Customize Game
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themes[currentTheme].inputBackground,
                    color: themes[currentTheme].inputTextColor,
                  },
                ]}
                placeholder="Team A Name"
                placeholderTextColor={themes[currentTheme].inputTextColor}
                value={teamAName}
                onChangeText={setTeamAName}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themes[currentTheme].inputBackground,
                    color: themes[currentTheme].inputTextColor,
                  },
                ]}
                placeholder="Team B Name"
                placeholderTextColor={themes[currentTheme].inputTextColor}
                value={teamBName}
                onChangeText={setTeamBName}
              />
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    isDoubles && styles.selectedButton,
                  ]}
                  onPress={() => setIsDoubles(true)}
                >
                  <Text style={styles.optionText}>Singles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    !isDoubles && styles.selectedButton,
                  ]}
                  onPress={() => setIsDoubles(false)}
                >
                  <Text style={styles.optionText}>Doubles</Text>
                </TouchableOpacity>
              </View>
              <Button title="Start Game!" onPress={() => setShowCustomization(false)} />
              {/* Theme selection */}
              <TouchableOpacity onPress={() => changeTheme('default')}>
                <Text
                  style={[
                    styles.optionText,
                    { color: themes[currentTheme].scoreTextColor },
                  ]}
                >
                  Day Theme
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme('retroDark')}>
                <Text
                  style={[
                    styles.optionText,
                    { color: themes[currentTheme].scoreTextColor },
                  ]}
                >
                  Night Theme
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme('arcade')}>
                <Text
                  style={[
                    styles.optionText,
                    { color: themes[currentTheme].scoreTextColor },
                  ]}
                >
                  Pro Theme
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeTheme('modern')}>
                <Text
                  style={[
                    styles.optionText,
                    { color: themes[currentTheme].scoreTextColor },
                  ]}
                >
                  Modern Theme
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
  
        {/* Win Screen Modal */}
        {showWinScreen && (
          <Modal visible={showWinScreen} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.winTitle}>
                Congratulations to {winner}!
              </Text>
              <Text style={styles.winText}>
                {teamAName}: {teamAScore} | {teamBName}: {teamBScore}
              </Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={resetGame} style={styles.button}>
                  <Text style={styles.buttonText}>Restart Game</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={newGame} style={styles.button}>
                  <Text style={styles.buttonText}>New Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
  
        <View style={[styles.innerContainer, isLandscape && styles.landscapeContainer]}>
          {!isLandscape ? (
            <>
              {currentTheme === 'arcade' ? (
                <Scoreboard
                  teamAScore={teamAScore}
                  teamBScore={teamBScore}
                  handlePoint={handlePoint}
                  teamAName={teamAName}
                  teamBName={teamBName}
                  theme={currentTheme}
                  serveState={serveState}
                />
              ) : currentTheme === 'modern' ? (
                <View style={styles.modernLayout}>
                  <View style={styles.topHalf}>
                    <Text style={styles.modernTeamAName}>{teamAName}</Text>
                    <AnimatedPointButton
                      onPress={() => handlePoint('A')}
                      score={teamAScore}
                      scoreAnim={teamAScoreAnim}
                      serving={serveState.servingTeam === 'A'}
                      serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                      currentTheme={currentTheme}
                      team="A" 
                    />
                  </View>
                  <View style={styles.bottomHalf}>
                    {/* <Scoreboard
                      teamAScore={teamAScore}
                      teamBScore={teamBScore}
                      serveState={serveState}
                      teamAName={teamAName}
                      teamBName={teamBName}
                      theme={currentTheme}
                      handlePoint={handlePoint}
                    /> */}
                    <AnimatedPointButton
                      onPress={() => handlePoint('B')}
                      score={teamBScore}
                      scoreAnim={teamBScoreAnim}
                      serving={serveState.servingTeam === 'B'}
                      serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                      currentTheme={currentTheme}
                      team="B" 
                    />
                    <Text style={styles.modernTeamBName}>{teamBName}</Text>
                  </View>
                </View>
              ) : currentTheme === 'retroDark' ? (
                <>
                  <Text style={styles.teamANameText}>{teamAName}</Text>
                  <AnimatedPointButton
                    onPress={() => handlePoint('A')}
                    score={teamAScore}
                    scoreAnim={teamAScoreAnim}
                    serving={serveState.servingTeam === 'A'}
                    serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                    currentTheme={currentTheme}
                  />
                  {/* <Scoreboard
                    teamAScore={teamAScore}
                    teamBScore={teamBScore}
                    serveState={serveState}
                    teamAName={teamAName}
                    teamBName={teamBName}
                    theme={currentTheme}
                    handlePoint={handlePoint}
                  /> */}
                  <AnimatedPointButton
                    onPress={() => handlePoint('B')}
                    score={teamBScore}
                    scoreAnim={teamBScoreAnim}
                    serving={serveState.servingTeam === 'B'}
                    serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                    currentTheme={currentTheme}
                  />
                  <Text style={styles.teamBNameText}>{teamBName}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.teamANameText}>{teamAName}</Text>
                  <AnimatedPointButton
                    onPress={() => handlePoint('A')}
                    score={teamAScore}
                    scoreAnim={teamAScoreAnim}
                    serving={serveState.servingTeam === 'A'}
                    serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                  />
                  {/* <Scoreboard
                    teamAScore={teamAScore}
                    teamBScore={teamBScore}
                    serveState={serveState}
                    teamAName={teamAName}
                    teamBName={teamBName}
                    theme={currentTheme}
                    handlePoint={handlePoint}
                  /> */}
                  <AnimatedPointButton
                    onPress={() => handlePoint('B')}
                    score={teamBScore}
                    scoreAnim={teamBScoreAnim}
                    serving={serveState.servingTeam === 'B'}
                    serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                  />
                  <Text style={styles.teamBNameText}>{teamBName}</Text>
                </>
              )}
            </>
          ) : (
            <>
              {currentTheme === 'arcade' ? (
                <View style={styles.landscapeLayout}>
                  <Scoreboard
                      teamAScore={teamAScore}
                      teamBScore={teamBScore}
                      handlePoint={handlePoint}
                      teamAName={teamAName}
                      teamBName={teamBName}
                      theme={currentTheme}
                      serveState={serveState}
                    />
                </View>
 
              ) : currentTheme === 'modern' ? (
                <View style={styles.landscapeModernLayout}>
                  <View style={styles.leftHalf}>
                    <Text style={styles.teamANameLand}>{teamAName}</Text>
                    <AnimatedPointButton
                      onPress={() => handlePoint('A')}
                      score={teamAScore}
                      scoreAnim={teamAScoreAnim}
                      serving={serveState.servingTeam === 'A'}
                      serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                      currentTheme={currentTheme}
                      team="A" 
                    />
                  </View>
                  <View style={styles.rightHalf}>
                    <Text style={styles.teamBNameLand}>{teamBName}</Text>
                    {/* <Scoreboard
                      teamAScore={teamAScore}
                      teamBScore={teamBScore}
                      serveState={serveState}
                      teamAName={teamAName}
                      teamBName={teamBName}
                      theme={currentTheme}
                      handlePoint={handlePoint}
                    /> */}
                    <AnimatedPointButton
                      onPress={() => handlePoint('B')}
                      score={teamBScore}
                      scoreAnim={teamBScoreAnim}
                      serving={serveState.servingTeam === 'B'}
                      serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                      currentTheme={currentTheme}
                      team="B" 
                    />
                  </View>
                </View>
              ) : currentTheme === 'retroDark' ? (
                <>
                  <View style={styles.landscapeLayout}>
                    <View style={styles.teamContainerLand}>
                      <Text style={styles.teamANameLand}>{teamAName}</Text>
                      <AnimatedPointButton
                        onPress={() => handlePoint('A')}
                        score={teamAScore}
                        scoreAnim={teamAScoreAnim}
                        serving={serveState.servingTeam === 'A'}
                        serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                        currentTheme={currentTheme}
                      />
                    </View>
                    {/* <Scoreboard
                      teamAScore={teamAScore}
                      teamBScore={teamBScore}
                      serveState={serveState}
                      teamAName={teamAName}
                      teamBName={teamBName}
                      theme={currentTheme}
                      handlePoint={handlePoint}
                    /> */}
                    <View style={styles.teamContainerLand}>
                      <Text style={styles.teamBNameLand}>{teamBName}</Text>
                      <AnimatedPointButton
                        onPress={() => handlePoint('B')}
                        score={teamBScore}
                        scoreAnim={teamBScoreAnim}
                        serving={serveState.servingTeam === 'B'}
                        serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                        currentTheme={currentTheme}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.landscapeLayout}>
                  <View style={styles.teamContainerLand}>
                    <Text style={styles.teamANameLand}>{teamAName}</Text>
                    <AnimatedPointButton
                      onPress={() => handlePoint('A')}
                      score={teamAScore}
                      scoreAnim={teamAScoreAnim}
                      serving={serveState.servingTeam === 'A'}
                      serveCount={serveState.servingTeam === 'A' ? serveState.server : 0}
                    />
                  </View>
                  {/* <Scoreboard
                    teamAScore={teamAScore}
                    teamBScore={teamBScore}
                    serveState={serveState}
                    teamAName={teamAName}
                    teamBName={teamBName}
                    theme={currentTheme}
                    handlePoint={handlePoint}
                  /> */}
                  <View style={styles.teamContainerLand}>
                    <Text style={styles.teamBNameLand}>{teamBName}</Text>
                    <AnimatedPointButton
                      onPress={() => handlePoint('B')}
                      score={teamBScore}
                      scoreAnim={teamBScoreAnim}
                      serving={serveState.servingTeam === 'B'}
                      serveCount={serveState.servingTeam === 'B' ? serveState.server : 0}
                    />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      {/* </SafeAreaView> */}
    </ImageBackground>
  );
  
}