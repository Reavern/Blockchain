import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';


export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			user: "",
			pass: ""
		};
		this.submitButtonTapped = this.submitButtonTapped.bind(this);
	}

	submitButtonTapped() {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'Main' }),
			],
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput 
					style={styles.textInput}
					value={this.state.user}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Username"

					onChangeText={ (text) => {
						this.setState({
							user: text
						})
					}} />
				<TextInput 
					style={styles.textInput}
					value={this.state.user}
					autoCorrect={false}
					underlineColorAndroid='transparent'
					placeholder="Password"
					secureTextEntry={true}

					onChangeText={ (text) => {
						this.setState({
							pass: text
						})
					}} />
				<TouchableOpacity 
					style={styles.submitButton}
					onPress={this.submitButtonTapped}>
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
