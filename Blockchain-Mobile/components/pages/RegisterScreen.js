import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js')

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			key: "",
			pass: "",
			rePass: ""
		};
	}

	componentDidMount() {
		this.setState({
			key: this.generatePrivateKey()
		})
	}

	generatePrivateKey() {
		var charset = "0123456789abcdef";
		var result = "";
		for( var i=0; i < 32; i++ )
		        result += charset[Math.floor(Math.random() * charset.length)];
		return result;
	}

	// generateAddress() {
	// 	global.privKey = this.generatePrivateKey();
	// 	var privKey = ec.keyFromPrivate(global.privKey, 'hex');
	// 	global.pubKey = privKey.getPublic().encode('hex');
	// 	this.setState({
	// 		address: global.pubKey
	// 	})
	// }

	submitButtonTapped() {
		if (this.state.pass == this.state.rePass) {
			var newArr = {}
			var passHash = CryptoJS.SHA256(this.state.key + this.state.pass).toString(CryptoJS.enc.Hex)
			var newData = {
				privKey: this.state.key,
				pass: passHash
			}
			

			AsyncStorage.getItem(global.keystore, (err, res) => {
				if (!err && res) {
					newArr = JSON.parse(res)
				}
				newArr[this.state.key] = newData
				var newStr = JSON.stringify(newArr)
				AsyncStorage.setItem(global.keystore, newStr, () => {
					console.log(newStr)
					console.log("Stored")
					const resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: 'Login' })],
					});
					this.props.navigation.dispatch(resetAction);
				})
			})
		} else {
			console.log("Invalid")
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.key}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Address"
					editable={false} 
				/>
				<TextInput 
					style={styles.textInput}
					value={this.state.pass}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Password" 
					secureTextEntry={true} 
					onChangeText={(text) => {
						this.setState({pass: text})
					}}
				/>
				<TextInput 
					style={styles.textInput}
					value={this.state.rePass}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Re-Enter Password" 
					secureTextEntry={true} 
					onChangeText={(text) => {
						this.setState({rePass: text})
					}}
				/>


				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.submitButtonTapped()}}>
					<Text>Register</Text>
				</TouchableOpacity>

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