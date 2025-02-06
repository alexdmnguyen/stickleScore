import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  scoreboard: {
    alignItems: 'center',
    margin: 50,
  },
  score: {
    fontSize: 20,
    marginVertical: 5,
  },
  serveState: {
    fontSize: 18,
    color: '#888',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  readButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dropdownButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 90,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    padding: 10,
    zIndex: 10,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  readButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  landscapeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  landscapeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 100,
  },
  landscapeMiddle: {
    flex: 2,
    alignItems: 'center',
  },
  landscapeActions: {
    marginTop: 20,
  },
  landscapeButton: {
    flex: 1,
    alignItems: 'center',
  },
  teamContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  teamContainerLand: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  teamNameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    width: 150,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
  },
  winTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  winText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  optionButton: {
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#fff',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  customtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4CAF50',
  },
  startButton: {
    color: '#4CAF50',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 100,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 200,
    height: 200,
  },
  circle: {
    width: 250,
    height: 250,
    borderRadius: 150,
    backgroundColor: '#9ACD32',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  scoreText: {
    color: '#fff',
    fontSize: 100, // Larger font for the score
    fontWeight: 'bold',
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 100,
    position: 'absolute',
  },
  serveIndicators: {
    color: 'white',
    position: 'absolute',
    bottom: 20, // Place near the bottom of the button
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  serveCircle: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  modernLayout: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Don't apply background directly here, instead split into two halves
  },
  landscapeModernLayout: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // same as modernLayout, keep it transparent
  },
  topHalf: {
    flex: 1,
    backgroundColor: 'rgb(183, 224, 255)', // Blue for the top half of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: 'rgb(239, 90, 111)', // Red for the bottom half of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHalf: {
    flex: 1,
    backgroundColor: 'rgb(183, 224, 255)', // Blue for the left half of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightHalf: {
    flex: 1,
    backgroundColor: 'rgb(239, 90, 111)', // Red for the right half of the screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernTeamAName: {
    marginTop: 80,
    color: '#fff',
    fontSize: 40, // Larger font for the score
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modernTeamBName: {
    marginBottom: 80,
    color: '#fff',
    fontSize: 40, // Larger font for the score
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamANameText: {
    color: '#fff',
    fontSize: 50,
    marginTop: 75,
    fontWeight: 'bold',
  },
  teamBNameText: {
    color: '#fff',
    fontSize: 50,
    marginBottom: 75,
    fontWeight: 'bold',
  },
  teamANameLand: {
    color: '#fff',
    fontSize: 50,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  
  teamBNameLand: {
    color: '#fff',
    fontSize: 50,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

const themes = {
  default: {
    backgroundColor: '#f0f0f0',
    buttonBackground: '#007bff',
    buttonTextColor: '#fff',
    scoreTextColor: '#000',
    modalBackground: 'rgba(0, 0, 0, 0.8)',
    inputBackground: '#333',
    inputTextColor: '#fff',
  },
  retroDark: {
    backgroundColor: '#1b1b1b',
    buttonBackground: '#ff6347', // Tomato Red
    buttonTextColor: '#fff',
    scoreTextColor: '#ffcc00', // Yellow
    modalBackground: 'rgba(0, 0, 0, 0.9)',
    inputBackground: '#444',
    inputTextColor: '#ffcc00', // Yellow
  },
  arcade: {
    backgroundColor: '#222',
    buttonBackground: '#00ff00', // Neon Green
    buttonTextColor: '#000',
    scoreTextColor: '#ff00ff', // Neon Pink
    modalBackground: 'rgba(0, 0, 0, 0.7)',
    inputBackground: '#000',
    inputTextColor: '#00ff00', // Neon Green
  },
  modern: {
    backgroundColor: '#222',
    buttonBackground: '#00ff00', // Neon Green
    buttonTextColor: '#000',
    scoreTextColor: '#ff00ff', // Neon Pink
    modalBackground: 'rgba(0, 0, 0, 0.7)',
    inputBackground: '#000',
    inputTextColor: '#00ff00', // Neon Green
  },
};

export { themes };

export default styles;
