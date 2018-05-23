
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,AsyncStorage,
    NativeModules,Alert
} from 'react-native';
import LoginView from "./index/LoginView"
import Store from "./store/LocalStore"
import AppUtil from "./AppUtil"
import MainView from "./index/MainView";
import WSChannel from './channel/LocalWSChannel';
import ScanRegisterView from './index/ScanRegisterView';
import { Root ,Spinner} from "native-base"
const  RNFS = require('react-native-fs');
import App from './App'
import md5 from "react-native-md5";
import RNFetchBlob from 'react-native-fetch-blob'
import * as Progress from 'react-native-progress';

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
            mode,//"update",'ready'
            percent:"0%",
            progress:0,

        };
    }

    componentWillMount =()=> {
        if(Platform.OS === 'android'){
            WSChannel.on("afterLogin", this.checkUpdate);
        }
    }

    componentWillUnmount =()=> {
        if(Platform.OS === 'android'){
            WSChannel.un("afterLogin", this.checkUpdate);
        }

    }

    updateApp= ()=>{
        this.setState({
            mode:"update"
        })
        // const filePath = RNFS.DocumentDirectoryPath + '/com.traceless.apk';
        const filePath = RNFS.ExternalStorageDirectoryPath + '/com.traceless.apk';
        console.log(filePath)
        // NativeModules.ToastExample.install(filePath);
        const apkUrl = 'https://github.com/tracelessman/traceless/raw/publish/app-release.apk'

        // const apkUrl = 'http://172.18.1.181:8066/pkg/traceless.apk'

        const download = RNFS.downloadFile({
            fromUrl:apkUrl ,
            toFile: filePath,
            progress: res => {
                let progress = res.bytesWritten / res.contentLength
                const percent = (progress*100).toFixed(0)+"%"
                this.setState({
                    progress,percent
                })

            },
            progressDivider: 1
        });

        download.promise.then(result => {
            if(result.statusCode == 200){
                NativeModules.ToastExample.install(filePath);
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    checkUpdate = ()=>{
        axios.get(`https://raw.githubusercontent.com/tracelessman/traceless/publish/update.json`)
            .then( (response)=> {
                const {data} = response
                const {hash,version} = data
                const updateApp = this.updateApp
                if(semver.gt(version,versionLocal)){
                  Alert.alert(
                      '提示',
                      `有最新版本${version},是否马上升级?`,
                      [
                          {text: '取消', onPress: () => {}, style: 'cancel'},
                          {text: '确认', onPress: () => {
                                updateApp()
                              }},
                      ],
                      { cancelable: false }
                  )

                }
            }).catch(function (error) {
            console.log(error);
        });
    }



    render() {
        let content
        if(this.state.mode === 'ready'){
            content = <App></App>
        }else if(this.state.mode === 'update'){
            content = (
                <View style={{display:'flex',justifyContent:"center",alignItems:"center",height:"100%"}}>

                    <Progress.Circle  showsText formatText={(progress)=>{return this.state.percent}} progress={this.state.progress} size={100} />
                    <Text style={{margin:30}}>
                        更新中......
                    </Text>
                </View>
            )
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
