import React from 'react';
import { Modal, StyleSheet, Text, View, AsyncStorage, TextInput, TouchableHighlight, TouchableOpacity, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			voteData: [],
			modalVisible: false,
			transactions: [],
			transactionCount: 0
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
				var transactions = []

				for (var x = 0; x < contractData.length; x++) {
					if (contractData[x].data.voteId === this.state.voteId) {
						for (var y = 0; y < transactionList.length; y++) {
							if (transactionList[y].data.voteId === this.state.voteId) {
								transactionCount++
								transactions.push(transactionList[y].data)
							}
						}
						this.setState({
							transactions: transactions,
							transactionCount: transactionCount
						})
						this.toggleModal(true)
						break
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
						<Text>{this.state.transactionCount}</Text>

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
					onPress={() => {
						this.submitButtonTaped()
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


