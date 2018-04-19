import React from 'react';
import { Modal, StyleSheet, Text, View, AsyncStorage, TextInput, TouchableHighlight, TouchableOpacity, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

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

	showErrorMessage(title, message) {
		Alert.alert(title, message)
	}

	submitButtonTaped() {
		AsyncStorage.getItem(global.blockchain, (err, res) => {
			if (!err && res) {
				const contractData = JSON.parse(res).contracts.chain
				const transactionList = JSON.parse(res).transactions.chain

				var transactionCount = 0;
				var contract = {}
				var ending = false
				var voted = false
				AsyncStorage.getItem(global.loggedIn, (err, res) => {
					if (!err && res) {
						const data = JSON.parse(res)
						for (var x = 0; x < contractData.length; x++) {
							if (contractData[x].data.voteId === this.state.voteId) {
								for (var y = 0; y < transactionList.length; y++) {
									if (transactionList[y].data.voteId === this.state.voteId) {
										transactionCount++
										if (transactionList[y].sender == ec.keyFromPrivate(data.privKey, 'hex').getPublic().encode('hex')) {
											voted = true
											ending = true
											break
										}
									} 
								}
								
								if (voted) {
									this.showErrorMessage('You Have Voted', 'You Already Cast Your Vote For This Vote ID')
								} else {
									
									if (transactionCount >= contractData[x].data.limit) {
										this.showErrorMessage('Limit Reached', 'Voter Limit Reached')
									} else {
										this.setState({ voteData: contractData[x].data })
										this.toggleModal(true)
									}
									ending = true
								}
								break
							}
						}
						if (!ending) {
							this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
						}	
					} else {
						this.showErrorMessage('No Internet Connection', 'Please Check Your Internet Connection')
					}
				})
				
			} else {
				this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
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
						var voted = false

						for (var x = 0; x < contractData.length; x++) {
							if (contractData[x].data.voteId == this.state.voteId) {
								for (var y = 0; y < transactionList.length; y++) {
									if (transactionList[y].data.voteId == this.state.voteId) {
										transactionCount++
										if (transactionList[y].sender == ec.keyFromPrivate(data.privKey, 'hex').getPublic().encode('hex')) {
											voted = true
										}
									} 
								}
								if (!voted) {
									if (transactionCount >= contractData[x].data.limit) {
										this.showErrorMessage('Limit Reached', 'Voter Limit Reached')
									} else {
										if (global.isConnected) {
											this.showErrorMessage('Data Inserted To Pool !', 'Please Wait Until Pooling Is Done')
											global.addNewTransaction(votingData, data.privKey)
											this.setState({ modalVisible: false })
										} else {
											this.showErrorMessage('No Internet Connection', 'Please Check Your Internet Connection')
										}
									}									
								} else {
									this.showErrorMessage('You Have Voted', 'You Already Cast Your Vote For This Vote ID')
								}
								break
							}
						}
					} else {
						this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
					}
				})
			} else {
				this.showErrorMessage('No Internet Connection', 'Please Check Your Internet Connection')
			}
		})
	}

	showConfirmButton() {
		if (this.state.myChoice == "") {
			this.showErrorMessage('No Candidate Selected', 'Please Select A Candidate')
		} else {
			const chooseString = "Are You Sure To Choose " + this.state.myChoice
			Alert.alert('Vote Confirmation', chooseString,
			[
				{text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				{text: 'Yes', onPress: () => this.voteButtonTapped() }
			],
			{ cancelable: false } )
		}
		
	}

	render() {

		return (
			<View style={styles.container}>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => { this.toggleModal(false) }}>
					<View style={styles.headerContainer}>
						<View style={{flex:0.5, justifyContent:'center', alignItems:'flex-start'}}>
							<TouchableOpacity 
								onPress={() => { this.toggleModal(false) }}>
								<Icon name="chevron-left" size={40} color="black" style={{margin: 5}}/>
							</TouchableOpacity>
						</View>
						<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
							<Text style={styles.headerText}>Vote ID: [ {this.state.voteId} ]</Text>
						</View>
						<View style={{flex:0.5, justifyContent:'center', alignItems:'flex-end'}}>
						</View>
					</View>
					
					<View style={styles.container}>
						<View>
							<Text style={styles.headerText}>Your Choice: {this.state.myChoice}</Text>
						</View>
						{
							this.state.voteData.candidates.map((data, index) => {
								return (
									<TouchableOpacity
										key={index}
										style={styles.voteButton}
										onPress={() => { this.setState({myChoice: this.state.voteData.candidates[index]}) }}>
										<Text>{this.state.voteData.candidates[index]}</Text>
									</TouchableOpacity>
								)
							})
						}
						<TouchableOpacity 
							style={styles.submitButton}
							onPress={() => { this.showConfirmButton() }}>
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
					onPress={() => { this.submitButtonTaped() }}>
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
	headerContainer: {
		flexDirection: 'row',
	},
	headerText: {
		fontSize: 20,
		fontWeight: 'bold'
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
		height: 40,
		width: '100%',
		margin: 10,
		backgroundColor: '#17b9c1',
		alignItems: 'center',
		justifyContent: 'center'		
	}
});


