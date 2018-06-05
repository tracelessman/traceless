/**
 * Created by renbaogang on 2018/2/7.
 */
import React from 'react';
import { Image, Keyboard, StyleSheet,Text,TextInput,TouchableOpacity,
    TouchableWithoutFeedback,View} from 'react-native';
import WSChannel from '../channel/LocalWSChannel';
import Store from "../store/LocalStore";
import MainView from "./MainView";
import AppUtil from "../AppUtil";
import UUID from 'uuid/v4';
import RSAKey from 'react-native-rsa';

export default class RegisterView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid:AppUtil.isFreeRegister()?UUID():"",
            registering:false
        };
        this.uid = this.state.uid;
        const bits = 2048;
        const exponent = '10001';
        let rsa = new RSAKey();
        rsa.generate(bits, exponent);
        this.publicKey = rsa.getPublicString(); // return json encoded string
        this.privateKey = rsa.getPrivateString(); // return js
        //alert(this.publicKey);
        //alert(this.privateKey);
        // var rsa2 = new RSAKey();
        // rsa2.setPublicString(this.publicKey);
        // var originText = 'sample String Value';
        // var encrypted = rsa2.encrypt(originText);
        //
        // var rsa3 = new RSAKey();
        // rsa3.setPrivateString(this.privateKey);
        // var decrypted = rsa3.decrypt(encrypted);
        // alert(decrypted);
    }

    dismissKeyboard=()=>{
        Keyboard.dismiss();
    }

    nameTextChange=(v)=>{
        this.name = v;
    }

    ipTextChange=(v)=>{
        this.ip = v;
    }
    uidTextChange=(v)=>{
        this.uid=v;
    }

    register=()=>{
        if(AppUtil.isFreeRegister()&&!this.name){
            alert("请输入昵称");
            return;
        }
        if(!this.ip){
            alert("请输入服务器ip");
            return;
        }
        if(!this.uid){
            alert("请录入用户标识");
            return;
        }

        this.setState({registering:true});
        WSChannel.register(this.ip,this.uid,this.name,this.publicKey,(data)=>{
            this.setState({registering:false});
            if(data.err){
                alert(data.err);
            }else{
                let name = AppUtil.isFreeRegister()?this.name:data.name;
                Store.saveKey(name,this.ip,this.uid,this.publicKey,this.privateKey);
                AppUtil.reset();
            }
        },()=>{
            this.setState({registering:false});
            alert("访问服务器失败");
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
                <View style={{flex:1,justifyContent: 'center',alignItems: 'center',flexDirection:"column"}}>
                    {AppUtil.isFreeRegister()?
                        [<View key="1" style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                            <Text style={{fontSize:16,marginRight:20,color:'gray'}}>昵      称:</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={""} onChangeText={this.nameTextChange} />
                        </View>,
                            <View key="2" style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>]

                        :null}

                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                        <Text style={{fontSize:16,marginRight:20,color:'gray'}}>服务器IP:</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={""} onChangeText={this.ipTextChange} />
                    </View>
                    <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>
                    <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                        <Text style={{fontSize:16,marginRight:20,color:'gray'}}>用户标识:</Text>
                        {
                            AppUtil.isFreeRegister()?<Text style={{flex:1,color:"gray"}} > {this.uid}</Text>:<TextInput style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={this.uid} onChangeText={this.uidTextChange} />
                        }
                    </View>
                    <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>

                    <TouchableOpacity disabled={this.state.registering} onPress={this.register} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>{this.state.registering?"注册中...":"注册"}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        );

    }
}