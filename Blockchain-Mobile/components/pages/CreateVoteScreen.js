import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			candidate1: "",
			candidate2: "",
			limit: "",
			candidates: 2,
			candidateArray: ["", ""]
		}
	}

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	checkArrayNull() {
		var count = 0
		for (var x = 0; x < this.state.candidateArray.length; x++) {
			if (this.state.candidateArray[x] != "")
				count ++
		}
		if (count == this.state.candidateArray.length) {
			return true
		} else {
			return false
		}
	}

	submitButtonTapped() {
		if (this.voteId != "" && this.state.limit != "" && this.checkArrayNull()) {
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
						const candidateArray = this.state.candidateArray
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
				<View style={styles.containerHalf}>
					<View style={styles.halfText}>
						<Text>Candidates</Text>
					</View>

					<Picker
						selectedValue={this.state.candidates}
						style={styles.half}
						onValueChange={(itemValue, itemIndex) => {
							var tempArray = this.state.candidateArray
							if (tempArray.length < itemValue) {
								for (var x = 0; x < itemValue - tempArray.length; x++)
									tempArray.push("")
							} else if (tempArray.length > itemValue) {
								for (var x = 0; x < tempArray.length - itemValue; x++)
									tempArray.pop()
							}
							this.setState({candidates: itemValue})
						}}>
						<Picker.Item label="2" value="2" />
						<Picker.Item label="3" value="3" />
					</Picker>
				</View>
				{
					this.state.candidateArray.map((data, index) => {
						var placeholder = "Candidate " + (index + 1) + " Name"
						return (
							<TextInput
								key={index}
								style={styles.textInput}
								value={this.state.candidateArray[index]}
								autoCorrect={false}
								underlineColorAndroid='transparent'
								placeholder={placeholder}
								onChangeText={(text) => {
									var tempArray = this.state.candidateArray
									tempArray[index] = text
									this.setState({candidateArray: tempArray})
								}}/>
						)
					})

				}
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
	half: {
		height: 40,
		width: '33%',
		marginLeft: 7,
		marginRight: 7,
		marginTop: 10,
		paddingHorizontal: 10,
	},
	halfText: {
		height: 40,
		width: '33%',
		marginLeft: 7,
		marginRight: 7,
		marginTop: 10,
		paddingHorizontal: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	textInputHalf: {
		height: 40,
		width: '33%',
		marginLeft: 7,
		marginRight: 7,
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


