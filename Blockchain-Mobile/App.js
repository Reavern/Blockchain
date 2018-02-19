import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LoginScreen from './components/pages/LoginScreen.js';
import VotingScreen from './components/pages/VotingScreen.js';
import MiningScreen from './components/pages/MiningScreen.js';
import BlockchainScreen from './components/pages/BlockchainScreen.js';

import './components/javascripts/Consensus.js'
import './components/javascripts/Global.js'

const MainRouter = TabNavigator({
	Voting: {
		screen: VotingScreen,
	},
	Mining: {
		screen: MiningScreen,
	},
	Blockchain: {
		screen: BlockchainScreen,
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
	navigationOptions: {
		headerTintColor: 'white',
		headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
	}
})

const RootRouter = StackNavigator({
  	Login: {
		screen: LoginScreen,
		navigationOptions: {
			headerStyle: {
				height: 0
			}
		}
	},
	Voting: {
		screen: MainRouter,
	}
})

export default class App extends React.Component {
	render() {
		return ( <RootRouter /> );
	}
}