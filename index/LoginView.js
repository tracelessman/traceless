/**
 * Created by renbaogang on 2017/10/23.
 */
import React from 'react';
import { StyleSheet, Text, View,TextInput,Keyboard,TouchableWithoutFeedback,
    TouchableOpacity,Image} from 'react-native';
import WSChannel from '../channel/LocalWSChannel';
import Store from "../store/LocalStore";
import MainView from "./MainView";
import AppUtil from "../AppUtil"

export default class LoginView extends React.Component {

    constructor(props){
        super(props);
        var data = this.props.data;
        // alert(JSON.stringify(data));
        var keyData = data?data[0]:null;
        if(keyData){

            this.state={
                id : keyData.id,
                disabledRegistry:false,
                logining:this.props.logining
            };
            this.ip = keyData.server;
            this.publicKey = keyData.publicKey;
            this.privateKey = keyData.privateKey;
            this.name = keyData.name;

        }else{
            this.state={
                disabledRegistry:false,
                logining:this.props.logining
            };
        }
    }

    dismissKeyboard=()=>{
        Keyboard.dismiss();
    }

    login=()=>{
        if(!this.name){
            alert("请输入昵称");
            return;
        }
        if(!this.ip){
            alert("请输入服务器ip");
            return;
        }
        if(!this.state.id){
            alert("您还未有身份，请申请身份");
            return;
        }
        this.setState({logining:true});
        WSChannel.login(this.name,this.state.id,this.ip,(msg)=>{
            if(!msg.err){
                // Store.setCurrentUid(this.state.id);
                this.setState({login:true,logining:false});

            }else{
                alert(msg.err);
                this.setState({logining:false});

            }
        },()=>{
            this.setState({logining:false});
            alert("无法访问服务器");
        });

    }

    nameTextChange=(v)=>{
        this.name = v;
    }

    ipTextChange=(v)=>{
        this.ip = v;
    }

    generateKey=()=>{

        if(!this.name){
            alert("请输入昵称");
            return;
        }
        if(!this.ip){
            alert("请输入服务器ip");
            return;
        }
        this.setState({ disabledRegistry:true});
        WSChannel.generateKey(this.name,this.ip,(data,error)=>{
            if(error){
                alert(error);
                this.setState({ disabledRegistry:false});
            }else{
                this.publicKey = data.publicKey;
                this.privateKey = data.privateKey;
                this.setState({id:data.id});
                Store.saveKey(this.name,this.ip,this.state.id,this.publicKey,this.privateKey);
            }
        })
    }

    reset=()=>{
        Store.reset();
        AppUtil.reset();
    }

    render() {
        if(this.state.login){
            return <MainView></MainView>;
        }else
        return (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
            <View style={{flex:1,justifyContent: 'center',alignItems: 'center',flexDirection:"column"}}>
                {AppUtil.isFreeRegister()?
                    [<View key="1" style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                    <Text style={{fontSize:16,marginRight:20,color:'gray'}}>昵      称:</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={this.name?this.name:""} onChangeText={this.nameTextChange} />
                    </View>,
                    <View key="2" style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>]

                    :null}

                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                    <Text style={{fontSize:16,marginRight:20,color:'gray'}}>服务器IP:</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' defaultValue={this.ip?this.ip:""} onChangeText={this.ipTextChange} />
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",width:"90%",height:40}}>
                    <Text style={{fontSize:16,marginRight:20,color:'gray'}}>用户标识:</Text><TextInput  style={{flex:1,color:"gray"}} underlineColorAndroid='transparent' editable={false} defaultValue={this.state.id?this.state.id:""}/>
                    {
                        this.state.id ? null :
                        <TouchableOpacity onPress={this.generateKey} disabled={this.state.disabledRegistry}>
                            <Image source={require('../images/refresh.png')} style={{width: 20, height: 20}}
                                   resizeMode="contain"></Image>
                        </TouchableOpacity>
                    }
                </View>
                <View style={{width:"90%",height:0,borderTopWidth:1,borderColor:"#f0f0f0"}}></View>
                <TouchableOpacity disabled={this.state.logining} onPress={this.login} style={{marginTop:30,width:"90%",height:40,borderColor:"gray",borderWidth:1,borderRadius:5,flex:0,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                    <Text style={{fontSize:18,textAlign:"center",color:"gray"}}>{this.state.logining?"登录中...":"登录"}</Text>
                </TouchableOpacity>
                <View style={{marginTop:10,width:"90%",flexDirection: 'row',justifyContent: 'flex-end',alignItems: 'center'}}>
                    <TouchableOpacity onPress={this.reset}>
                    <Text style={{fontSize:14,textAlign:"center",color:"gray"}}>重置>></Text>
                    </TouchableOpacity>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width:"90%",
        flexDirection:"row",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
