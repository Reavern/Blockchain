import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LoginScreen from './components/pages/LoginScreen.js';
import VotingScreen from './components/pages/VotingScreen.js';
import BlockchainScreen from './components/pages/BlockchainScreen.js';

import './components/javascripts/Consensus.js'

const MainRouter = StackNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			headerTitle: 'Login',
		}
	},
	Voting: {
		screen: VotingScreen,
		navigationOptions: {
			headerTitle: 'Voting',
		}
	}
}, {
	navigationOptions: {
		headerTintColor: 'white',
		headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
	}
})

const BlockchainRouter = StackNavigator({
	Blockchain: {
		screen: BlockchainScreen,
		navigationOptions: {
			headerTitle: 'Blockchain',
		}
	}
}, {
	navigationOptions: {
		headerTintColor: 'white',
		headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
	}
})

const RootRouter = TabNavigator({
  	MainMenu: {
		screen: MainRouter,

	},
	Blockchain: {
		screen: BlockchainRouter,
	}
}, {
	tabBarOptions: {
		style: {
			//backgroundColor: '#41b8f4',
		},
		labelStyle: {
			fontWeight: 'bold'
		}
	},
	tabBarPosition: 'bottom',

})

const blockId = "@FarellBlock:0000-test"
export default class App extends React.Component {
	componentWillMount() {
		AsyncStorage.getItem(blockId, (err, res) => {
			if (!err && res) {
				var newData = JSON.parse(res)
				global.blockchain.replaceChain(newData)
			} else {
				console.log("Empty")
			}
			setInterval(()=> {
				var storeData = JSON.stringify(global.blockchain)
				AsyncStorage.setItem(blockId, storeData)
			}, 1000)
		})
	}

	render() {
		return ( <RootRouter /> );
	}
}