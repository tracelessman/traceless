/**
 * Created by renbaogang on 2018/2/8.
 */
import React, { Component} from 'react';
import { Text,View,Image,TouchableOpacity,Button,Switch,TextInput,StyleSheet} from 'react-native';
import Camera from 'react-native-camera';
import Store from "../store/LocalStore"

export default class ScanView extends Component<{}> {

    constructor(props) {
        super(props);
        this.action = props["action"];
        this.parent = props["parent"];
        this.state={data:null};
        this.data = null;
    }

    onBarCodeRead =(e) =>{
        try{
            var d = JSON.parse(e.data);
            if(d.code=="traceless"&&!this.data){
                if(d.action=="authorize"){
                    this.setState({msg:"等待目标设备响应..."});
                    this.data = d;
                    this.authorizeOther();
                }else if(d.action=="register"){
                    this.setState({msg:"扫码成功..."});
                    this.data = d;
                    this.parent.afterScan(d);
                }
            }
        }catch(e){

        }
    }

    cancel=()=>{
        this.parent.hideScanView();
    }

    authorizeOther = ()=>{
        var uri = this.data.uri;
        var ws = new WebSocket('ws://'+uri);
        var scanV = this;
        ws.onmessage = function incoming(message) {
            var msg = JSON.parse(message.data);
            if(msg.state){//done
                ws.close();
            }
            if(msg.msg){
                scanV.setState({msg:msg.msg});
            }
        };
        ws.onerror = function incoming(event) {
            scanV.setState({msg:"网络连接错误，务必保证目标设备和手机连接同一WIFI"});
        };
        ws.onclose = (event)=>{


        };
        ws.onopen = function () {
            var msg={};
            msg.name = Store.keyData.name;
            msg.id = Store.keyData.id;
            msg.publicKey = Store.keyData.publicKey;
            msg.privateKey = Store.keyData.privateKey;
            msg.server = Store.keyData.server;
            msg.friends = Store.keyData.friends;
            msg.groups = Store.keyData.groups;
            ws.send(JSON.stringify(msg));
            scanV.setState({msg:"注册中，请稍后..."});
        };


    }

    render() {
        if(this.data){

            return (
                <View style={styles.container}>
                    <Text>{this.state.msg}</Text>
                </View>);
        }else{
            return (
                <View style={styles.container}>

                    <Camera
                        onBarCodeRead={this.onBarCodeRead}
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
                                <Text style={{color: "white", textAlign: "center"}}>确保两台设备连接至同一wifi</Text>
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