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
			rePass: "",
			user: ""
		}
	}

	componentDidMount() {

	}

	generatePrivateKey() {
		var charset = "0123456789abcdef";
		var result = "";
		const timestamp = new Date().getTime()
		for( var i=0; i < 32; i++ )
			result += charset[Math.floor(Math.random() * charset.length)];
		result = result + this.state.pass + timestamp


		return CryptoJS.SHA256(result).toString(CryptoJS.enc.Hex)
	}

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	submitButtonTapped() {
		if (this.state.pass == this.state.rePass && this.state.pass != "" && this.state.user != "") {
			var newArr = {}
			var passHash = CryptoJS.SHA256(this.state.user + this.state.pass).toString(CryptoJS.enc.Hex)
			
			var newData = {
				privKey: this.generatePrivateKey(),
				pass: passHash
			}
			AsyncStorage.getItem(global.keystore, (err, res) => {
				if (!err && res) {
					newArr = JSON.parse(res)
				}
				if (newArr[this.state.user] == null) {
					newArr[this.state.user] = newData
					var newStr = JSON.stringify(newArr)
					AsyncStorage.setItem(global.keystore, newStr, () => {
						this.showErrorMessage('User Created', 'You Can Now Login Using These Credentials')
						const resetAction = NavigationActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'Login' })],
						});
						this.props.navigation.dispatch(resetAction);
					})					
				} else {
					this.showErrorMessage('Username Invalid', 'Please Enter Valid Username')
				}
			})
		} else if (this.state.user == "") {
			this.showErrorMessage('Username Invalid', 'Please Enter Valid Username')
		} else if (this.state.pass == "") {
			this.showErrorMessage('Password Invalid', 'Please Enter Valid Password')
		} else {
			this.showErrorMessage('Password Do Not Match', 'Please Enter Matching Password')
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.user}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Username"
					onChangeText={(text) => {
						this.setState({user: text})
					}}
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