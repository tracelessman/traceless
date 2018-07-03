
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Linking,
    NativeModules,Platform,
    StyleSheet,Text,View,PushNotificationIOS,AppState
} from 'react-native';
import AppUtil from "./AppUtil"
import {Root, Spinner, Toast} from "native-base"
import App from './App'

console.ignoredYellowBox = ['Setting a timer','Remote debugger']

AppUtil.init()

export default class Entry extends Component<{}> {
    constructor(props){
        super(props);
    }

    componentWillMount =()=> {

    }

    componentWillUnmount =()=> {

    }

    render() {

        return (
            <Root>
                <View style={styles.container}>
                    <App></App>
                </View>
            </Root>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
