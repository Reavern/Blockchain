import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { address: "" };
		this.generatePrivateKey = this.generatePrivateKey.bind(this);
		this.generateAddress = this.generateAddress.bind(this);
	}

	generatePrivateKey() {
		var charset = "0123456789abcdef";
		var result = "";
		for( var i=0; i < 32; i++ )
		        result += charset[Math.floor(Math.random() * charset.length)];
		return result;
	}

	generateAddress() {
		global.privKey = this.generatePrivateKey();
		var privKey = ec.keyFromPrivate(global.privKey, 'hex');
		global.pubKey = privKey.getPublic().encode('hex');
		this.setState({
			address: global.pubKey
		})
	}

	

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.address}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Address"
					editable={false} />

				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.props.navigation.navigate('Voting', {address: this.state.idktp});}}>
					<Text>Submit</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.generateAddress()}}>
					<Text>Generate Address</Text>
				</TouchableOpacity>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#009faf',
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