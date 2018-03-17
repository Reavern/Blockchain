import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js')

export default class App extends React.Component {

	constructor(props) {
		super(props);

	}


	render() {
		return (
			<View style={styles.container}>
				<Text>Hi </Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',

	},
	textInput: {
		height: 40,
		width: '70%',
		marginTop: 10,
		paddingHorizontal: 10,
		backgroundColor: '#FFF'
	},
	submitButton: {
		height: 40,
		width: '70%',
		marginTop: 10,
		backgroundColor: '#b1d8e0',
		alignItems: 'center',
		justifyContent: 'center'
	}
});