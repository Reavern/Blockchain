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

export default class App extends React.Component {
	render() {
		return ( <RootRouter /> );
	}
}