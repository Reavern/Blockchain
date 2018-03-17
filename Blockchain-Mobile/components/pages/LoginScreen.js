import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js')

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			key: "9c5153fa9cec66ca018611d4645c18aa",
			pass: "asd"
		}
	}

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	submitButtonTapped() {
		if (this.state.key != "" && this.state.pass != "") {
			AsyncStorage.getItem(global.keystore, (err, res) => {
				if (!err && res) {
					var passHash = CryptoJS.SHA256(this.state.key + this.state.pass).toString(CryptoJS.enc.Hex)
					var keyObj = JSON.parse(res)
					try {
						if (keyObj[this.state.key].pass == passHash) {
							const resetAction = NavigationActions.reset({
								index: 0,
								actions: [NavigationActions.navigate({ routeName: 'MainMenu' })],
							});
							const loggedInString = JSON.stringify(keyObj[this.state.key])
							AsyncStorage.setItem(global.loggedIn, loggedInString, () => {
								this.props.navigation.dispatch(resetAction);
							})
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
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.key}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Address"
					onChangeText={(text) => {
						this.setState({key: text})
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
					<Text>Submit</Text>
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