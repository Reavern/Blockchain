import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, FlatList, Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';

const data = [
	{ key: '12312', time: '321' },
	{ key: '3213', time: '1231' }
];
const width = Dimensions.get('window').width * 0.9;

export default class App extends React.Component {


	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={data}
					renderItem={ ({item}) => 
						<View style={styles.sectionBack}>
							<Text
								style={styles.sectionItem}>
								{ item.key }
							</Text>
						</View>
					}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: '#fff',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center',
	},
	sectionBack: {
		//alignItems: 'center',
		backgroundColor: '#FFF',
		marginTop: 20,
		height: 40,
		width: width,
		borderWidth: 0.5,
		borderColor: '#000',
	},
	sectionItem: {

		fontSize: 18,
		
		textAlign: 'center',

	}
});
