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
		//this.generateAddress = this.generateAddress.bind(this)
	}

	generateAddress() {
		console.log("Test")
		var msg = "21232f297a57a5a743894a0e4a801fc3"
		var privKey = ec.keyFromPrivate("448ebe097645b5a8b5c892dba0110a68", 'hex');
		var pubKey = privKey.getPublic().encode('hex');
		var verKey = ec.keyFromPublic(pubKey, 'hex')


		console.log(pubKey)
		var sign = 	privKey.sign(msg).toDER();
		console.log("signature: " + sign)

		var tf = verKey.verify(msg, sign)

		console.log(tf)

	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.idktp}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Address"

					onChangeText={ (text) => {
						this.setState({
							address: text
						})
					}} />

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
