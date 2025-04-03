import React, { useState, useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import styles, {themes} from '../styles';

const AnimatedPointButton = ({ onPress, score, scoreAnim, serving, serveCount, currentTheme, team, isDoubles }) => {
  const [opacityButton] = useState(new Animated.Value(1));
  const [opacityImage] = useState(new Animated.Value(0));
  const [spinValue] = useState(new Animated.Value(0));
  const [sounds, setSounds] = useState([]);

  const circleStyle = currentTheme === 'modern' 
    ? [styles.circle, { backgroundColor: 'rgb(255, 255, 255)' }] // For modern theme
    : currentTheme === 'retroDark'
    ? [styles.circle, { backgroundColor: 'rgb(30,33,36)' }] // For modern theme
    : styles.circle; // Default for other themes (arcade, etc.)

  const scoreTextColor = currentTheme === 'modern' 
    ? (team === 'A' ? 'rgb(183, 224, 255)' : 'rgb(239, 90, 111)')
    : currentTheme === 'retroDark'
    ? 'rgb(255, 255, 255)' // For modern theme
    : '#fff'; 

  // Load the sound effects when the component mounts
  useEffect(() => {
    const loadSounds = async () => {
      const soundFiles = [
        require('../assets/pickleballhit.mp3'),
        require('../assets/pickleballhit2.mp3'),
        require('../assets/pickleballhit3.mp3'),
        require('../assets/pickleballhit4.mp3'),
      ];

      const loadedSounds = await Promise.all(
        soundFiles.map(async (file) => {
          const { sound } = await Audio.Sound.createAsync(file);
          return sound;
        })
      );

      setSounds(loadedSounds);
    };

    loadSounds();

    // Cleanup sounds when the component unmounts
    return () => {
      sounds.forEach((sound) => {
        if (sound) {
          sound.unloadAsync();
        }
      });
    };
  }, []);

  const handlePress = async () => {
    // Randomly select a sound and play it
    if (sounds.length > 0) {
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      await randomSound.replayAsync();
    }

    spinValue.setValue(0); // Reset the spin value

    Animated.parallel([
      Animated.timing(opacityButton, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityImage, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(spinValue, {
          toValue: 1, // Spin completes
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityImage, {
          toValue: 0,
          duration: 250,
          delay: 350,
          useNativeDriver: true,
        }),
        Animated.timing(opacityButton, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onPress(); // Call the onPress function after all animations are done
      });
    });
  };

  // Interpolating the spinValue to create a rotation effect
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'], // Two full spins
  });

  // Interpolating blurRadius for the spinning image
  const blurRadius = spinValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [4, 0, 0], // No blur at start and end, max blur in the middle
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.wrapper}>
          {/* Button with the team's score */}
          <Animated.View style={[circleStyle, { opacity: opacityButton }]}>
            {/* Use Animated.Text with the animated score opacity */}
            <Animated.Text style={[styles.scoreText, { opacity: scoreAnim, color: scoreTextColor }]}>
              {score}
            </Animated.Text>
            {/* Small circles representing serve */}
            {serving && (
              <View
              style={[
                styles.serveIndicators,
                { justifyContent: isDoubles ? 'space-between' : 'center' }, // Dynamically adjust layout
              ]}
              >
                {/* In Singles, only show ONE serve circle */}
                {isDoubles ? (
                  <>
                    <View
                      style={[
                        styles.serveCircle,
                        { opacity: serveCount >= 1 ? 1 : 0, backgroundColor: scoreTextColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.serveCircle,
                        { opacity: serveCount === 2 ? 1 : 0, backgroundColor: scoreTextColor },
                      ]}
                    />
                  </>
                ) : (
                  <View
                    style={[
                      styles.singlesServeCircle,
                      { opacity: serving ? 1 : 0, backgroundColor: scoreTextColor },
                    ]}
                  />
                )}
              </View>
            )}
          </Animated.View>

          {/* Spinning Image with Dynamic Blur */}
          <Animated.Image
            source={require('../assets/pickleball.png')}
            style={[styles.image, { opacity: opacityImage, transform: [{ rotate: spin }] }]}
            blurRadius={blurRadius} // Apply the dynamic blur
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AnimatedPointButton;
