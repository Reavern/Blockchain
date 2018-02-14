import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';


export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { idktp: "" };
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.idktp}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="No. KTP"

					onChangeText={ (text) => {
						this.setState({
							idktp: text
						})
					}} />

				<TouchableOpacity 
					style={styles.submitButton}
					onPress={() => {this.props.navigation.navigate('Voting', {idktp: this.state.idktp});}}>
					<Text>Submit</Text>
				</TouchableOpacity>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#009faf',
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
