import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';

const Scoreboard = ({ theme, teamAScore, teamBScore, teamAName, teamBName, serveState, handlePoint }) => {
  const [lastScoredTeam, setLastScoredTeam] = useState(null);
  const scaleAnimA = useRef(new Animated.Value(1)).current;
  const scaleAnimB = useRef(new Animated.Value(1)).current;
  const colorAnimA = useRef(new Animated.Value(0)).current;
  const colorAnimB = useRef(new Animated.Value(0)).current;
  
  const [bannerPosition] = useState(new Animated.Value(0)); // Banner animation
  const starAnim = useRef(new Animated.Value(0)).current;
  
  const handleScoreAnimation = (team) => {
    const isTeamA = team === 'A';
    const scaleAnim = isTeamA ? scaleAnimA : scaleAnimB;
    const colorAnim = isTeamA ? colorAnimA : colorAnimB;

    

    // Scale animation with native driver
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Background color animation (JS-driven)
    Animated.sequence([
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setLastScoredTeam(team);
  };

  useEffect(() => {
    if (lastScoredTeam) {
      handleScoreAnimation(lastScoredTeam);
    }
  }, [teamAScore, teamBScore]);

  useEffect(() => {
    // Banner animation every 30 seconds
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(bannerPosition, {
          toValue: 50, // Move banner back down
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bannerPosition, {
          toValue: 0, // Move banner up
          duration: 1000,
          delay: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 15000); // Run every 30 seconds

    return () => clearInterval(interval);
  }, [bannerPosition]);


  const animatedColorA = colorAnimA.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9ACD32', '#FFD700'],
  });

  const animatedColorB = colorAnimB.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9ACD32', '#FFD700'],
  });

  return (
    <View style={styles.scoreboardContainer}>
      {theme === 'arcade' ? (
        <View style={styles.arcadeScoreboard}>

          {/* Tournament Banner */}
          <Animated.View style={[styles.tournamentBanner, { transform: [{ translateY: bannerPosition }] }]}>
            <Text style={styles.tournamentText}>SSA STICKLE TOUR FINALS</Text>
          </Animated.View>

          {/* Team A */}
          <TouchableOpacity
            style={styles.arcadeTeamBox}
            onPress={() => {
              handlePoint('A');
              handleScoreAnimation('A');
            }}
          >
            <View style={styles.teamNameBoxA}>
              <Text style={styles.arcadeTeamName}>{teamAName}</Text>
              {serveState.servingTeam === 'A' && (
                <View style={styles.serveIndicators}>
                  <View
                    style={[
                      styles.serveCircle,
                      { opacity: serveState.server >= 1 ? 1 : 0 },
                    ]}
                  />
                  <View
                    style={[
                      styles.serveCircle,
                      { opacity: serveState.server === 2 ? 1 : 0 },
                    ]}
                  />
                </View>
              )}
            </View>
            <Animated.View
              style={[
                styles.arcadeScoreBoxA,
                {
                  backgroundColor: animatedColorA,
                  zIndex: lastScoredTeam === 'A' ? 1 : 0,
                },
              ]}
            >
              <Text style={styles.arcadeScore}>{teamAScore}</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* Team B */}
          <TouchableOpacity
            style={styles.arcadeTeamBox}
            onPress={() => {
              handlePoint('B');
              handleScoreAnimation('B');
            }}
          >
            <View style={styles.teamNameBoxB}>
              <Text style={styles.arcadeTeamName}>{teamBName}</Text>
              {serveState.servingTeam === 'B' && (
                <View style={styles.serveIndicators}>
                  <View
                    style={[
                      styles.serveCircle,
                      { opacity: serveState.server >= 1 ? 1 : 0 },
                    ]}
                  />
                  <View
                    style={[
                      styles.serveCircle,
                      { opacity: serveState.server === 2 ? 1 : 0 },
                    ]}
                  />
                </View>
              )}
            </View>
            <Animated.View
              style={[
                styles.arcadeScoreBoxB,
                {
                  backgroundColor: animatedColorB,
                  zIndex: lastScoredTeam === 'B' ? 1 : 0,
                },
              ]}
            >
              <Text style={styles.arcadeScore}>{teamBScore}</Text>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.pickleballContainer}>
            <Image source={require('../assets/pickleball.png')} style={styles.pickleballIcon} />
          </View>

        </View>
      ) : (
        <View style={styles.defaultScoreboard}>
          <Text style={styles.title}>Pickleball Scoreboard</Text>
          <Text style={styles.score}>{teamAName}: {teamAScore}</Text>
          <Text style={styles.score}>{teamBName}: {teamBScore}</Text>
          <Text style={styles.serveState}>
            Serving: Team {serveState.servingTeam}, Server {serveState.server}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scoreboardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  defaultScoreboard: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    marginVertical: 5,
  },
  serveState: {
    fontSize: 14,
    marginTop: 10,
  },
  arcadeScoreboard: {
    alignItems: 'center',
  },
  arcadeTeamBox: {
    flexDirection: 'row',
    width: 350,
    height: 80,
    marginVertical: 0,
  },
  teamNameBoxA: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(47, 44, 44)',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 20,
  },
  teamNameBoxB: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(47, 44, 44)',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 20,
  },
  arcadeTeamName: {
    fontSize: 20,
    color: 'white',
    textTransform: 'uppercase',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  serveIndicators: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  serveCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9ACD32',
    marginHorizontal: 4,
  },
  arcadeScoreBoxA: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    zIndex: 2,
  },
  arcadeScoreBoxB: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    zIndex: 0,
  },
  arcadeScore: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
  },
  tournamentBanner: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  tournamentText: {
    fontSize: 24,
    color: 'rgb(47, 44, 44)',
    fontWeight: 'bold',
  },
  arcadeSideEffects: {
    top: 20,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 30,
    zIndex: -1,
  },
  arcadeEffectText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  pickleballContainer: {
    position: 'absolute',
    bottom: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickleballIcon: {
    width: 50,
    height: 50,
  },
});

export default Scoreboard;
