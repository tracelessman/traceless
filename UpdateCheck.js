
import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage,
    Linking,
    NativeModules,Platform,
    StyleSheet,Text,View,PushNotificationIOS
} from 'react-native';
import LoginView from "./index/LoginView"
import Store from "./store/LocalStore"
import AppUtil from "./AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil
import MainView from "./index/MainView";
import WSChannel from './channel/LocalWSChannel';
import ScanRegisterView from './index/ScanRegisterView';
import {Root, Spinner, Toast} from "native-base"
const  RNFS = require('react-native-fs');
import App from './App'
import RNFetchBlob from 'react-native-fetch-blob'
import * as Progress from 'react-native-progress';

// import update from 'react-native-update'
// console.log(update)




const axios = require('axios')
const versionLocal = require('./package').version
const semver = require('semver')
const config = require('./config')
// console.log(md5.hex_md5('test'))
const {updateJsonUrl,apkUrl,appName,ipaUrl,ppkUrl} = config

console.ignoredYellowBox = ['Setting a timer','Remote debugger']


export default class UpdateCheck extends Component<{}> {

    constructor(props){
        super(props);

        AppUtil.init()
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
        WSChannel.on("afterLogin", this.checkUpdate);
        this.checkUpdate()
    }

    componentWillUnmount =()=> {

    }


    checkUpdate = debounceFunc(()=>{
        axios.get(updateJsonUrl)
            .then( (response)=> {
                const {data} = response
                const {hash,version,nativeUpdate} = data
                if(semver.gt(version,versionLocal)){
                    this.nativeUpdate(hash,version)
                    // if(nativeUpdate){
                    //
                    // }else{
                    //     let options = {
                    //         updateUrl: ppkUrl,
                    //         hash: "_" + version + "_",  //hash必须是字符串
                    //         update : true
                    //     }
                    //     downloadUpdate(options).then(hash => {
                    //         this.setState({
                    //             mode:"update"
                    //         })
                    //         switchVersion(hash)
                    //     }).catch(error => {
                    //         Toast.show({
                    //             text: '下载更新出现错误,请联系技术人员',
                    //             position: "top",
                    //             type:"warning",
                    //             duration: 5000
                    //         })
                    //         Alert.alert(
                    //             '提示',
                    //             `下载更新出现错误,请联系技术人员`,
                    //             [
                    //                 {
                    //                     text: '确认',
                    //                     onPress:()=>{
                    //                         this.setState({mode:'ready'});
                    //                     }
                    //
                    //                 },
                    //             ],
                    //             { cancelable: false }
                    //         )
                    //
                    //     });
                    // }
                }
            }).catch(function (error) {
                console.log(error);
            });
    },1000*60*1)

    nativeUpdate = (hash,version)=>{
        if(Platform.OS === 'android'){
            let filePath = RNFS.ExternalDirectoryPath + `/${appName}.apk`
            RNFetchBlob.config({
                useDownloadManager : true,
                fileCache : true,
                path:filePath
            }).fetch('GET',apkUrl)
                .progress({ count : 10 }, (received, total) => {
                    // console.log(received)
                    // console.log(total)
                    // console.log('progress', received / total)
                })
                .then((res)=>{
                    this.installApp(filePath,hash,version)
                })
                .catch((err) => {
                    console.log(err)

                })
        }else{
            this.informUpdate(version, () => {
                Linking.openURL(`itms-services://?action=download-manifest&url=${ipaUrl}`)
            })

        }
    }

    informUpdate(version,onPress){
        Alert.alert(
            '提示',
            `有最新版本${version},是否马上升级?`,
            [
                {
                    text: '确认',
                    onPress
                },
            ],
            { cancelable: false }
        )
    }

    installApp = (filePath,hash,version)=>{
        RNFS.hash(filePath,'md5').then(localHash=>{
            if(localHash === hash){
                this.informUpdate(version,()=>{
                    NativeModules.ToastExample.install(filePath);
                })
            }else{
                setTimeout(()=>{
                    this.checkUpdate()
                },1000*60)
            }
        })
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
