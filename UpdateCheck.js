
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,AsyncStorage,
    NativeModules
} from 'react-native';
import LoginView from "./index/LoginView"
import Store from "./store/LocalStore"
import AppUtil from "./AppUtil"
import MainView from "./index/MainView";
import WSChannel from './channel/LocalWSChannel';
import ScanRegisterView from './index/ScanRegisterView';
import { Root } from "native-base"
const  RNFS = require('react-native-fs');
import App from './App'
import md5 from "react-native-md5";
import RNFetchBlob from 'react-native-fetch-blob'

const axios = require('axios')
const url = "http://123.207.145.167:3000"
const versionLocal = require('./package').version
const semver = require('semver')


// console.log(md5.hex_md5('test'))

console.ignoredYellowBox = ['Setting a timer','Remote debugger']


export default class UpdateCheck extends Component<{}> {

    constructor(props){
        super(props);
        let mode = 'check'
        if(Platform.OS !== 'android'){
            mode = 'ready'
        }
        mode = 'ready'
        this.state={
            mode//"update",'ready'
        };
    }

    componentWillMount(){
        this.checkUpdate()
    }

    updateApp(){
        const filePath = RNFS.DocumentDirectoryPath + '/com.traceless.apk';
        const apkUrl = 'http://123.207.145.167:3000/pkg/traceless.apk'

        // const apkUrl = 'http://172.18.1.181:8066/pkg/traceless.apk'

        var download = RNFS.downloadFile({
            fromUrl:apkUrl ,
            toFile: filePath,
            progress: res => {
                console.log((res.bytesWritten / res.contentLength).toFixed(2));
            },
            progressDivider: 10
        });
        download.promise.then(result => {
            if(result.statusCode == 200){
                NativeModules.ToastExample.install(filePath);
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    checkUpdate(){
        axios.get(`${url}/update`)
            .then(function (response) {
                const {data} = response
                const {hash,version} = data

                if(semver.gt(version,versionLocal)){
                    this.updateApp()
                }
            }).catch(function (error) {
            console.log(error);
        });
    }



    render() {
        let content
        if(this.state.mode === 'ready'){
            content = <App></App>
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
