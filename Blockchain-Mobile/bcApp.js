import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
const Block = require('./components/Blockchain.js')

const Blockchain = new Block.Blockchain();

export default class App extends React.Component {
	componentWillMount() {

		AsyncStorage.getItem('@Farell:blockchain', (error, value) => {
			if (!error) {
				if (value !== null) {
					Blockchain = JSON.parse(value);
					console.log("Available")
				} else {
					console.log("Not Available")
					AsyncStorage.setItem('@Farell:blockchain', JSON.stringify(Blockchain));			
				}
			}
			console.log(Blockchain)
		});
		
	}
	

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
