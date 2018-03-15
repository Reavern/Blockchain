import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';

const width = Dimensions.get('window').width * 0.9;

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { blocks: [] };
	}



	componentDidMount() {

	}

	render() {
		return (
			<View style={styles.container}>
				<FlatList
					data={this.state.blocks}
					extraData={this.state}
					renderItem={ ({item}) => 
						<View style={styles.sectionBack}>
							<Text
								style={styles.sectionItem}>
								{ item.data }
							</Text>
						</View>
					}
					keyExtractor={(item, index) => index}
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
