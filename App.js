/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

console.ignoredYellowBox = ['Setting a timer','Remote debugger']


export default class App extends Component<{}> {



    constructor(props){
        super(props);
        this.state={};
        AppUtil.setApp(this);
        this.seed=0;
    }

    componentDidMount=()=>{
        this.try2Login();
        Store.on("uidChanged",this._onSystemNotify);
    }

    _onSystemNotify=(uid)=>{
        if(uid){
            if(Platform.OS === 'android'){
                var tag = uid.replace(/\-/gi, '');
                AppUtil.setJpush({
                    clickHandler(msg){
                        if(msg.targetUid==Store.getCurrentUid()){
                            AppUtil.reset({view:"ChatView",param:{friend:Store.getFriend(msg.fromUid)}});
                        }
                    },
                    tag:tag
                }).then((result)=>{
                    const {registrationId} = result

                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }

    componentWillUnmount =()=> {
        Store.un("uidChanged",this._onSystemNotify);
    }

    reset=(t)=>{
        this.seed++;
        if(Store.getLoginState())
            this.setState({reset:true});
        else
            this.try2Login();
    }

    try2Login=()=>{
        Store.fetchAllKeys((data)=>{
            if(data&&data.length>0){
                var cur = data[0];
                //登录
                this.setState({data:data,logining:true});
                WSChannel.login(cur.name,cur.id,cur.clientId,cur.server,(msg)=>{
                    this.seed++;
                    if(!msg.err){
                        // Store.setCurrentUid(cur.id) ;
                        this.setState({data:data,logining:false});
                    }else{
                        this.setState({data:data,logining:false});
                    }

                },()=> {
                    this.seed++;
                    alert("无法访问服务器");
                    this.setState({data:data,logining:false});
                });
            }else{
                //null 需注册
                this.setState({data:null});
            }
        });
    }

    render() {
        //console.info(this.state.key);
        var content=null;
        if(Store.getLoginState()){
            content = <MainView key={this.seed} />
        }else if(this.state.data){
            content=<LoginView key={this.seed} data={this.state.data} logining={this.state.logining}></LoginView>;
        }else if(this.state.data===null){
            content=<ScanRegisterView key={this.seed}></ScanRegisterView>
        }else{
            content = <Text style={{textAlign:"center",marginTop:"50%"}}>loading...</Text>
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
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
