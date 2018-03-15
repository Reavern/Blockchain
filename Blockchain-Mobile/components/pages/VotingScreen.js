import React from 'react';
import { Modal, StyleSheet, Text, View, AsyncStorage, TextInput, TouchableHighlight, TouchableOpacity, Button, Alert } from 'react-native';

class VotingModal extends React.Component {

	render() {
		return (
			<Modal
				animationType="slide"
				transparent={false}
				visible={this.props.visible}
				onRequestClose={() => {
					this.props.onBack()
				}}>
				<TouchableOpacity 
					onPress={() => {
						this.props.onBack()
					}}>
					<Text>{this.props.voteId}</Text>
				</TouchableOpacity>
			</Modal>
		)
	}
}

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			voteData: {},
			modalVisible: false
		}
	}

	toggleModal(visibility) {
		AsyncStorage.getItem(global.blockchain, (err, res) => {
			if (!err && res) {
				const contractData = JSON.parse(res).contracts.chain
				const transactionList = JSON.parse(res).transactions.chain

				var transactionCount = 0;
				var contract = {}

				for (var x = 0; x < contractData.length; x++) {
					if (contractData[x].data.voteId === this.state.voteId) {
						console.log(true)
						for (var y = 0; y < transactionList.length; y++) {

							if (transactionList[y].data.voteId === this.state.voteId) {
								transactionCount++
							}
						}
						if (transactionCount > contractData[x].data.limit) {
							console.log("Limit Reached")
						} else {
							this.setState({ modalVisible: visibility })
						}
						
						break
					} else {

					}
				}


				
			} else {
				console.log("Error")
			}
		})
		
	}

	render() {
		return (
			<View style={styles.container}>
				<VotingModal 
				visible={this.state.modalVisible}
				onBack={() => {this.toggleModal(false)}} 
				voteId={this.state.voteId}/>

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
					onPress={() => {
						this.toggleModal(true)
					}}>
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


