import React from 'react';
import { Modal, StyleSheet, Text, View, AsyncStorage, TextInput, TouchableHighlight, TouchableOpacity, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			voteData: {
				candidates: [],
				limit: "",
				voteId: ""
			},
			modalVisible: false,
			myChoice:""
		}
	}

	toggleModal(visibility) {
		this.setState({ modalVisible: visibility })
	}

	submitButtonTaped() {
		AsyncStorage.getItem(global.blockchain, (err, res) => {
			if (!err && res) {
				const contractData = JSON.parse(res).contracts.chain
				const transactionList = JSON.parse(res).transactions.chain

				var transactionCount = 0;
				var contract = {}

				for (var x = 0; x < contractData.length; x++) {
					if (contractData[x].data.voteId === this.state.voteId) {
						for (var y = 0; y < transactionList.length; y++) {

							if (transactionList[y].data.voteId === this.state.voteId) {
								transactionCount++
							}
						}
						if (transactionCount >= contractData[x].data.limit) {
							console.log("Limit Reached")
						} else {
							this.setState({ voteData: contractData[x].data })
							this.toggleModal(true)
						}
						
						break
					}
				}	
			} else {
				console.log("Error")
			}
		})		
	}

	voteButtonTapped() {
		AsyncStorage.getItem(global.loggedIn, (err, res) => {
			if (!err && res) {
				const data = JSON.parse(res)
				const votingData = {
					voteId: this.state.voteData.voteId,
					choice: this.state.myChoice
				}

				AsyncStorage.getItem(global.blockchain, (err, res) => {
					if (!err && res) {
						const contractData = JSON.parse(res).contracts.chain
						const transactionList = JSON.parse(res).transactions.chain

						var transactionCount = 0;
						var contract = {}

						for (var x = 0; x < contractData.length; x++) {
							if (contractData[x].data.voteId === this.state.voteId) {
								for (var y = 0; y < transactionList.length; y++) {
									if (transactionList[y].data.voteId === this.state.voteId) {
										transactionCount++
									}
								}
								if (transactionCount >= contractData[x].data.limit) {
									console.log("Limit Reached")
								} else {
									global.addNewTransaction(votingData, data.privKey)
									this.setState({ modalVisible: false })
								}
								
								break
							}
						}
						
					} else {
						console.log("Error")
					}
				})

				
			} else {
				console.log("Error")
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => { this.toggleModal(false) }}>
					<TouchableOpacity 
						onPress={() => { this.toggleModal(false) }}>
						<Icon name="chevron-left" size={40} color="black" style={{margin: 5}}/>
					</TouchableOpacity>
					<View style={styles.container}>
						<View style={styles.containerHalf}>
							<TouchableOpacity 
								style={styles.voteButton}
								onPress={() => { this.setState({myChoice: this.state.voteData.candidates[0]}) }}>
								<Text>{this.state.voteData.candidates[0]}</Text>
							</TouchableOpacity>

							<TouchableOpacity 
								style={styles.voteButton}
								onPress={() => { this.setState({myChoice: this.state.voteData.candidates[1]}) }}>
								<Text>{this.state.voteData.candidates[1]}</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity 
							style={styles.submitButton}
							onPress={() => { this.voteButtonTapped() }}>
							<Text>Vote</Text>
						</TouchableOpacity>
					</View>
				</Modal>

				<TextInput 
					style={styles.textInput}
					value={this.state.voteId}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Vote ID"
					onChangeText={(text) => {
						this.setState({voteId: text})
					}}/>
				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => { this.submitButtonTaped }}>
					<Text>Submit</Text>
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
		backgroundColor: '#F0EFF5'

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
	submitButton: {
		height: 40,
		width: '70%',
		marginTop: 10,
		backgroundColor: '#b1d8e0',
		alignItems: 'center',
		justifyContent: 'center'
	},
	voteButton: {
		height: 120,
		width: 120,
		margin: 10,
		backgroundColor: '#b1d8e0',
		alignItems: 'center',
		justifyContent: 'center'		
	}
});


