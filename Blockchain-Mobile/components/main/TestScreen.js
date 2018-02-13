import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, SectionList } from 'react-native';
import { StackNavigator } from 'react-navigation';

const data = [
	{
		data: ["1", "2", "3"],
		title: "Ini Titleny"
	},
	{
		data: ["4", "5", "6"],
		title: "Title 2"
	}
];

export default class App extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<SectionList
					sections={ data }
					renderItem={({item}) => <Text>{item}</Text>}
					renderSectionHeader={({section}) => <Text>{section.title}</Text>}
					keyExtractor={(item, index) => index}
				/>
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
