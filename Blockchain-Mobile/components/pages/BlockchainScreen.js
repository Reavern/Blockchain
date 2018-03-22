import React from 'react';
import { Modal, StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Header } from 'react-navigation'
import Icon from 'react-native-vector-icons/Entypo';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			voteId: "",
			contractData: {
				data: {
					candidates: ["", ""]
				}
			},
			modalVisible: false,
			transactions: [],
			transactionCount: 0,
			points: {can1: 0, can2: 0}
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

				var transactionCount = canPoint1 = canPoint2 = 0;
				var transactions = []
				var ending = false

				for (var x = 0; x < contractData.length; x++) {
					if (contractData[x].data.voteId === this.state.voteId) {
						this.setState({ contractData: contractData[x] })
						for (var y = 0; y < transactionList.length; y++) {
							if (transactionList[y].data.voteId === this.state.voteId) {
								transactionCount++
								if (transactionList[y].data.choice == this.state.contractData.data.candidates[0]) {
									canPoint1++
								} else if (transactionList[y].data.choice == this.state.contractData.data.candidates[1]) {
									canPoint2++
								}
								transactions.push(transactionList[y].data)
							}
						}
						this.setState({
							transactions: transactions,
							transactionCount: transactionCount,
							points: {
								can1: canPoint1,
								can2: canPoint2
							}
						})
						this.toggleModal(true)
						ending = true
						break
					}
				}
				if (!ending) {
					this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
				}

			} else {
				this.showErrorMessage('Vote ID Not Found', 'Please Enter Valid Vote ID')
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
					
					<View style={styles.containerRowTop}>
						<View style={{alignItems: 'flex-start', justifyContent: 'center', flex:0.5}}>
							<TouchableOpacity
							onPress={() => { this.toggleModal(false) }}>
								<Icon name="chevron-left" size={40} color="black" style={{margin: 5}}/>
						</TouchableOpacity>
						</View>
						
						{/*<View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
							<Text style={styles.headerText}>
								{this.state.voteId}{"\n"}Total Vote Count: {this.state.transactionCount}
							</Text>
						</View>
						<View style={{alignItems: 'flex-end', justifyContent: 'center', flex:0.5}}>
							<TouchableOpacity
							onPress={() => { this.submitButtonTaped() }}>
								<Icon name="cw" size={40} color="black" style={{margin: 5}}/>
							</TouchableOpacity>
						</View>*/}
					</View>
					<View style={styles.containerRow}>
						<View style={{ alignItems: 'flex-start', flex: 1, margin: 5 }}>
							<Text style={styles.percText}>{this.state.contractData.data.candidates[0]}</Text>
						</View>
						<View style={{ alignItems: 'flex-end', flex: 1, margin: 5 }}>
							<Text style={styles.percText}>{this.state.contractData.data.candidates[1]}</Text>
						</View>
					</View>
					<View style={styles.containerRow}>
						<View 
							style={{
								alignItems: 'flex-start', 
								flex: this.state.points.can1 / this.state.points.can2, 
								height: 30, 
								backgroundColor: '#2591f7'}} >
							<Text style={styles.percText}>{Math.floor(this.state.points.can1 / (this.state.points.can2 + this.state.points.can1) * 100)}%</Text>
						</View>
						<View 
							style={{
								alignItems: 'flex-end', 
								flex: this.state.points.can2 / this.state.points.can1, 
								height: 30, 
								backgroundColor: '#4fd0ff'}} >
							<Text style={styles.percText}>{Math.floor(this.state.points.can2 / (this.state.points.can2 + this.state.points.can1) * 100)}%</Text>
						</View>
					</View>
					<View style={styles.container}>
							<FlatList
								style={{width: '100%'}}
								data={this.state.transactions}
								extraData={this.state}
								renderItem={ ({item}) => 
									<View style={styles.sectionBack}>
										<Text
											style={styles.sectionItem}>
											{ item.choice }
										</Text>
									</View>
								}
								keyExtractor={(item, index) => index} />

						
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
		backgroundColor: '#F0EFF5'
	},
	containerRow: {
		flexDirection: 'row',
	},
	containerRowTop: {
		flexDirection: 'row',
		borderWidth: 1,
	    borderRadius: 3,
	    borderColor: '#ddd',
	    borderBottomWidth: 0,
	    shadowColor: '#000',
	    shadowOffset: { width: 0, height: 2 },
	    shadowOpacity: 2,
	    shadowRadius: 2,
	    elevation: 1,
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
	sectionBack: {
		flex: 1,
		backgroundColor: '#FFF',
		marginTop: 20,
		height: 40,
		width: '70%',
		borderWidth: 0.7,
		borderColor: '#000',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sectionItem: {
		alignSelf: 'stretch',
		fontSize: 18,
		textAlign: 'center',

	},
	headerText: {
		fontSize: 18,
		textAlign: 'center'
	},
	percText: {
		fontSize: 18,
	}
});


