/**
 * Created by renbaogang on 2018/2/8.
 */
import React, { Component} from 'react';
import {Alert, Button, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Camera from 'react-native-camera';
import Store from "../store/LocalStore"
import { NetworkInfo } from 'react-native-network-info';
import RNFetchBlob from "react-native-fetch-blob";
const util = require('../util')
const AppUtil = require('../AppUtil')
const {debounceFunc} = util
const config = require('../config')

export default class ScanView extends Component<{}> {

    constructor(props) {
        super(props);
        this.action = props.action;
        this.parent = props.parent;
        this.state={data:null};
        this.data = null;
    }

    onBarCodeRead =(e) =>{
        try{
            let d = JSON.parse(e.data);

            if(d.action === 'fetchData'){
                const {uid,clientId} = d
                const tmpFilePath =  `${RNFetchBlob.fs.dirs.CacheDir}/${uid}.json`

                RNFetchBlob.config({
                    useDownloadManager : true,
                    fileCache : true,
                    path:tmpFilePath
                }).fetch('GET',`${config.url}/upload/${uid}.json`).then((res)=>{
                    RNFetchBlob.fs.readFile(tmpFilePath, 'utf8')
                        .then((data) => {
                            let keyData = JSON.parse(data)


                            keyData.clientId = clientId
                            Store.data.splice(0,1,keyData);
                            Store._save();

                            setTimeout(()=>{
                                AppUtil.reset();
                            },1000*5)


                        })


                }).catch(err=>{
                    console.log(err)
                    Alert.alert('error')
                })
            }else{
                if(d.code=="traceless"&&!this.data){
                    if(d.action=="authorize"){
                        this.setState({msg:"等待目标设备响应..."});
                        this.data = d;
                        this.authorizeOther();
                    }else if(d.action==this.action){
                        this.setState({msg:"扫码成功..."});
                        this.data = d;
                        this.parent.afterScan(d);
                    }
                }
            }

        }catch(e){

        }
    }

    cancel=()=>{
        this.parent.hideScanView();
    }

    authorizeOther = ()=>{
        NetworkInfo.getIPAddress(ip => {
            try{
                let ipSeg = ip.substring(0,ip.lastIndexOf("."));
                let addresses = this.data.addresses;
                let serverIP;
                for(var i=0;i<addresses.length;i++){
                    if(addresses[i].indexOf(ipSeg)==0){
                        serverIP = addresses[i];
                    }
                }

                if(!serverIP){
                    ipSeg = ipSeg.substring(0,ipSeg.lastIndexOf("."));
                    for(var i=0;i<addresses.length;i++){
                        if(addresses[i].indexOf(ipSeg)==0){
                            serverIP = addresses[i];
                        }
                    }
                }
                if(serverIP){
                    let uri = serverIP+":"+this.data.port;
                    let ws = new WebSocket('ws://'+uri);
                    var scanV = this;
                    ws.onmessage = function incoming(message) {
                        let msg = JSON.parse(message.data);
                        if(msg.state){//done
                            ws.close();
                            scanV.setState({msg:"授权成功"});
                        }else if(msg.msg){
                            scanV.setState({msg:msg.msg});
                        }
                    };
                    ws.onerror = function incoming(event) {
                        scanV.setState({msg:"网络连接错误 "+(event?event.toString():"")});
                    };
                    ws.onclose = (event)=>{

                    };
                    ws.onopen = function () {
                        let msg={};
                        msg.name = Store.keyData.name;
                        msg.id = Store.keyData.id;
                        msg.publicKey = Store.keyData.publicKey;
                        msg.privateKey = Store.keyData.privateKey;
                        msg.serverPublicKey = Store.keyData.serverPublicKey;
                        msg.server = Store.keyData.server;
                        msg.friends = Store.keyData.friends;
                        msg.groups = Store.keyData.groups;
                        msg.pic = Store.keyData.pic;
                        ws.send(JSON.stringify(msg));
                        scanV.setState({msg:"请稍后..."});
                    };
                }else{
                    scanV.setState({msg:"目标设备和手机并非连接同一WIFI"});
                }


            }catch(e){
                console.info(e);
            }
        });



    }

    render() {
        if(this.data){
            return (
                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",paddingTop:50}}>
                    <Text>{this.state.msg}</Text>
                </View>);
        }else{
            return (
                <View style={styles.container}>

                    <Camera
                        onBarCodeRead={debounceFunc(this.onBarCodeRead,1000*2)}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.full}>
                        <View style={{flex:1,backgroundColor:"#000",opacity:0.5,width:"100%"}}/>
                        <View style={{width:"100%",height:250,flexDirection:"row",justifyContent:"space-between"}}>
                            <View style={{flex:1,backgroundColor:"#000",opacity:0.5,height:"100%"}}/>
                            <View style={{width:250,height:250,borderWidth:1,borderColor:"#f0f0f0",borderStyle:"dotted"}}>
                                <View style={{width:15,height:15,borderLeftWidth:2,borderTopWidth:2,borderColor:"#f9e160"}}/>
                                <View style={{width:15,height:15,borderTopWidth:2,borderRightWidth:2,borderColor:"#f9e160",right:0,position:"absolute"}}/>
                                <View style={{width:15,height:15,borderLeftWidth:2,borderBottomWidth:2,borderColor:"#f9e160",bottom:0,position:"absolute"}}/>
                                <View style={{width:15,height:15,borderRightWidth:2,borderBottomWidth:2,borderColor:"#f9e160",bottom:0,right:0,position:"absolute"}}/>
                            </View>
                            <View style={{flex:1,backgroundColor:"#000",opacity:0.5,height:"100%"}}/>
                        </View>
                        {
                            this.action == "register" ?
                                <TouchableOpacity onPress={this.cancel} style={{
                                    flex: 2,
                                    backgroundColor: "#000",
                                    opacity: 0.5,
                                    width: "100%",
                                    flexDirection: "column",
                                    justifyContent: "center"
                                }}><Text style={{color: "white", textAlign: "center",fontSize:18}}>取  消</Text></TouchableOpacity>
                                :
                            <View style={{
                                flex: 2,
                                backgroundColor: "#000",
                                opacity: 0.5,
                                width: "100%",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <Text style={{color: "white", textAlign: "center"}}>{this.action == "authorize"?确保两台设备连接至同一wifi:""}</Text>
                            </View>
                        }

                    </Camera>
                </View>);
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});
