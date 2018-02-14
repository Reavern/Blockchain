import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}


	render() {

		const { params } = this.props.navigation.state;
		const idktp = params ? params.idktp : null;

		return (
			<View style={styles.container}>
				<Text>{idktp}</Text>
				<Text>Changes you make will automatically reload.</Text>
				<Text>Shake your phone to open the developer menu.</Text>
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
});
