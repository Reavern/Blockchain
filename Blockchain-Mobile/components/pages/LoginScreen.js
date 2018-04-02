import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js')

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			user: "",
			pass: ""
		}
	}

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	submitButtonTapped() {
		if (this.state.key != "" && this.state.pass != "") {
			AsyncStorage.getItem(global.keystore, (err, res) => {
				if (!err && res) {
					var passHash = CryptoJS.SHA256(this.state.user + this.state.pass).toString(CryptoJS.enc.Hex)
					var keyObj = JSON.parse(res)
					try {
						if (keyObj[this.state.user].pass == passHash) {
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'MainMenu' })],
							});
							const loggedInString = JSON.stringify(keyObj[this.state.user])
							AsyncStorage.setItem(global.loggedIn, loggedInString, () => {
								this.props.navigation.dispatch(resetAction);
							})
						} else {
							this.showErrorMessage('Username / Password Invalid', 'Please Enter Valid Username & Password')
						}
					} catch (e) {
						this.showErrorMessage('Username / Password Invalid', 'Please Enter Valid Username & Password')
					}
				} else {
					this.showErrorMessage('Username / Password Invalid', 'Please Enter Valid Username & Password')
				}
			})
		} else {
			this.showErrorMessage('Username / Password Invalid', 'Please Enter Valid Username & Password')
		}
	}

	render() {
		//AsyncStorage.clear()
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
					}} />
				<TextInput 
					style={styles.textInput}
					value={this.state.pass}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Password"
					secureTextEntry={true}
					onChangeText={(text) => {
						this.setState({pass: text})
					}} />

				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.submitButtonTapped()}}>
					<Text>Log In</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.props.navigation.navigate('Register')}}>
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