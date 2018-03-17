import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert } from 'react-native';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			candidate1: "",
			candidate2: "",
			limit: ""
		}
	}

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	submitButtonTapped() {
		if (this.voteId != "" && this.state.limit != "" && this.state.candidate1 != "" && this.state.candidate2 != "") {
			AsyncStorage.getItem(global.blockchain, (err, res) => {
				if (!err && res) {
					const contractData = JSON.parse(res).contracts.chain

					var ending = false

					for (var x = 0; x < contractData.length; x++) {
						if (contractData[x].data.voteId === this.state.voteId) {
							ending = true
							break
						}
					}
					if (ending) {
						this.showErrorMessage('Vote ID Already Available', 'Please Enter Other Vote ID')
					} else {
						const candidateArray = [this.state.candidate1, this.state.candidate2]
						const voteData = {
							voteId: this.state.voteId,
							limit: this.state.limit,
							candidates: candidateArray,
						}
						AsyncStorage.getItem(global.loggedIn, (err, res) => {
							if (!err && res) {
								this.showErrorMessage('Data Inserted To Pool !', 'Please Wait Until Pooling Is Done')
								const data = JSON.parse(res)
								global.addNewContract(voteData, data.privKey)
							} else {
								this.showErrorMessage('No Internet Connection', 'Please Check Your Internet Connection')
							}
						})							
					}

				} else {
					this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
				}
			})
		} else {
			this.showErrorMessage('Data Invalid', 'Please Input Valid Data')
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.containerHalf}>
					<TextInput 
						style={styles.textInputHalf}
						value={this.state.voteId}
						autoCorrect={false}
						underlineColorAndroid='transparent'
						placeholder="Vote ID"
						onChangeText={(text) => {
							this.setState({voteId: text})
						}}/>
					<TextInput 
						style={styles.textInputHalf}
						value={this.state.limit}
						autoCorrect={false}
						underlineColorAndroid='transparent'
						placeholder="Vote Limit"
						keyboardType="numeric"
						onChangeText={(text) => {
							this.setState({limit: text})
						}}/>
					</View>
				
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
	containerHalf: {
		flexDirection: 'row',
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
	textInputHalf: {
		height: 40,
		width: '33%',
		marginLeft: 7,
		marginRight: 7,
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


