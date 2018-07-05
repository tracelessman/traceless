
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
import ActionSheet from '@expo/react-native-action-sheet';
import PropTypes from 'prop-types'

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

    getChildContext = ()=>{
        return {
            actionSheet: () => this._actionSheetRef,
        };
    }

    render() {

        return (
            <Root>
                <ActionSheet ref={(component) => (this._actionSheetRef = component)}>
                    <View style={styles.container}>
                        <App></App>
                    </View>
                </ActionSheet>
            </Root>

        );
    }

}

Entry.childContextTypes = {
    actionSheet: PropTypes.func,
};

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
