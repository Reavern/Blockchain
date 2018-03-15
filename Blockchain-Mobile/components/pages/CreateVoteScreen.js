import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert } from 'react-native';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			candidate1: "",
			candidate2: ""
		}
	}

	submitButtonTapped() {
		const candidateArray = [this.state.candidate1, this.state.candidate2]
		const voteData = {
			voteId: this.state.voteId,
			candidates: candidateArray
		}
		AsyncStorage.getItem(global.loggedIn, (err, res) => {
			if (!err && res) {
				const data = JSON.parse(res)
				global.addNewContracts(voteData, data.privKey)

			} else {
				console.log("ERROR")
			}
		})
		
	}

	render() {
		return (
			<View style={styles.container}>

				<TextInput 
					style={styles.textInput}
					value={this.state.voteId}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Vote ID"
					onChangeText={(text) => {
						this.setState({voteId: text})
					}}/>
				<TextInput 
					style={styles.textInput}
					value={this.state.candidate1}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Candidate 1 Name"
					onChangeText={(text) => {
						this.setState({candidate1: text})
					}}/>
				<TextInput 
					style={styles.textInput}
					value={this.state.candidate2}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Candidate 2 Name"
					onChangeText={(text) => {
						this.setState({candidate2: text})
					}}/>
				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {
						this.submitButtonTapped()
					}}>
					<Text>Create Vote</Text>
				</TouchableOpacity>
			</View>
		)
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


