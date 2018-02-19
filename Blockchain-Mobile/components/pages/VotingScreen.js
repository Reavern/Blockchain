import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Dimensions, TouchableOpacity, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';

const BC = require('../javascripts/Blockchain.js')
//import { sendEvent } from '../javascripts/p2p.js'

const size = Dimensions.get('window').width * 0.4;

const CALON_NO_1 = "Anies";
const CALON_NO_2 = "Ahok";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pilihan: ""
		}
	}

	render() {
		// var Blockchain = new BC.Blockchain();
		// Blockchain.set_genesis_block()
		// console.log(Blockchain)

		return (
			<View style={styles.container}>
				<View style={styles.voteContainer}>
					<Text>Anda Memilih : {this.state.pilihan}</Text>
				</View>
				<View style={styles.voteContainer}>
					<View style={styles.voteColumn} >
						<TouchableOpacity
							style={styles.voteButton}
							onPress={() => { this.setState({ pilihan: CALON_NO_1 }) }}>
							<Text>{CALON_NO_1}</Text>
						</TouchableOpacity>
						<Text style={styles.voteText}>{CALON_NO_1}</Text>
					</View>
					<View style={styles.voteColumn} >
						<TouchableOpacity
							style={styles.voteButton}
							onPress={() => { this.setState({ pilihan: CALON_NO_2 }) }}>
							<Text>{CALON_NO_2}</Text>
						</TouchableOpacity>
						<Text style={styles.voteText}>{CALON_NO_2}</Text>
					</View>
				</View>
				<View style={styles.voteContainer}>
					<TouchableOpacity
						style={styles.submitButton}
						onPress={() => {
							console.log(this.state.pilihan)
						}}>
						<Text>Submit</Text>
					</TouchableOpacity>
				</View>
						
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	voteContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',

	},
	voteColumn: {
		flex: 1,
		alignItems: 'center',
	},
	voteButton: {
		margin: 10,
		width: size,
		height: size,
		backgroundColor: '#ff0',
		borderWidth: 0.5,
		borderColor: '#000',

	},
	voteTextContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	voteText: {

		textAlign: 'center',
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


