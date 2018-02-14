import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, SectionList } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class App extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#fff',
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	sectionList: {
		padding: 10,
		height: 50,
		fontSize: 20,
		fontWeight: 'bold',
		backgroundColor: '#fff',
		//borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#000',
	},
	sectionItem: {
		padding: 10,
		height: 40,
		fontSize: 18,
		backgroundColor: '#FFF',
		//borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#000',
	}
});
