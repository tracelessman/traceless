/**
 * Created by renbaogang on 2018/2/23.
 */

import React from 'react';
import { StyleSheet, Text, View,TextInput,Keyboard,TouchableWithoutFeedback,
    TouchableOpacity,Image,Modal} from 'react-native';
import WSChannel from '../channel/LocalWSChannel';
import Store from "../store/LocalStore";
import MainView from "./MainView";
import AppUtil from "../AppUtil";
import UUID from 'uuid/v4';
import RSAKey from 'react-native-rsa';
import ScanView from '../mine/ScanView'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class ScanRegisterView extends React.Component {

    constructor(props) {
        super(props);
        this.state={scanVisible:false,step:1};
    }

    componentDidMount=()=>{

        // setTimeout( ()=> {

        // },10);
    }

    showScanView=()=>{
        this.setState({scanVisible:true});
    }

    hideScanView=()=>{
        this.setState({scanVisible:false});
    }

    afterScan=(data)=>{
        this.isFreeRegister = data.free;
        this.ip=data.server;
        if(this.isFreeRegister){
            this.setState({scanVisible:false,step:2});
        }else{
            this.uid=data.uid;
            this.needCheckCode = data.needCheckCode;
            if(this.needCheckCode){
                this.setState({scanVisible:false,step:2});
            }else{
                this.setState({scanVisible:false});
                this.register();
            }
        }
    }

    nameTextChange=(v)=>{
        this.name = v;
    }

    checkCodeTextChange=(v)=>{
        this.checkCode = v;
    }

    cancel=()=>{
        this.setState({step:1});
    }

    createKey=()=>{
        const bits = 2048;
        const exponent = '10001';
        var rsa = new RSAKey();
        rsa.generate(bits, exponent);
        this.publicKey = rsa.getPublicString(); // return json encoded string
        this.privateKey = rsa.getPrivateString(); // return js
    }

    _doRegister = ()=>{
        this.createKey();
        this.setState({registerStep:"注册中......"});

        var uid=this.uid||UUID();
        WSChannel.register(this.ip,uid,this.name,this.publicKey,this.checkCode,(data)=>{
            this.setState({registering:false});
            if(data.err){
                alert(data.err);
            }else{
                Store.saveKey(data.name||this.name,this.ip,uid,this.publicKey,this.privateKey);
                AppUtil.reset();
            }
        },()=>{
            this.setState({registering:false});
            alert("访问服务器失败");
        });
    }

    register=()=>{
        if(this.isFreeRegister&&!this.name){
            alert("请输入昵称");
            return;
        }
        if(!this.isFreeRegister&&this.needCheckCode&&!this.checkCode){
            alert("请输入口令");
            return;
        }
        this.setState({registering:true,registerStep:"创建密钥中，这需要一定的时间......"});

        setTimeout( ()=> {
            this._doRegister();
        },10);

    }

    dismissKeyboard=()=>{
        Keyboard.dismiss();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
            <View style={{display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",flex:1,backgroundColor:"#ffffff"}}>
                <View style={{width:"100%",height:80,backgroundColor:"#ffffff",flexDirection:"column",justifyContent:"center"}}>
                    {
                        this.state.step==1?null:<TouchableOpacity style={{}} onPress={this.cancel}>
                            <Text style={{fontSize:16,paddingLeft:10}}>取消</Text>
                        </TouchableOpacity>
                    }

                </View>
                 {/*<View style={{width:100,height:100,borderWidth:1,borderStyle:"solid",borderColor:"#f0f0f0",marginTop:30,marginBottom:30,overflow:"hidden"}}>*/}
                    {/*<Icon name="user" size={70}  color="#d0d0d0" style={{textAlign:"center",lineHeight:90}}/>*/}
                 {/*</View>*/}
                <Image source={require('../images/traceless.png')} style={{width:100,height:100,margin:50}} resizeMode="contain"></Image>


                <View style={{height:40,backgroundColor:"#f0f0f0",width:"100%",flexDirection:"row",alignItems:"center"}}>
                    <View style={{width:4,height:18,backgroundColor:"#f9e160",marginLeft:10}}></View>
                    <Text style={{color:"#a0a0a0",paddingLeft:2,fontSize:12}}>{this.state.step==1?"注册":this.isFreeRegister?"来个炫酷的昵称":"请输入口令"}</Text>
                </View>
                {
                    this.state.step==1?
                        <TouchableOpacity style={{height:50,backgroundColor:"#ffffff",width:"100%",flexDirection:"row",borderBottomWidth:1,borderColor:"#f9e160"}} onPress={this.showScanView}>
                            <Icon name="qrcode" size={30}  color="#f9e160" style={{margin:10}}/>
                            <Text style={{lineHeight:50}}>扫码注册</Text>
                        </TouchableOpacity>
                            :
                        <View style={{height:120,backgroundColor:"#ffffff",width:"100%",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                            {this.isFreeRegister ?
                                <View style={{
                                    height: 50,
                                    width: "100%",
                                    flexDirection: "row",
                                    backgroundColor: "#ffffff"
                                }}>
                                    <Icon name="user-circle" size={30} color="#f9e160"
                                          style={{textAlign: "center", margin: 10}}/>
                                    <TextInput autoFocus={true} style={{
                                        height: 50,
                                        backgroundColor: "#ffffff",
                                        width: "100%",
                                        color: "gray"
                                    }} underlineColorAndroid='transparent' defaultValue={""}
                                               onChangeText={this.nameTextChange}/>
                                </View>
                                :
                                <View style={{
                                    height: 50,
                                    width: "100%",
                                    flexDirection: "row",
                                    backgroundColor: "#ffffff"
                                }}>
                                    <Icon name="lock" size={30} color="#f9e160"
                                          style={{textAlign: "center", margin: 10}}/>
                                    <TextInput autoFocus={true} style={{
                                        height: 50,
                                        backgroundColor: "#ffffff",
                                        width: "100%",
                                        color: "gray"
                                    }} underlineColorAndroid='transparent' defaultValue={""}
                                               onChangeText={this.checkCodeTextChange}/>
                                </View>
                            }
                            <View style={{width:"100%",height:0,borderTopWidth:1,borderColor:"#f9e160"}}></View>
                            <TouchableOpacity disabled={this.state.registering} onPress={this.register} style={{width:"90%",height:40,marginTop:24,borderColor:"#535353",backgroundColor:"#636363",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                                <Text style={{fontSize:18,textAlign:"center",color:"white"}}>{this.state.registering?this.state.registerStep:"完成"}</Text>
                                {this.state.registering?<Image source={require('../images/loading.gif')} style={{width:18,height:18,marginLeft:10}} resizeMode="contain"></Image>:null}
                            </TouchableOpacity>
                        </View>
                }
                <View style={{flex:1,width:"100%",backgroundColor:"#ffffff"}}>
                </View>
                <View style={{height:60,width:"100%",backgroundColor:"#f0f0f0"}}>
                    <Text style={{lineHeight:60,color:"#a0a0a0",textAlign:"center",fontSize:10}}>版本：v1.0</Text>
                </View>
                <Modal visible={this.state.scanVisible}>
                    <ScanView action="register" parent={this}></ScanView>
                </Modal>
            </View>
            </TouchableWithoutFeedback>
        );

    }
}