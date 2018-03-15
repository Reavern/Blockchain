import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ScrollView, Alert, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

const CryptoJS = require('crypto-js')

class DrawerItem extends React.Component {
	render() {
		return (
			<TouchableHighlight
				style={this.props.style}
				underlayColor="#e5e6e8"
				onPress={this.props.onPress}>
				<View
					style={styles.navItem}>
					<Text>{this.props.itemName}</Text>
				</View>
				
			</TouchableHighlight>
		)
	}
}

export default class App extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			position: 0
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView>
					<DrawerItem
						itemName="Voting"
						onPress={() => {
							this.props.navigation.navigate('Voting')
							this.setState({position:0})
						}} 
						style={this.state.position==0 ? styles.navContainerCurr : styles.navContainer}/>
					<DrawerItem
						itemName="View Recent Blocks"
						onPress={() => {
							this.props.navigation.navigate('Blockchain')
							this.setState({position:1})
						}} 
						style={this.state.position==1 ? styles.navContainerCurr : styles.navContainer}/>
					<DrawerItem
						itemName="Create New Vote"
						onPress={() => {
							this.props.navigation.navigate('CreateVote')
							this.setState({position:2})
						}} 
						style={this.state.position==2 ? styles.navContainerCurr : styles.navContainer}/>
					<DrawerItem
						itemName="Log Out"
						onPress={() => {
							this.props.navigation.navigate('LogOut')
							this.setState({position:9})
						}} 
						style={this.state.position==9 ? styles.navContainerCurr : styles.navContainer }/>
                </ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	navContainer: {
		alignItems: 'center',
		backgroundColor: '#FFF',
	},
	navContainerCurr: {
		alignItems: 'center',
		backgroundColor: '#e5e6e8',
	},
	navItem: {
		width:'100%',
		padding: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#DDD',
	}
});