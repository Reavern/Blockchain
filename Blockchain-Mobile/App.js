import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LoginScreen from './components/LoginScreen.js';
import HomeScreen from './components/main/HomeScreen.js';
import TestScreen from './components/main/TestScreen.js';

const MainRouter = TabNavigator({
	Home: {
		screen: HomeScreen,
	},
	Test: {
		screen: TestScreen,
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
})

const RootRouter = StackNavigator({
  	Login: {
		screen: LoginScreen,
	},
	Main: {
		screen: MainRouter,
	}
}, {
	navigationOptions: {
		headerStyle: {
			height: 0
		}
	}
})

export default class App extends React.Component {
	render() {
		return ( <RootRouter /> );
	}
}
