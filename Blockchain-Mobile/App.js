import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform, TouchableOpacity } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/Entypo';

import LoginScreen from './components/pages/LoginScreen.js';
import VotingScreen from './components/pages/VotingScreen.js';
import BlockchainScreen from './components/pages/BlockchainScreen.js';
import LogOutScreen from './components/pages/LogOutScreen.js';
import RegisterScreen from './components/pages/RegisterScreen.js';
import CreateVoteScreen from './components/pages/CreateVoteScreen.js';
import HomeScreen from './components/pages/HomeScreen.js';


import DrawerMenu from './components/menus/DrawerMenu.js';

import './components/javascripts/Consensus.js'
import './components/javascripts/GlobalConst.js'


const MainRouter = DrawerNavigator({
	Home: 			{ screen: HomeScreen, navigationOptions: {title: 'Home'} },
	Voting: 		{ screen: VotingScreen, navigationOptions: {title: 'Voting'} },
	Blockchain: 	{ screen: BlockchainScreen, navigationOptions: {title: 'View Recent Blocks'} },
	CreateVote: 	{ screen: CreateVoteScreen, navigationOptions: {title: 'Create Vote'} },
	LogOut: 		{ screen: LogOutScreen }
}, {
	contentComponent: DrawerMenu
})

const RootRouter = StackNavigator({
  	Login: {
		screen: LoginScreen, navigationOptions: {title: 'Login'}
	},
	Register: {
		screen: RegisterScreen, navigationOptions: {title: 'Register'}
	},
  	MainMenu: {
		screen: MainRouter,
		navigationOptions: ({navigation}) => ({
			headerLeft: 
			<TouchableOpacity
				onPress={() => { navigation.navigate('DrawerToggle') }}>
				<Icon name="menu" size={40} color="black" style={{marginLeft: 10}}/>
			</TouchableOpacity>
		})
	},

})


export default class App extends React.Component {


	render() {
		return ( <RootRouter /> );
	}
}