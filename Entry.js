
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Linking,
    NativeModules,Platform,
    StyleSheet,Text,View,PushNotificationIOS,AppState
} from 'react-native';
import LoginView from "./index/LoginView"
import Store from "./store/LocalStore"
import AppUtil from "./AppUtil"
import  pushUtil from "./util/pushUtil"
import  updateUtil from "./util/updateUtil"
const {getAvatarSource,debounceFunc} = AppUtil
import MainView from "./index/MainView";
import WSChannel from './channel/LocalWSChannel';
import ScanRegisterView from './index/ScanRegisterView';
import {Root, Spinner, Toast} from "native-base"
const  RNFS = require('react-native-fs');
import App from './App'
import RNFetchBlob from 'react-native-fetch-blob'
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info'


console.ignoredYellowBox = ['Setting a timer','Remote debugger']


const axios = require('axios')
const versionLocal = require('./package').version
const semver = require('semver')
const config = require('./config')
const {appName} = config

AppUtil.init()

export default class UpdateCheck extends Component<{}> {
    constructor(props){
        super(props);

        let mode = 'check'
        if(Platform.OS !== 'android'){
            mode = 'ready'
        }
        mode = 'ready'
        this.state={
            mode,//"update",'ready'
            percent:"0%",
            progress:0,

        };
    }

    componentWillMount =()=> {


    }

    componentWillUnmount =()=> {

    }








    render() {
        let content
        if(this.state.mode === 'ready'){
            content = <App></App>
        }else if(this.state.mode === 'update'){
            content =
                <View style={{display:'flex',justifyContent:"center",alignItems:"center",height:"100%"}}>

                    {/*<Progress.Circle  showsText formatText={(progress)=>this.state.percent} progress={this.state.progress} size={100} />*/}
                    <Text style={{margin:30}}>
                        更新中......
                    </Text>
                </View>

        }

        return (
            <Root>
                <View style={styles.container}>
                    {content}
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
