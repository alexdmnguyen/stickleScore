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
  const [isDoubles, setIsDoubles] = useState(true);

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
    const servingScore = serveState.servingTeam === 'A' ? teamAScore : teamBScore;
    const opponentScore = serveState.servingTeam === 'A' ? teamBScore : teamAScore;
  
    const scoreText = isDoubles 
      ? `${servingScore}, ${opponentScore}, ${serveState.server}`  // Doubles: includes server number
      : `${servingScore}, ${opponentScore}`; // Singles: excludes server number
  
    Speech.speak(scoreText);
  };

  const handlePoint = (team) => {
    if (gameOver) return;
  
    if (isDoubles) {
      // **Doubles Logic (Default)**
      if (team === 'A' && serveState.servingTeam === 'A') {
        scorePoint('A');
      } else if (team === 'B' && serveState.servingTeam === 'B') {
        scorePoint('B');
      }
      updateServeState(team);
    } else {
      // **Singles Logic**
      if (team === serveState.servingTeam) {
        // Server wins the rally, they score
        scorePoint(team);
      } else {
        // Receiver wins the rally, just switch serve
        switchSinglesServe();
      }
    }
  };
  
  // Function to increase score and animate
  const scorePoint = (team) => {
    if (team === 'A') {
      animateScore(teamAScoreAnim);
      setTimeout(() => {
        setTeamAScore((prev) => {
          const newScoreA = prev + 1;
          checkForWinner(newScoreA, teamBScore); // Pass updated scores
          return newScoreA;
        });
      }, 150);
    } else {
      animateScore(teamBScoreAnim);
      setTimeout(() => {
        setTeamBScore((prev) => {
          const newScoreB = prev + 1;
          checkForWinner(teamAScore, newScoreB); // Pass updated scores
          return newScoreB;
        });
      }, 150);
    }
  };
  
  // Function to animate score change
  const animateScore = (scoreAnim) => {
    Animated.timing(scoreAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  
    setTimeout(() => {
      Animated.timing(scoreAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 150);
  };
  
  // Function to switch serve in Singles (no point awarded)
  const switchSinglesServe = () => {
    setServeState((prev) => ({
      servingTeam: prev.servingTeam === 'A' ? 'B' : 'A',
      server: 1, // Only one server in Singles
    }));
  };
  
  

  const updateServeState = (team) => {

    if (!isDoubles) return;

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

  const checkForWinner = (scoreA, scoreB) => {
    if (scoreA >= 11 && scoreA - scoreB >= 2) {
      setWinner(teamAName);
      setShowWinScreen(true);
      setGameOver(true);
    } else if (scoreB >= 11 && scoreB - scoreA >= 2) {
      setWinner(teamBName);
      setShowWinScreen(true);
      setGameOver(true);
    }
  };
  

  const resetGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    if (!isDoubles) {
      setServeState({ servingTeam: 'A', server: 1 });
    } else {
      setServeState({ servingTeam: 'A', server: 2 });
    }
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

  const startButtonScale = useRef(new Animated.Value(1)).current;

  const startGameAnimation = () => {
    Animated.parallel([
      Animated.timing(startButtonScale, {
        toValue: 1.35, // Slight bounce effect before disappearing
        duration: 400,
        useNativeDriver: true,
      }),
      // Animated.timing(modalOpacity, {
      //   toValue: 0, // Fade out modal
      //   duration: 300,
      //   useNativeDriver: true,
      // }),
      // Animated.timing(modalTranslate, {
      //   toValue: 300, // Slide down
      //   duration: 300,
      //   useNativeDriver: true,
      // }),
    ]).start(() => {
      setShowCustomization(false); // Hide modal after animation
      startButtonScale.setValue(1); // Reset button scale
    });
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
          resetGame={resetGame}
          announceScore={announceScore}
        />
  
        {/* Customization Modal */}
        {showCustomization && (
          <Modal visible={showCustomization} transparent animationType="slide">
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: themes[currentTheme].modalBackground,
                  flexDirection: isLandscape ? 'row' : 'column', 
                  justifyContent: isLandscape ? 'space-evenly' : 'center',
                  alignItems: 'center',
                },
              ]}
            >

              {/* X Close Button */}
              <TouchableOpacity
                style={[styles.dropdownButton, styles.closeButton]} // Reuse dropdownButton styles
                onPress={() => setShowCustomization(false)} // Close modal on press
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={[styles.customtitle, { color: themes[currentTheme].scoreTextColor }]}>
                CUSTOMIZE GAME
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themes[currentTheme].inputBackground, color: themes[currentTheme].inputTextColor },
                ]}
                placeholder="Team A Name"
                placeholderTextColor={themes[currentTheme].inputTextColor}
                value={teamAName}
                onChangeText={setTeamAName}
              />
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: themes[currentTheme].inputBackground, color: themes[currentTheme].inputTextColor },
                ]}
                placeholder="Team B Name"
                placeholderTextColor={themes[currentTheme].inputTextColor}
                value={teamBName}
                onChangeText={setTeamBName}
              />
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.themeButton, isDoubles && styles.selectedButton]}
                  onPress={() => setIsDoubles(true)}
                >
                  <Text style={styles.optionText}>Doubles</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.themeButton, !isDoubles && styles.selectedButton]}
                  onPress={() => setIsDoubles(false)}
                >
                  <Text style={styles.optionText}>Singles</Text>
                </TouchableOpacity>
              </View>

              {/* Theme Selection */}
              <View style={styles.themeButtonGroup}>
                <TouchableOpacity
                  style={[styles.themeButton, currentTheme === 'default' && styles.selectedButton]}
                  onPress={() => changeTheme('default')}
                >
                  <Text style={styles.optionText}>Day Theme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.themeButton, currentTheme === 'retroDark' && styles.selectedButton]}
                  onPress={() => changeTheme('retroDark')}
                >
                  <Text style={styles.optionText}>Night Theme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.themeButton, currentTheme === 'arcade' && styles.selectedButton]}
                  onPress={() => changeTheme('arcade')}
                >
                  <Text style={styles.optionText}>Pro Theme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.themeButton, currentTheme === 'modern' && styles.selectedButton]}
                  onPress={() => changeTheme('modern')}
                >
                  <Text style={styles.optionText}>Modern Theme</Text>
                </TouchableOpacity>
              </View>

              {/* Start Game Button */}
              <TouchableOpacity 
                style={styles.startButton} 
                onPress={startGameAnimation}
                activeOpacity={0.8}
              >
                <Animated.Text style={[styles.startButtonText, { transform: [{ scale: startButtonScale }] }]}>
                  Start Game!
                </Animated.Text>
              </TouchableOpacity>

            </Animated.View>
          </Modal>
        )}

  
        {/* Win Screen Modal */}
        {showWinScreen && (
          <Modal visible={showWinScreen} transparent animationType="fade">
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: themes[currentTheme].modalBackground },
              ]}
            >
              <Text
                style={[
                  styles.winTitle,
                  { color: themes[currentTheme].scoreTextColor },
                ]}
              >
                Congratulations to{' '}
                <Text style={{ color: themes[currentTheme].winnerTextColor }}>
                  {winner}
                </Text>
                !
              </Text>
              <Text
                style={[
                  styles.winText,
                  { color: themes[currentTheme].scoreTextColor },
                ]}
              >
                {teamAName}: {teamAScore} | {teamBName}: {teamBScore}
              </Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  onPress={resetGame}
                  style={[styles.themeButton, styles.selectedButton]} // Same button style as customization modal
                >
                  <Text style={styles.optionText}>Restart Game</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={newGame}
                  style={[styles.themeButton, styles.selectedButton]}
                >
                  <Text style={styles.optionText}>New Game</Text>
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
                      isDoubles={isDoubles}
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
                      isDoubles={isDoubles}
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
                    isDoubles={isDoubles}
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
                    isDoubles={isDoubles}
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
                    isDoubles={isDoubles}
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
                    isDoubles={isDoubles}
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
                      isDoubles={isDoubles}
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
                      isDoubles={isDoubles}
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
                        isDoubles={isDoubles}
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
                        isDoubles={isDoubles}
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
                      isDoubles={isDoubles}
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
                      isDoubles={isDoubles}
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