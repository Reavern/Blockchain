import React from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';


export default class App extends React.Component {

	componentDidMount() {
		const resetAction = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: 'Login' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return ( <View/> )
	}
}