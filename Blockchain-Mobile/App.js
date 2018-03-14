import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LoginScreen from './components/pages/LoginScreen.js';
import VotingScreen from './components/pages/VotingScreen.js';
import BlockchainScreen from './components/pages/BlockchainScreen.js';
import LogOutScreen from './components/pages/LogOutScreen.js';
import RegisterScreen from './components/pages/RegisterScreen.js';

import './components/javascripts/Consensus.js'
import './components/javascripts/GlobalConst.js'

const MainRouter = DrawerNavigator({

	Voting: {
		screen: VotingScreen,
		navigationOptions: {
			drawerLabel: 'Vote',
			drawerIcon: ({ tintColor }) => (
				<Text>ASD</Text>
			),
		}

	},
	Blockchain: {
		screen: BlockchainScreen,
		navigationOptions: {
			drawerLabel: 'View Blocks',
			drawerIcon: ({ tintColor }) => (
				<Text>Home</Text>
			),
		}
	},
	LogOut: {
		screen: LogOutScreen,
		navigationOptions: {
			drawerLabel: 'Log Out',
			drawerIcon: ({ tintColor }) => (
				<Text>Home</Text>
			),
		}
	}
})

var isOpen = false
const RootRouter = StackNavigator({
  	Login: {
		screen: LoginScreen
	},
	Register: {
		screen: RegisterScreen
	},
  	MainMenu: {
		screen: MainRouter,
		navigationOptions: ({navigation}) => ({
			headerLeft: <Text onPress={() => {
				if (isOpen) {
					navigation.navigate('DrawerClose')
				} else {
					navigation.navigate('DrawerOpen')
				}
				isOpen = !isOpen
			}}>Menu</Text>
		})
	},

})


export default class App extends React.Component {
	render() {
		return ( <RootRouter /> );
	}
}