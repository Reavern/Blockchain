import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LoginScreen from './components/pages/LoginScreen.js';
import VotingScreen from './components/pages/VotingScreen.js';
import BlockchainScreen from './components/pages/BlockchainScreen.js';

import './components/javascripts/Consensus.js'

const LoginRouter = TabNavigator({
	Login: {
		screen: LoginScreen,
		navigationOptions: {
			title: 'Login',
			headerTintColor: 'white',
			headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
		}
	},
	Blockchain: {
		screen: BlockchainScreen,
		navigationOptions: {
			title: 'Blockchain',
			headerTintColor: 'white',
			headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
		}
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
  	LoginRoutes: {
		screen: LoginRouter,
	},
	Voting: {
		screen: VotingScreen,
		navigationOptions: {
			title: 'Voting',
			headerTintColor: 'white',
			headerStyle: { backgroundColor: 'deepskyblue', borderWidth: 1, borderBottomColor: 'white' },
		}
	}
})

export default class App extends React.Component {
	render() {
		return ( <RootRouter /> );
	}
}